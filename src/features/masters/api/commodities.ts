import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Commodity, CreateCommodityInput, UpdateCommodityInput } from "../types";
import { SEED_COMMODITIES } from "@/config/constants";

const client = generateClient<Schema>();

export async function fetchCommodities(organizationId: string): Promise<Commodity[]> {
  const { data, errors } =
    await client.models.Commodity.listCommodityByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Commodity[];
}

export async function createCommodity(input: CreateCommodityInput): Promise<Commodity> {
  const { data, errors } = await client.models.Commodity.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create commodity");
  }

  return data as unknown as Commodity;
}

export async function updateCommodity(input: UpdateCommodityInput): Promise<Commodity> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Commodity.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update commodity");
  }

  return data as unknown as Commodity;
}

export async function deleteCommodity(id: string): Promise<void> {
  const { errors } = await client.models.Commodity.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextCommodityCode(organizationId: string): Promise<string> {
  const commodities = await fetchCommodities(organizationId);
  const codes = commodities
    .map((c) => parseInt(c.code, 10))
    .filter((n) => !isNaN(n));

  const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
  return String(maxCode + 1).padStart(3, "0");
}

export async function seedCommodities(organizationId: string): Promise<Commodity[]> {
  const results: Commodity[] = [];

  for (let i = 0; i < SEED_COMMODITIES.length; i++) {
    const commodity = SEED_COMMODITIES[i];
    const code = String(i + 1).padStart(3, "0");

    const { data, errors } = await client.models.Commodity.create({
      organizationId,
      name: commodity.name,
      code,
      commodityType: commodity.commodityType,
      rentRatePKT3: commodity.rentRatePKT3,
      gracePeriod: commodity.gracePeriod,
      rentBasis: commodity.rentBasis,
      hsnCode: commodity.hsnCode,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed commodity ${commodity.name}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as Commodity);
    }
  }

  return results;
}

export type ProgressCallback = (completed: number, currentItem: string, skipped?: number) => void;

export async function seedCommoditiesWithProgress(
  organizationId: string,
  onProgress?: ProgressCallback
): Promise<{ results: Commodity[]; skipped: number }> {
  const results: Commodity[] = [];

  // Fetch existing commodities to check which names already exist
  onProgress?.(0, "Checking existing commodities...");
  const existingCommodities = await fetchCommodities(organizationId);
  const existingNameMap = new Map<string, Commodity>();
  for (const commodity of existingCommodities) {
    existingNameMap.set(commodity.name.toLowerCase(), commodity);
  }

  let skippedCount = 0;
  let completed = 0;

  for (let i = 0; i < SEED_COMMODITIES.length; i++) {
    const commodity = SEED_COMMODITIES[i];

    // Skip if commodity with this name already exists (case-insensitive)
    const existingCommodity = existingNameMap.get(commodity.name.toLowerCase());
    if (existingCommodity) {
      skippedCount++;
      completed++;
      results.push(existingCommodity);
      onProgress?.(completed, `${commodity.name} (already exists)`, skippedCount);
      continue;
    }

    // Get next available code
    const code = await getNextCommodityCode(organizationId);
    onProgress?.(completed, commodity.name);

    const { data, errors } = await client.models.Commodity.create({
      organizationId,
      name: commodity.name,
      code,
      commodityType: commodity.commodityType,
      rentRatePKT3: commodity.rentRatePKT3,
      gracePeriod: commodity.gracePeriod,
      rentBasis: commodity.rentBasis,
      hsnCode: commodity.hsnCode,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed commodity ${commodity.name}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as Commodity);
      completed++;
      onProgress?.(completed, commodity.name, skippedCount);
    }
  }

  return { results, skipped: skippedCount };
}
