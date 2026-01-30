import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PaySATTN,
  CreatePaySATTNInput,
  UpdatePaySATTNInput,
  Employee,
} from "../types";
import {
  calculateSalaryBreakdown,
  getWorkingDaysInMonth,
  getDaysInMonth,
} from "../utils";
import { getAttendanceSummaryForMonth } from "./attendance";
import { fetchActiveStaffAllowancesByEmployee } from "./staff-allowances";
import { fetchActiveStaffDeductionsByEmployee } from "./staff-deductions";
import { fetchActivePayLoansByEmployee } from "./pay-loans";

const client = generateClient<Schema>();

// ==================== PaySATTN CRUD ====================

export async function fetchPaySATTNList(
  organizationId: string
): Promise<PaySATTN[]> {
  const { data, errors } =
    await client.models.PaySATTN.listPaySATTNByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (s) => s.isActive !== false
  ) as unknown as PaySATTN[];
}

export async function fetchPaySATTNById(id: string): Promise<PaySATTN> {
  const { data, errors } = await client.models.PaySATTN.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Salary record not found");
  }

  return data as unknown as PaySATTN;
}

export async function fetchPaySATTNByEmployee(
  employeeId: string
): Promise<PaySATTN[]> {
  const { data, errors } =
    await client.models.PaySATTN.listPaySATTNByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (s) => s.isActive !== false
  ) as unknown as PaySATTN[];
}

export async function fetchPaySATTNForMonth(
  organizationId: string,
  year: number,
  month: number
): Promise<PaySATTN[]> {
  const salaries = await fetchPaySATTNList(organizationId);
  return salaries.filter((s) => s.year === year && s.month === month);
}

export async function fetchEmployeePaySATTNForMonth(
  employeeId: string,
  year: number,
  month: number
): Promise<PaySATTN | null> {
  const salaries = await fetchPaySATTNByEmployee(employeeId);
  return salaries.find((s) => s.year === year && s.month === month) || null;
}

export async function createPaySATTN(
  input: CreatePaySATTNInput
): Promise<PaySATTN> {
  const { data, errors } = await client.models.PaySATTN.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create salary record");
  }

  return data as unknown as PaySATTN;
}

export async function updatePaySATTN(
  input: UpdatePaySATTNInput
): Promise<PaySATTN> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PaySATTN.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update salary record");
  }

  return data as unknown as PaySATTN;
}

