import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Village, CreateVillageInput, UpdateVillageInput } from "../types";

const client = generateClient<Schema>();

export async function fetchVillages(organizationId: string): Promise<Village[]> {
  const { data, errors } =
    await client.models.Village.listVillageByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Village[];
}

export async function createVillage(input: CreateVillageInput): Promise<Village> {
  const { data, errors } = await client.models.Village.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create village");
  }

  return data as unknown as Village;
}

export async function updateVillage(input: UpdateVillageInput): Promise<Village> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Village.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update village");
  }

  return data as unknown as Village;
}

export async function deleteVillage(id: string): Promise<void> {
  const { errors } = await client.models.Village.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextVillageCode(organizationId: string): Promise<string> {
  const villages = await fetchVillages(organizationId);
  const codes = villages
    .map((v) => parseInt(v.code, 10))
    .filter((n) => !isNaN(n));

  const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
  return String(maxCode + 1).padStart(3, "0");
}
