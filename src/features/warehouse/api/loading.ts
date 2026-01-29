import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Loading, CreateLoadingInput, UpdateLoadingInput } from "../types";

const client = generateClient<Schema>();

export async function fetchLoadings(organizationId: string): Promise<Loading[]> {
  const { data, errors } = await client.models.Loading.listLoadingByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Loading[];
}

export async function fetchLoadingsByChamberId(chamberId: string): Promise<Loading[]> {
  const { data, errors } = await client.models.Loading.listLoadingByChamberId({
    chamberId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Loading[];
}

export async function fetchLoadingsByAmadId(amadId: string): Promise<Loading[]> {
  const { data, errors } = await client.models.Loading.listLoadingByAmadId({
    amadId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Loading[];
}

export async function fetchLoading(id: string): Promise<Loading | null> {
  const { data, errors } = await client.models.Loading.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as Loading | null;
}

export async function createLoading(input: CreateLoadingInput): Promise<Loading> {
  const { data, errors } = await client.models.Loading.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create loading");
  }

  return data as unknown as Loading;
}

export async function updateLoading(input: UpdateLoadingInput): Promise<Loading> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Loading.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update loading");
  }

  return data as unknown as Loading;
}

export async function deleteLoading(id: string): Promise<void> {
  const { errors } = await client.models.Loading.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextLoadingNo(organizationId: string): Promise<number> {
  const loadings = await fetchLoadings(organizationId);
  const numbers = loadings.map((l) => l.loadingNo);
  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
