import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { BardanaType, CreateBardanaTypeInput, UpdateBardanaTypeInput } from "../types";

const client = generateClient<Schema>();

export async function fetchBardanaTypeList(organizationId: string): Promise<BardanaType[]> {
  const { data, errors } =
    await client.models.BardanaType.listBardanaTypeByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as BardanaType[];
}

export async function fetchBardanaTypeById(id: string): Promise<BardanaType> {
  const { data, errors } = await client.models.BardanaType.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Bardana type not found");
  }

  return data as unknown as BardanaType;
}

export async function createBardanaType(input: CreateBardanaTypeInput): Promise<BardanaType> {
  const { data, errors } = await client.models.BardanaType.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bardana type");
  }

  return data as unknown as BardanaType;
}

export async function updateBardanaType(input: UpdateBardanaTypeInput): Promise<BardanaType> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.BardanaType.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update bardana type");
  }

  return data as unknown as BardanaType;
}

export async function deleteBardanaType(id: string): Promise<void> {
  const { errors } = await client.models.BardanaType.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
