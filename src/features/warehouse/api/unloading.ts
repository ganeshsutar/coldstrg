import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Unloading, CreateUnloadingInput, UpdateUnloadingInput } from "../types";

const client = generateClient<Schema>();

export async function fetchUnloadings(organizationId: string): Promise<Unloading[]> {
  const { data, errors } = await client.models.Unloading.listUnloadingByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Unloading[];
}

export async function fetchUnloadingsByChamberId(chamberId: string): Promise<Unloading[]> {
  const { data, errors } = await client.models.Unloading.listUnloadingByChamberId({
    chamberId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Unloading[];
}

export async function fetchUnloadingsByAmadId(amadId: string): Promise<Unloading[]> {
  const { data, errors } = await client.models.Unloading.listUnloadingByAmadId({
    amadId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Unloading[];
}

export async function fetchUnloading(id: string): Promise<Unloading | null> {
  const { data, errors } = await client.models.Unloading.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as Unloading | null;
}

export async function createUnloading(input: CreateUnloadingInput): Promise<Unloading> {
  const { data, errors } = await client.models.Unloading.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create unloading");
  }

  return data as unknown as Unloading;
}

export async function updateUnloading(input: UpdateUnloadingInput): Promise<Unloading> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Unloading.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update unloading");
  }

  return data as unknown as Unloading;
}

export async function deleteUnloading(id: string): Promise<void> {
  const { errors } = await client.models.Unloading.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextUnloadingNo(organizationId: string): Promise<number> {
  const unloadings = await fetchUnloadings(organizationId);
  const numbers = unloadings.map((u) => u.unloadingNo);
  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
