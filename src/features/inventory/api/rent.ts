import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Rent, CreateRentInput, UpdateRentInput } from "../types";

const client = generateClient<Schema>();

export async function fetchRentList(organizationId: string): Promise<Rent[]> {
  const { data, errors } =
    await client.models.Rent.listRentByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Rent[];
}

export async function createRent(input: CreateRentInput): Promise<Rent> {
  const { data, errors } = await client.models.Rent.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create rent record");
  }

  return data as unknown as Rent;
}

export async function updateRent(input: UpdateRentInput): Promise<Rent> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Rent.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update rent record");
  }

  return data as unknown as Rent;
}

export async function deleteRent(id: string): Promise<void> {
  const { errors } = await client.models.Rent.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextRentSerialNo(organizationId: string): Promise<number> {
  const rents = await fetchRentList(organizationId);
  const numbers = rents
    .map((r) => r.serialNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
