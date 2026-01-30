import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PayAllowance,
  CreatePayAllowanceInput,
  UpdatePayAllowanceInput,
} from "../types";

const client = generateClient<Schema>();

// ==================== PayAllowance CRUD ====================

export async function fetchPayAllowanceList(
  organizationId: string
): Promise<PayAllowance[]> {
  const { data, errors } =
    await client.models.PayAllowance.listPayAllowanceByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (a) => a.isActive !== false
  ) as unknown as PayAllowance[];
}

export async function fetchPayAllowanceById(id: string): Promise<PayAllowance> {
  const { data, errors } = await client.models.PayAllowance.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Allowance not found");
  }

  return data as unknown as PayAllowance;
}

export async function createPayAllowance(
  input: CreatePayAllowanceInput
): Promise<PayAllowance> {
  const { data, errors } = await client.models.PayAllowance.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create allowance");
  }

  return data as unknown as PayAllowance;
}

export async function updatePayAllowance(
  input: UpdatePayAllowanceInput
): Promise<PayAllowance> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PayAllowance.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update allowance");
  }

  return data as unknown as PayAllowance;
}

export async function deletePayAllowance(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.PayAllowance.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
