import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  ShiftingHeader,
  CreateShiftingHeaderInput,
  UpdateShiftingHeaderInput,
  Shifting,
  CreateShiftingInput,
  UpdateShiftingInput,
} from "../types";

const client = generateClient<Schema>();

// ShiftingHeader operations
export async function fetchShiftingHeaders(organizationId: string): Promise<ShiftingHeader[]> {
  const { data, errors } = await client.models.ShiftingHeader.listShiftingHeaderByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as ShiftingHeader[];
}

export async function fetchShiftingHeader(id: string): Promise<ShiftingHeader | null> {
  const { data, errors } = await client.models.ShiftingHeader.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as ShiftingHeader | null;
}

export async function createShiftingHeader(input: CreateShiftingHeaderInput): Promise<ShiftingHeader> {
  const { data, errors } = await client.models.ShiftingHeader.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create shifting header");
  }

  return data as unknown as ShiftingHeader;
}

export async function updateShiftingHeader(input: UpdateShiftingHeaderInput): Promise<ShiftingHeader> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.ShiftingHeader.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update shifting header");
  }

  return data as unknown as ShiftingHeader;
}

export async function deleteShiftingHeader(id: string): Promise<void> {
  const { errors } = await client.models.ShiftingHeader.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextShiftNo(organizationId: string): Promise<number> {
  const headers = await fetchShiftingHeaders(organizationId);
  const numbers = headers.map((h) => h.shiftNo);
  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}

// Shifting (detail lines) operations
export async function fetchShiftings(organizationId: string): Promise<Shifting[]> {
  const { data, errors } = await client.models.Shifting.listShiftingByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Shifting[];
}

export async function fetchShiftingsByHeaderId(shiftingHeaderId: string): Promise<Shifting[]> {
  const { data, errors } = await client.models.Shifting.listShiftingByShiftingHeaderId({
    shiftingHeaderId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Shifting[];
}

export async function fetchShiftingsByAmadId(amadId: string): Promise<Shifting[]> {
  const { data, errors } = await client.models.Shifting.listShiftingByAmadId({
    amadId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Shifting[];
}

export async function fetchShifting(id: string): Promise<Shifting | null> {
  const { data, errors } = await client.models.Shifting.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as Shifting | null;
}

export async function createShifting(input: CreateShiftingInput): Promise<Shifting> {
  const { data, errors } = await client.models.Shifting.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create shifting");
  }

  return data as unknown as Shifting;
}

export async function updateShifting(input: UpdateShiftingInput): Promise<Shifting> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Shifting.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update shifting");
  }

  return data as unknown as Shifting;
}

export async function deleteShifting(id: string): Promise<void> {
  const { errors } = await client.models.Shifting.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
