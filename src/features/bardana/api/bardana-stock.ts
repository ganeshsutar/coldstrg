import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { BardanaStock, CreateBardanaStockInput, UpdateBardanaStockInput } from "../types";

const client = generateClient<Schema>();

export async function fetchBardanaStockList(organizationId: string): Promise<BardanaStock[]> {
  const { data, errors } =
    await client.models.BardanaStock.listBardanaStockByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as BardanaStock[];
}

export async function fetchBardanaStockByParty(
  organizationId: string,
  partyId: string
): Promise<BardanaStock[]> {
  const { data, errors } =
    await client.models.BardanaStock.listBardanaStockByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // Filter by organization
  const filtered = (data || []).filter(
    (s) => s.organizationId === organizationId
  );

  return filtered as unknown as BardanaStock[];
}

export async function fetchBardanaStockByType(
  organizationId: string,
  bardanaTypeId: string
): Promise<BardanaStock[]> {
  const { data, errors } =
    await client.models.BardanaStock.listBardanaStockByBardanaTypeId({
      bardanaTypeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // Filter by organization
  const filtered = (data || []).filter(
    (s) => s.organizationId === organizationId
  );

  return filtered as unknown as BardanaStock[];
}

export async function createBardanaStock(input: CreateBardanaStockInput): Promise<BardanaStock> {
  const { data, errors } = await client.models.BardanaStock.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bardana stock");
  }

  return data as unknown as BardanaStock;
}

export async function updateBardanaStock(input: UpdateBardanaStockInput): Promise<BardanaStock> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.BardanaStock.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update bardana stock");
  }

  return data as unknown as BardanaStock;
}

export async function upsertBardanaStock(
  organizationId: string,
  partyId: string,
  bardanaTypeId: string,
  updates: Partial<CreateBardanaStockInput>
): Promise<BardanaStock> {
  // Try to find existing record
  const existing = await fetchBardanaStockByParty(organizationId, partyId);
  const record = existing.find((s) => s.bardanaTypeId === bardanaTypeId);

  if (record) {
    // Update existing
    return updateBardanaStock({
      id: record.id,
      ...updates,
    });
  } else {
    // Create new
    return createBardanaStock({
      organizationId,
      partyId,
      bardanaTypeId,
      ...updates,
    });
  }
}
