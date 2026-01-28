import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Takpatti, CreateTakpattiInput } from "../types";

const client = generateClient<Schema>();

export async function fetchTakpattiList(organizationId: string): Promise<Takpatti[]> {
  const { data, errors } =
    await client.models.Takpatti.listTakpattiByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Takpatti[];
}

export async function createTakpatti(input: CreateTakpattiInput): Promise<Takpatti> {
  const { data, errors } = await client.models.Takpatti.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create takpatti");
  }

  return data as unknown as Takpatti;
}

export async function deleteTakpatti(id: string): Promise<void> {
  const { errors } = await client.models.Takpatti.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextTakpattiNo(organizationId: string): Promise<number> {
  const takpattis = await fetchTakpattiList(organizationId);
  const numbers = takpattis
    .map((t) => t.takpattiNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
