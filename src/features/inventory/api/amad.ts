import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Amad, CreateAmadInput, UpdateAmadInput } from "../types";

const client = generateClient<Schema>();

export async function fetchAmadList(organizationId: string): Promise<Amad[]> {
  const { data, errors } =
    await client.models.Amad.listAmadByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Amad[];
}

export async function fetchAmadById(id: string): Promise<Amad> {
  const { data, errors } = await client.models.Amad.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Amad not found");
  }

  return data as unknown as Amad;
}

export async function createAmad(input: CreateAmadInput): Promise<Amad> {
  const { data, errors } = await client.models.Amad.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create amad");
  }

  return data as unknown as Amad;
}

export async function updateAmad(input: UpdateAmadInput): Promise<Amad> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Amad.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update amad");
  }

  return data as unknown as Amad;
}

export async function deleteAmad(id: string): Promise<void> {
  const { errors } = await client.models.Amad.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextAmadNo(organizationId: string): Promise<number> {
  const amads = await fetchAmadList(organizationId);
  const numbers = amads
    .map((a) => a.amadNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
