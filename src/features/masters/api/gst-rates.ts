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
