import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Chamber, CreateChamberInput, UpdateChamberInput } from "../types";

const client = generateClient<Schema>();

export async function fetchChambers(organizationId: string): Promise<Chamber[]> {
  const { data, errors } = await client.models.Chamber.listChamberByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Chamber[];
}

export async function fetchChamber(id: string): Promise<Chamber | null> {
  const { data, errors } = await client.models.Chamber.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as Chamber | null;
}

export async function createChamber(input: CreateChamberInput): Promise<Chamber> {
  const { data, errors } = await client.models.Chamber.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create chamber");
  }

  return data as unknown as Chamber;
}

export async function updateChamber(input: UpdateChamberInput): Promise<Chamber> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Chamber.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update chamber");
  }

  return data as unknown as Chamber;
}

export async function deleteChamber(id: string): Promise<void> {
  const { errors } = await client.models.Chamber.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextChamberCode(organizationId: string): Promise<string> {
  const chambers = await fetchChambers(organizationId);
  const codes = chambers
    .map((c) => parseInt(c.code, 10))
    .filter((n) => !isNaN(n));

  const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
  return String(maxCode + 1).padStart(2, "0");
}

export async function getNextRoomNumber(organizationId: string): Promise<number> {
  const chambers = await fetchChambers(organizationId);
  const roomNumbers = chambers.map((c) => c.roomNumber);
  const maxRoom = roomNumbers.length > 0 ? Math.max(...roomNumbers) : 0;
  return maxRoom + 1;
}
