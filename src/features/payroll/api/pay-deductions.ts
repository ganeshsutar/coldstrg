import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PayDeduction,
  CreatePayDeductionInput,
  UpdatePayDeductionInput,
} from "../types";

const client = generateClient<Schema>();

// ==================== PayDeduction CRUD ====================

export async function fetchPayDeductionList(
  organizationId: string
): Promise<PayDeduction[]> {
  const { data, errors } =
    await client.models.PayDeduction.listPayDeductionByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (d) => d.isActive !== false
  ) as unknown as PayDeduction[];
}

export async function fetchPayDeductionById(id: string): Promise<PayDeduction> {
  const { data, errors } = await client.models.PayDeduction.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Deduction not found");
  }

  return data as unknown as PayDeduction;
}

export async function createPayDeduction(
  input: CreatePayDeductionInput
): Promise<PayDeduction> {
  const { data, errors } = await client.models.PayDeduction.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create deduction");
  }

  return data as unknown as PayDeduction;
}

export async function updatePayDeduction(
  input: UpdatePayDeductionInput
): Promise<PayDeduction> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PayDeduction.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update deduction");
  }

  return data as unknown as PayDeduction;
}

export async function deletePayDeduction(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.PayDeduction.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
