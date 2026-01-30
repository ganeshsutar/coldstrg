import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PayIncrements,
  CreatePayIncrementsInput,
  UpdatePayIncrementsInput,
  Employee,
} from "../types";
import { updateEmployee } from "./employees";

const client = generateClient<Schema>();

// ==================== PayIncrements CRUD ====================

export async function fetchPayIncrementsList(
  organizationId: string
): Promise<PayIncrements[]> {
  const { data, errors } =
    await client.models.PayIncrements.listPayIncrementsByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (i) => i.isActive !== false
  ) as unknown as PayIncrements[];
}

export async function fetchPayIncrementsById(id: string): Promise<PayIncrements> {
  const { data, errors } = await client.models.PayIncrements.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Increment record not found");
  }

  return data as unknown as PayIncrements;
}

export async function fetchPayIncrementsByEmployee(
  employeeId: string
): Promise<PayIncrements[]> {
  const { data, errors } =
    await client.models.PayIncrements.listPayIncrementsByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (i) => i.isActive !== false
  ) as unknown as PayIncrements[];
}

export async function fetchLatestIncrementByEmployee(
  employeeId: string
): Promise<PayIncrements | null> {
  const increments = await fetchPayIncrementsByEmployee(employeeId);

  if (increments.length === 0) return null;

  // Sort by date descending
  increments.sort(
    (a, b) =>
      new Date(b.incrementDate).getTime() - new Date(a.incrementDate).getTime()
  );

  return increments[0];
}

export async function createPayIncrements(
  input: CreatePayIncrementsInput
): Promise<PayIncrements> {
  const { data, errors } = await client.models.PayIncrements.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create increment record");
  }

  return data as unknown as PayIncrements;
}

export async function updatePayIncrements(
  input: UpdatePayIncrementsInput
): Promise<PayIncrements> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PayIncrements.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update increment record");
  }

  return data as unknown as PayIncrements;
}

export async function deletePayIncrements(id: string): Promise<void> {
  const { errors } = await client.models.PayIncrements.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Increment Operations ====================

export async function createIncrementAndUpdateEmployee(
  organizationId: string,
  employee: Employee,
  newBasic: number,
  newGross: number,
  incrementDate: string,
  reason?: string,
  approvedBy?: string
): Promise<{ increment: PayIncrements; employee: Employee }> {
  const previousBasic = employee.basicSalary;
  const previousGross = employee.grossSalary;

  const incrementAmount = newBasic - previousBasic;
  const incrementPercent =
    previousBasic > 0
      ? ((newBasic - previousBasic) / previousBasic) * 100
      : 0;

  // Create increment record
  const increment = await createPayIncrements({
    organizationId,
    employeeId: employee.id,
    employeeCode: employee.code,
    employeeName: `${employee.firstName} ${employee.lastName || ""}`.trim(),
    incrementDate,
    previousBasic,
    previousGross,
    newBasic,
    newGross,
    incrementAmount,
    incrementPercent: Math.round(incrementPercent * 100) / 100,
    pfRate: 12,
    esiRate: 0.75,
    reason,
    approvedBy,
    approvedAt: approvedBy ? new Date().toISOString() : undefined,
  });

  // Update employee salary
  const updatedEmployee = await updateEmployee({
    id: employee.id,
    basicSalary: newBasic,
    grossSalary: newGross,
  });

  return { increment, employee: updatedEmployee as Employee };
}

export async function getIncrementHistory(
  employeeId: string
): Promise<{
  increments: PayIncrements[];
  totalIncrements: number;
  averageIncrement: number;
  lastIncrementDate: string | null;
}> {
  const increments = await fetchPayIncrementsByEmployee(employeeId);

  // Sort by date
  increments.sort(
    (a, b) =>
      new Date(a.incrementDate).getTime() - new Date(b.incrementDate).getTime()
  );

  const totalIncrementAmount = increments.reduce(
    (sum, i) => sum + i.incrementAmount,
    0
  );
  const averageIncrement =
    increments.length > 0 ? totalIncrementAmount / increments.length : 0;

  return {
    increments,
    totalIncrements: increments.length,
    averageIncrement: Math.round(averageIncrement * 100) / 100,
    lastIncrementDate:
      increments.length > 0
        ? increments[increments.length - 1].incrementDate
        : null,
  };
}

// ==================== Statistics ====================

export async function getIncrementStats(
  organizationId: string,
  year?: number
): Promise<{
  totalIncrements: number;
  totalAmount: number;
  averagePercent: number;
  employeesReceived: number;
}> {
  let increments = await fetchPayIncrementsList(organizationId);

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    increments = increments.filter(
      (i) => i.incrementDate >= startDate && i.incrementDate <= endDate
    );
  }

  const uniqueEmployees = new Set(increments.map((i) => i.employeeId));
  const totalPercent = increments.reduce(
    (sum, i) => sum + i.incrementPercent,
    0
  );

  return {
    totalIncrements: increments.length,
    totalAmount: increments.reduce((sum, i) => sum + i.incrementAmount, 0),
    averagePercent:
      increments.length > 0
        ? Math.round((totalPercent / increments.length) * 100) / 100
        : 0,
    employeesReceived: uniqueEmployees.size,
  };
}
