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