export async function deletePaySATTN(id: string): Promise<void> {
  const { errors } = await client.models.PaySATTN.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Salary Processing ====================

export async function processSalaryForEmployee(
  organizationId: string,
  employee: Employee,
  year: number,
  month: number,
  processedBy?: string
): Promise<PaySATTN> {
  // Check if already processed
  const existing = await fetchEmployeePaySATTNForMonth(employee.id, year, month);
  if (existing && existing.status !== "DRAFT") {
    throw new Error("Salary already processed for this month");
  }

  // Get attendance summary
  const attendance = await getAttendanceSummaryForMonth(employee.id, year, month);

  // Get allowances and deductions
  const asOfDate = `${year}-${String(month).padStart(2, "0")}-15`;
  const allowances = await fetchActiveStaffAllowancesByEmployee(
    employee.id,
    asOfDate
  );
  const deductions = await fetchActiveStaffDeductionsByEmployee(
    employee.id,
    asOfDate
  );

  // Get active loans
  const loans = await fetchActivePayLoansByEmployee(employee.id);

  // Calculate salary
  const workingDays = getWorkingDaysInMonth(year, month);
  const totalDays = getDaysInMonth(year, month);

  const salaryBreakdown = calculateSalaryBreakdown({
    employee,
    allowances,
    deductions,
    activeLoans: loans,
    attendance,
    workingDays,
  });

  const input: CreatePaySATTNInput = {
    organizationId,
    employeeId: employee.id,
    employeeCode: employee.code,
    employeeName: `${employee.firstName} ${employee.lastName || ""}`.trim(),
    postId: employee.postId || undefined,
    postName: employee.postName || undefined,
    year,
    month,
    totalDays,
    workingDays,
    presentDays: attendance.presentDays,
    absentDays: attendance.absentDays,
    halfDays: attendance.halfDays,
    leaveDays: attendance.leaveDays,
    holidays: 0,
    weeklyOffs: totalDays - workingDays,
    effectiveDays: attendance.effectiveDays,
    otHours: 0,
    otAmount: salaryBreakdown.otAmount,
    basicSalary: salaryBreakdown.basicSalary,
    grossSalary: salaryBreakdown.grossSalary,
    totalAllowances: salaryBreakdown.totalAllowances,
    totalDeductions: salaryBreakdown.totalDeductions,
    pfAmount: salaryBreakdown.pfAmount,
    esiAmount: salaryBreakdown.esiAmount,
    tdsAmount: salaryBreakdown.tdsAmount,
    loanDeduction: salaryBreakdown.loanDeduction,
    advanceDeduction: salaryBreakdown.advanceDeduction,
    netSalary: salaryBreakdown.netSalary,
    status: "DRAFT",
    processedAt: new Date().toISOString(),
    processedBy,
  };

  if (existing) {
    return updatePaySATTN({
      id: existing.id,
      ...input,
    });
  }

  return createPaySATTN(input);
}

export async function processSalaryForAllEmployees(
  organizationId: string,
  employees: Employee[],
  year: number,
  month: number,
  processedBy?: string
): Promise<PaySATTN[]> {
  const results: PaySATTN[] = [];

  for (const employee of employees) {
    if (employee.status !== "ACTIVE") continue;

    try {
      const result = await processSalaryForEmployee(
        organizationId,
        employee,
        year,
        month,
        processedBy
      );
      results.push(result);
    } catch (error) {
      console.error(`Failed to process salary for ${employee.code}:`, error);
    }
  }

  return results;
}

export async function approveSalary(
  id: string,
  approvedBy: string
): Promise<PaySATTN> {
  const salary = await fetchPaySATTNById(id);

  if (salary.status !== "DRAFT" && salary.status !== "PROCESSED") {
    throw new Error("Salary cannot be approved in current status");
  }

  return updatePaySATTN({
    id,
    status: "APPROVED",
    approvedAt: new Date().toISOString(),
    approvedBy,
  });
}

export async function markSalaryPaid(
  id: string,
  paidBy: string,
  paymentMode?: string,
  paymentRef?: string
): Promise<PaySATTN> {
  const salary = await fetchPaySATTNById(id);

  if (salary.status !== "APPROVED") {
    throw new Error("Only approved salary can be marked as paid");
  }

  return updatePaySATTN({
    id,
    status: "PAID",
    paidAt: new Date().toISOString(),
    paidBy,
    paymentMode: paymentMode as "CASH" | "CHEQUE" | "BANK" | "UPI" | undefined,
    paymentRef,
  });
}

export async function cancelSalary(id: string): Promise<PaySATTN> {
  const salary = await fetchPaySATTNById(id);

  if (salary.status === "PAID") {
    throw new Error("Paid salary cannot be cancelled");
  }

  return updatePaySATTN({
    id,
    status: "CANCELLED",
  });
}

// ==================== Statistics ====================

export async function getMonthlySalaryStats(
  organizationId: string,
  year: number,
  month: number
): Promise<{
  totalGross: number;
  totalNet: number;
  totalPf: number;
  totalEsi: number;
  employeeCount: number;
  processedCount: number;
  paidCount: number;
}> {
  const salaries = await fetchPaySATTNForMonth(organizationId, year, month);

  return {
    totalGross: salaries.reduce((sum, s) => sum + s.grossSalary, 0),
    totalNet: salaries.reduce((sum, s) => sum + s.netSalary, 0),
    totalPf: salaries.reduce((sum, s) => sum + s.pfAmount, 0),
    totalEsi: salaries.reduce((sum, s) => sum + s.esiAmount, 0),
    employeeCount: salaries.length,
    processedCount: salaries.filter(
      (s) => s.status !== "DRAFT" && s.status !== "CANCELLED"
    ).length,
    paidCount: salaries.filter((s) => s.status === "PAID").length,
  };
}
