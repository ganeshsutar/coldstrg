import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Daybook, CreateDaybookInput } from "../types";

const client = generateClient<Schema>();

export async function fetchDaybookList(organizationId: string): Promise<Daybook[]> {
  const { data, errors } =
    await client.models.Daybook.listDaybookByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Daybook[];
}

export async function fetchDaybookByDate(
  organizationId: string,
  date: string
): Promise<Daybook | null> {
  const daybooks = await fetchDaybookList(organizationId);
  return daybooks.find((d) => d.date === date) || null;
}

export async function fetchDaybookById(id: string): Promise<Daybook> {
  const { data, errors } = await client.models.Daybook.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Daybook entry not found");
  }

  return data as unknown as Daybook;
}

export async function createDaybook(input: CreateDaybookInput): Promise<Daybook> {
  const { data, errors } = await client.models.Daybook.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create daybook entry");
  }

  return data as unknown as Daybook;
}

export async function updateDaybook(
  id: string,
  input: Partial<CreateDaybookInput>
): Promise<Daybook> {
  const { data, errors } = await client.models.Daybook.update({
    id,
    ...input,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update daybook entry");
  }

  return data as unknown as Daybook;
}

export async function deleteDaybook(id: string): Promise<void> {
  const { errors } = await client.models.Daybook.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// Get or create daybook for a specific date
export async function getOrCreateDaybook(
  organizationId: string,
  date: string
): Promise<Daybook> {
  const existing = await fetchDaybookByDate(organizationId, date);
  if (existing) return existing;

  return createDaybook({
    organizationId,
    date,
    description: `Daybook for ${date}`,
  });
}
