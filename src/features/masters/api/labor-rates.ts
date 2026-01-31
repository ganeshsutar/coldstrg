import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { LaborRate, CreateLaborRateInput } from "../types";
import { SEED_LABOR_RATES } from "@/config/constants";

const client = generateClient<Schema>();

export async function fetchLaborRates(organizationId: string): Promise<LaborRate[]> {
  const { data, errors } =
    await client.models.LaborRate.listLaborRateByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as LaborRate[];
}

export async function createLaborRate(input: CreateLaborRateInput): Promise<LaborRate> {
  const { data, errors } = await client.models.LaborRate.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create labor rate");
  }

  return data as unknown as LaborRate;
}

export async function deleteLaborRate(id: string): Promise<void> {
  const { errors } = await client.models.LaborRate.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function seedLaborRates(organizationId: string): Promise<LaborRate[]> {
  const results: LaborRate[] = [];

  for (const rate of SEED_LABOR_RATES) {
    const { data, errors } = await client.models.LaborRate.create({
      organizationId,
      rateType: rate.rateType,
      ratePKT1: rate.ratePKT1,
      effectiveDate: new Date().toISOString(),
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed labor rate ${rate.rateType}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as LaborRate);
    }
  }

  return results;
}

export type ProgressCallback = (completed: number, currentItem: string, skipped?: number) => void;

// Fixed effective date for seeded labor rates
const SEED_EFFECTIVE_DATE = "2024-01-01T00:00:00.000Z";

export async function seedLaborRatesWithProgress(
  organizationId: string,
  onProgress?: ProgressCallback
): Promise<{ results: LaborRate[]; skipped: number }> {
  const results: LaborRate[] = [];

  // Fetch existing labor rates to check which rate types already exist
  onProgress?.(0, "Checking existing labor rates...");
  const existingRates = await fetchLaborRates(organizationId);
  const existingTypeMap = new Map<string, LaborRate>();
  for (const rate of existingRates) {
    existingTypeMap.set(rate.rateType, rate);
  }

  let skippedCount = 0;
  let completed = 0;

  for (let i = 0; i < SEED_LABOR_RATES.length; i++) {
    const rate = SEED_LABOR_RATES[i];

    // Skip if labor rate with this type already exists
    const existingRate = existingTypeMap.get(rate.rateType);
    if (existingRate) {
      skippedCount++;
      completed++;
      results.push(existingRate);
      onProgress?.(completed, `${rate.rateType} (already exists)`, skippedCount);
      continue;
    }

    onProgress?.(completed, rate.rateType);

    const { data, errors } = await client.models.LaborRate.create({
      organizationId,
      rateType: rate.rateType,
      ratePKT1: rate.ratePKT1,
      effectiveDate: SEED_EFFECTIVE_DATE,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed labor rate ${rate.rateType}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as LaborRate);
      completed++;
      onProgress?.(completed, rate.rateType, skippedCount);
    }
  }

  return { results, skipped: skippedCount };
}
