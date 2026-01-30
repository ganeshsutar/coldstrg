import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PaySDeduction,
  CreatePaySDeductionInput,
  UpdatePaySDeductionInput,
} from "../types";

const client = generateClient<Schema>();

// ==================== Staff Deduction CRUD ====================

export async function fetchStaffDeductionList(
  organizationId: string
): Promise<PaySDeduction[]> {
  const { data, errors } =
    await client.models.PaySDeduction.listPaySDeductionByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (d) => d.isActive !== false
  ) as unknown as PaySDeduction[];
}

export async function fetchStaffDeductionById(
  id: string
): Promise<PaySDeduction> {
  const { data, errors } = await client.models.PaySDeduction.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Staff deduction not found");
  }

  return data as unknown as PaySDeduction;
}

export async function fetchStaffDeductionsByEmployee(
  employeeId: string
): Promise<PaySDeduction[]> {
  const { data, errors } =
    await client.models.PaySDeduction.listPaySDeductionByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (d) => d.isActive !== false
  ) as unknown as PaySDeduction[];
}

export async function fetchActiveStaffDeductionsByEmployee(
  employeeId: string,
  asOfDate?: string
): Promise<PaySDeduction[]> {
  const deductions = await fetchStaffDeductionsByEmployee(employeeId);
  const checkDate = asOfDate || new Date().toISOString().split("T")[0];

  return deductions.filter((d) => {
    const effectiveFrom = d.effectiveFrom;
    const effectiveTo = d.effectiveTo;

    if (effectiveFrom > checkDate) return false;
    if (effectiveTo && effectiveTo < checkDate) return false;

    return true;
  });
}

export async function createStaffDeduction(
  input: CreatePaySDeductionInput
): Promise<PaySDeduction> {
  const { data, errors } = await client.models.PaySDeduction.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create staff deduction");
  }

  return data as unknown as PaySDeduction;
}

export async function updateStaffDeduction(
  input: UpdatePaySDeductionInput
): Promise<PaySDeduction> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PaySDeduction.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update staff deduction");
  }

  return data as unknown as PaySDeduction;
}

export async function deleteStaffDeduction(id: string): Promise<void> {
  const { errors } = await client.models.PaySDeduction.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
