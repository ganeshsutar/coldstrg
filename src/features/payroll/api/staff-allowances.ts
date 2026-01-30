import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PaySAllowance,
  CreatePaySAllowanceInput,
  UpdatePaySAllowanceInput,
} from "../types";

const client = generateClient<Schema>();

// ==================== Staff Allowance CRUD ====================

export async function fetchStaffAllowanceList(
  organizationId: string
): Promise<PaySAllowance[]> {
  const { data, errors } =
    await client.models.PaySAllowance.listPaySAllowanceByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (a) => a.isActive !== false
  ) as unknown as PaySAllowance[];
}

export async function fetchStaffAllowanceById(
  id: string
): Promise<PaySAllowance> {
  const { data, errors } = await client.models.PaySAllowance.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Staff allowance not found");
  }

  return data as unknown as PaySAllowance;
}

export async function fetchStaffAllowancesByEmployee(
  employeeId: string
): Promise<PaySAllowance[]> {
  const { data, errors } =
    await client.models.PaySAllowance.listPaySAllowanceByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (a) => a.isActive !== false
  ) as unknown as PaySAllowance[];
}

export async function fetchActiveStaffAllowancesByEmployee(
  employeeId: string,
  asOfDate?: string
): Promise<PaySAllowance[]> {
  const allowances = await fetchStaffAllowancesByEmployee(employeeId);
  const checkDate = asOfDate || new Date().toISOString().split("T")[0];

  return allowances.filter((a) => {
    const effectiveFrom = a.effectiveFrom;
    const effectiveTo = a.effectiveTo;

    if (effectiveFrom > checkDate) return false;
    if (effectiveTo && effectiveTo < checkDate) return false;

    return true;
  });
}

export async function createStaffAllowance(
  input: CreatePaySAllowanceInput
): Promise<PaySAllowance> {
  const { data, errors } = await client.models.PaySAllowance.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create staff allowance");
  }

  return data as unknown as PaySAllowance;
}

export async function updateStaffAllowance(
  input: UpdatePaySAllowanceInput
): Promise<PaySAllowance> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PaySAllowance.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update staff allowance");
  }

  return data as unknown as PaySAllowance;
}

export async function deleteStaffAllowance(id: string): Promise<void> {
  const { errors } = await client.models.PaySAllowance.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
