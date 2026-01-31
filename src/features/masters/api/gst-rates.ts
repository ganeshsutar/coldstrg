import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { GstRate, CreateGstRateInput, UpdateGstRateInput } from "../types";
import { SEED_GST_RATES } from "@/config/constants";

const client = generateClient<Schema>();

export async function fetchGstRates(organizationId: string): Promise<GstRate[]> {
  const { data, errors } =
    await client.models.GstRate.listGstRateByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as GstRate[];
}

export async function createGstRate(input: CreateGstRateInput): Promise<GstRate> {
  const { data, errors } = await client.models.GstRate.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create GST rate");
  }

  return data as unknown as GstRate;
}

export async function updateGstRate(input: UpdateGstRateInput): Promise<GstRate> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.GstRate.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update GST rate");
  }

  return data as unknown as GstRate;
}

export async function deleteGstRate(id: string): Promise<void> {
  const { errors } = await client.models.GstRate.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function seedGstRates(organizationId: string): Promise<GstRate[]> {
  const results: GstRate[] = [];

  for (const rate of SEED_GST_RATES) {
    const { data, errors } = await client.models.GstRate.create({
      organizationId,
      description: rate.description,
      cgstRate: rate.cgstRate,
      sgstRate: rate.sgstRate,
      igstRate: rate.igstRate,
      effectiveDate: new Date().toISOString(),
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed GST rate ${rate.description}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as GstRate);
    }
  }

  return results;
}

export type ProgressCallback = (completed: number, currentItem: string, skipped?: number) => void;

// Fixed effective date for seeded GST rates
const SEED_EFFECTIVE_DATE = "2024-01-01T00:00:00.000Z";

export async function seedGstRatesWithProgress(
  organizationId: string,
  onProgress?: ProgressCallback
): Promise<{ results: GstRate[]; skipped: number }> {
  const results: GstRate[] = [];

  // Fetch existing GST rates to check which descriptions already exist
  onProgress?.(0, "Checking existing GST rates...");
  const existingRates = await fetchGstRates(organizationId);
  const existingDescriptionMap = new Map<string, GstRate>();
  for (const rate of existingRates) {
    if (rate.description) {
      existingDescriptionMap.set(rate.description.toLowerCase(), rate);
    }
  }

  let skippedCount = 0;
  let completed = 0;

  for (let i = 0; i < SEED_GST_RATES.length; i++) {
    const rate = SEED_GST_RATES[i];

    // Skip if GST rate with this description already exists (case-insensitive)
    const existingRate = existingDescriptionMap.get(rate.description.toLowerCase());
    if (existingRate) {
      skippedCount++;
      completed++;
      results.push(existingRate);
      onProgress?.(completed, `${rate.description} (already exists)`, skippedCount);
      continue;
    }

    onProgress?.(completed, rate.description);

    const { data, errors } = await client.models.GstRate.create({
      organizationId,
      description: rate.description,
      cgstRate: rate.cgstRate,
      sgstRate: rate.sgstRate,
      igstRate: rate.igstRate,
      effectiveDate: SEED_EFFECTIVE_DATE,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed GST rate ${rate.description}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as GstRate);
      completed++;
      onProgress?.(completed, rate.description, skippedCount);
    }
  }

  return { results, skipped: skippedCount };
}
