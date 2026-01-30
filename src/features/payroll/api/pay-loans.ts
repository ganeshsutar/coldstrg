import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PayLoan,
  CreatePayLoanInput,
  UpdatePayLoanInput,
  PayLoanFormInput,
} from "../types";
import { calculateFlatEmi, getNextLoanNo } from "../utils";

const client = generateClient<Schema>();

// ==================== PayLoan CRUD ====================

export async function fetchPayLoanList(organizationId: string): Promise<PayLoan[]> {
  const { data, errors } =
    await client.models.PayLoan.listPayLoanByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((l) => l.isActive !== false) as unknown as PayLoan[];
}

export async function fetchPayLoanById(id: string): Promise<PayLoan> {
  const { data, errors } = await client.models.PayLoan.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Staff loan not found");
  }

  return data as unknown as PayLoan;
}

export async function fetchPayLoansByEmployee(
  employeeId: string
): Promise<PayLoan[]> {
  const { data, errors } =
    await client.models.PayLoan.listPayLoanByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((l) => l.isActive !== false) as unknown as PayLoan[];
}

export async function fetchActivePayLoansByEmployee(
  employeeId: string
): Promise<PayLoan[]> {
  const loans = await fetchPayLoansByEmployee(employeeId);
  return loans.filter((l) => l.status === "ACTIVE");
}

export async function createPayLoan(input: CreatePayLoanInput): Promise<PayLoan> {
  const { data, errors } = await client.models.PayLoan.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create staff loan");
  }

  return data as unknown as PayLoan;
}

export async function updatePayLoan(input: UpdatePayLoanInput): Promise<PayLoan> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PayLoan.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update staff loan");
  }

  return data as unknown as PayLoan;
}

export async function deletePayLoan(id: string): Promise<void> {
  const { errors } = await client.models.PayLoan.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextPayLoanNo(organizationId: string): Promise<number> {
  const loans = await fetchPayLoanList(organizationId);
  return getNextLoanNo(loans);
}

export async function createPayLoanFromForm(
  organizationId: string,
  formInput: PayLoanFormInput
): Promise<PayLoan> {
  const loanNo = await getNextPayLoanNo(organizationId);

  // Calculate EMI
  const emiAmount = calculateFlatEmi(
    formInput.loanAmount,
    formInput.interestRate || 0,
    formInput.tenure
  );

  // Calculate end date
  const startDate = new Date(formInput.startDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + formInput.tenure);

  return createPayLoan({
    organizationId,
    loanNo,
    loanDate: formInput.loanDate,
    employeeId: formInput.employeeId,
    employeeName: formInput.employeeName,
    loanAmount: formInput.loanAmount,
    interestRate: formInput.interestRate ?? 0,
    tenure: formInput.tenure,
    emiAmount: Math.round(emiAmount * 100) / 100,
    totalPaid: 0,
    outstandingBalance: formInput.loanAmount,
    emisPaid: 0,
    emisRemaining: formInput.tenure,
    startDate: formInput.startDate,
    endDate: endDate.toISOString().split("T")[0],
    status: "ACTIVE",
    purpose: formInput.purpose,
    narration: formInput.narration,
  });
}

export async function recordEmiPayment(
  loanId: string,
  amount: number,
  paymentDate: string
): Promise<PayLoan> {
  const loan = await fetchPayLoanById(loanId);

  if (loan.status !== "ACTIVE") {
    throw new Error("Loan is not active");
  }

  const newTotalPaid = loan.totalPaid + amount;
  const newOutstanding = loan.loanAmount - newTotalPaid;
  const newEmisPaid = loan.emisPaid + 1;
  const newEmisRemaining = loan.tenure - newEmisPaid;

  const updates: UpdatePayLoanInput = {
    id: loanId,
    totalPaid: newTotalPaid,
    outstandingBalance: Math.max(0, newOutstanding),
    emisPaid: newEmisPaid,
    emisRemaining: newEmisRemaining,
    lastEmiDate: paymentDate,
  };

  if (newOutstanding <= 0 || newEmisRemaining <= 0) {
    updates.status = "COMPLETED";
  }

  return updatePayLoan(updates);
}

export async function cancelPayLoan(loanId: string): Promise<PayLoan> {
  const loan = await fetchPayLoanById(loanId);

  if (loan.status === "COMPLETED") {
    throw new Error("Cannot cancel a completed loan");
  }

  return updatePayLoan({
    id: loanId,
    status: "CANCELLED",
  });
}

// ==================== Statistics ====================

export async function getPayLoanStats(organizationId: string): Promise<{
  totalDisbursed: number;
  totalOutstanding: number;
  activeLoans: number;
  completedLoans: number;
}> {
  const loans = await fetchPayLoanList(organizationId);

  const activeLoans = loans.filter((l) => l.status === "ACTIVE");
  const completedLoans = loans.filter((l) => l.status === "COMPLETED");

  return {
    totalDisbursed: loans.reduce((sum, l) => sum + l.loanAmount, 0),
    totalOutstanding: activeLoans.reduce(
      (sum, l) => sum + l.outstandingBalance,
      0
    ),
    activeLoans: activeLoans.length,
    completedLoans: completedLoans.length,
  };
}

export async function getEmployeeLoanSummary(employeeId: string): Promise<{
  totalLoans: number;
  activeLoans: number;
  totalDisbursed: number;
  totalPaid: number;
  totalOutstanding: number;
  monthlyEmi: number;
}> {
  const loans = await fetchPayLoansByEmployee(employeeId);
  const activeLoans = loans.filter((l) => l.status === "ACTIVE");

  return {
    totalLoans: loans.length,
    activeLoans: activeLoans.length,
    totalDisbursed: loans.reduce((sum, l) => sum + l.loanAmount, 0),
    totalPaid: loans.reduce((sum, l) => sum + l.totalPaid, 0),
    totalOutstanding: activeLoans.reduce(
      (sum, l) => sum + l.outstandingBalance,
      0
    ),
    monthlyEmi: activeLoans.reduce((sum, l) => sum + l.emiAmount, 0),
  };
}
