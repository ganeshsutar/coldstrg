import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  DWage,
  CreateDWageInput,
  UpdateDWageInput,
  DWageFormInput,
} from "../types";
import { getNextSerialNo } from "../utils";

const client = generateClient<Schema>();

// ==================== DWage CRUD ====================

export async function fetchDWageList(organizationId: string): Promise<DWage[]> {
  const { data, errors } =
    await client.models.DWage.listDWageByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((d) => d.isActive !== false) as unknown as DWage[];
}

export async function fetchDWageById(id: string): Promise<DWage> {
  const { data, errors } = await client.models.DWage.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Daily wage entry not found");
  }

  return data as unknown as DWage;
}

export async function fetchDWageByDate(
  organizationId: string,
  date: string
): Promise<DWage[]> {
  const wages = await fetchDWageList(organizationId);
  return wages.filter((w) => w.date === date);
}

export async function fetchDWageByDateRange(
  organizationId: string,
  startDate: string,
  endDate: string
): Promise<DWage[]> {
  const wages = await fetchDWageList(organizationId);
  return wages.filter((w) => w.date >= startDate && w.date <= endDate);
}

export async function fetchUnpaidDWages(organizationId: string): Promise<DWage[]> {
  const wages = await fetchDWageList(organizationId);
  return wages.filter((w) => !w.isPaid);
}

export async function createDWage(input: CreateDWageInput): Promise<DWage> {
  const { data, errors } = await client.models.DWage.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create daily wage entry");
  }

  return data as unknown as DWage;
}

export async function updateDWage(input: UpdateDWageInput): Promise<DWage> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.DWage.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update daily wage entry");
  }

  return data as unknown as DWage;
}

export async function deleteDWage(id: string): Promise<void> {
  const { errors } = await client.models.DWage.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextDWageSerialNo(
  organizationId: string
): Promise<number> {
  const wages = await fetchDWageList(organizationId);
  return getNextSerialNo(wages);
}

export async function createDWageFromForm(
  organizationId: string,
  formInput: DWageFormInput
): Promise<DWage> {
  const serialNo = await getNextDWageSerialNo(organizationId);

  // Calculate amounts
  const hoursWorked = formInput.hoursWorked ?? 0;
  const ratePerHour = formInput.ratePerHour ?? 0;
  const unitsCompleted = formInput.unitsCompleted ?? 0;
  const ratePerUnit = formInput.ratePerUnit ?? 0;
  const deductions = formInput.deductions ?? 0;

  const grossAmount =
    hoursWorked * ratePerHour + unitsCompleted * ratePerUnit;
  const netAmount = grossAmount - deductions;

  return createDWage({
    organizationId,
    serialNo,
    date: formInput.date,
    workerName: formInput.workerName,
    workerContact: formInput.workerContact,
    workType: formInput.workType,
    hoursWorked,
    ratePerHour,
    unitsCompleted,
    ratePerUnit,
    grossAmount,
    deductions,
    netAmount,
    isPaid: false,
    remarks: formInput.remarks,
  });
}

export async function markDWageAsPaid(
  id: string,
  paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI",
  paymentRef?: string
): Promise<DWage> {
  return updateDWage({
    id,
    isPaid: true,
    paidAt: new Date().toISOString(),
    paymentMode,
    paymentRef,
  });
}

export async function markBulkDWageAsPaid(
  ids: string[],
  paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI",
  paymentRef?: string
): Promise<DWage[]> {
  const results: DWage[] = [];

  for (const id of ids) {
    const result = await markDWageAsPaid(id, paymentMode, paymentRef);
    results.push(result);
  }

  return results;
}

// ==================== Statistics ====================

export async function getDWageStats(
  organizationId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  totalWorkers: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  unpaidCount: number;
}> {
  let wages = await fetchDWageList(organizationId);

  if (startDate && endDate) {
    wages = wages.filter((w) => w.date >= startDate && w.date <= endDate);
  }

  const uniqueWorkers = new Set(wages.map((w) => w.workerName));
  const paidWages = wages.filter((w) => w.isPaid);
  const unpaidWages = wages.filter((w) => !w.isPaid);

  return {
    totalWorkers: uniqueWorkers.size,
    totalAmount: wages.reduce((sum, w) => sum + w.netAmount, 0),
    paidAmount: paidWages.reduce((sum, w) => sum + w.netAmount, 0),
    unpaidAmount: unpaidWages.reduce((sum, w) => sum + w.netAmount, 0),
    unpaidCount: unpaidWages.length,
  };
}

export async function getDailyWagesSummary(
  organizationId: string,
  date: string
): Promise<{
  totalEntries: number;
  totalAmount: number;
  byWorkType: Record<string, { count: number; amount: number }>;
}> {
  const wages = await fetchDWageByDate(organizationId, date);

  const byWorkType: Record<string, { count: number; amount: number }> = {};

  for (const wage of wages) {
    const workType = wage.workType || "Other";
    if (!byWorkType[workType]) {
      byWorkType[workType] = { count: 0, amount: 0 };
    }
    byWorkType[workType].count++;
    byWorkType[workType].amount += wage.netAmount;
  }

  return {
    totalEntries: wages.length,
    totalAmount: wages.reduce((sum, w) => sum + w.netAmount, 0),
    byWorkType,
  };
}
