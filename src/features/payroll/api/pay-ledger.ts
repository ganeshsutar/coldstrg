import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PayLedger,
  CreatePayLedgerInput,
  UpdatePayLedgerInput,
} from "../types";
import { getNextSerialNo } from "../utils";

const client = generateClient<Schema>();

// ==================== PayLedger CRUD ====================

export async function fetchPayLedgerList(
  organizationId: string
): Promise<PayLedger[]> {
  const { data, errors } =
    await client.models.PayLedger.listPayLedgerByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (l) => l.isActive !== false
  ) as unknown as PayLedger[];
}

export async function fetchPayLedgerById(id: string): Promise<PayLedger> {
  const { data, errors } = await client.models.PayLedger.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Pay ledger entry not found");
  }

  return data as unknown as PayLedger;
}

export async function fetchPayLedgerByEmployee(
  employeeId: string
): Promise<PayLedger[]> {
  const { data, errors } =
    await client.models.PayLedger.listPayLedgerByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (l) => l.isActive !== false
  ) as unknown as PayLedger[];
}

export async function fetchPayLedgerByDateRange(
  organizationId: string,
  startDate: string,
  endDate: string
): Promise<PayLedger[]> {
  const ledger = await fetchPayLedgerList(organizationId);
  return ledger.filter((l) => l.date >= startDate && l.date <= endDate);
}

export async function createPayLedger(
  input: CreatePayLedgerInput
): Promise<PayLedger> {
  const { data, errors } = await client.models.PayLedger.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create pay ledger entry");
  }

  return data as unknown as PayLedger;
}

export async function updatePayLedger(
  input: UpdatePayLedgerInput
): Promise<PayLedger> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PayLedger.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update pay ledger entry");
  }

  return data as unknown as PayLedger;
}

export async function deletePayLedger(id: string): Promise<void> {
  const { errors } = await client.models.PayLedger.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Ledger Operations ====================

export async function getNextPayLedgerSerialNo(
  organizationId: string
): Promise<number> {
  const ledger = await fetchPayLedgerList(organizationId);
  return getNextSerialNo(ledger);
}

export async function recordSalaryPayment(
  organizationId: string,
  employeeId: string,
  employeeCode: string,
  employeeName: string,
  salaryId: string,
  year: number,
  month: number,
  amount: number,
  paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI",
  paymentRef?: string
): Promise<PayLedger> {
  const serialNo = await getNextPayLedgerSerialNo(organizationId);

  return createPayLedger({
    organizationId,
    serialNo,
    date: new Date().toISOString().split("T")[0],
    employeeId,
    employeeCode,
    employeeName,
    transactionType: "SALARY",
    referenceId: salaryId,
    referenceNo: `SAL-${year}-${month}`,
    debitAmount: 0,
    creditAmount: amount,
    balance: 0, // Balance calculation would need to be cumulative
    year,
    month,
    paymentMode,
    paymentRef,
    narration: `Salary payment for ${month}/${year}`,
  });
}

export async function recordLoanDisbursement(
  organizationId: string,
  employeeId: string,
  employeeCode: string,
  employeeName: string,
  loanId: string,
  loanNo: number,
  amount: number,
  paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI",
  paymentRef?: string
): Promise<PayLedger> {
  const serialNo = await getNextPayLedgerSerialNo(organizationId);

  return createPayLedger({
    organizationId,
    serialNo,
    date: new Date().toISOString().split("T")[0],
    employeeId,
    employeeCode,
    employeeName,
    transactionType: "LOAN_DISBURSEMENT",
    referenceId: loanId,
    referenceNo: `LOAN-${loanNo}`,
    debitAmount: amount,
    creditAmount: 0,
    balance: amount,
    paymentMode,
    paymentRef,
    narration: `Loan disbursement - Loan No: ${loanNo}`,
  });
}

export async function recordLoanRepayment(
  organizationId: string,
  employeeId: string,
  employeeCode: string,
  employeeName: string,
  loanId: string,
  loanNo: number,
  amount: number,
  emiNo: number
): Promise<PayLedger> {
  const serialNo = await getNextPayLedgerSerialNo(organizationId);

  return createPayLedger({
    organizationId,
    serialNo,
    date: new Date().toISOString().split("T")[0],
    employeeId,
    employeeCode,
    employeeName,
    transactionType: "LOAN_REPAYMENT",
    referenceId: loanId,
    referenceNo: `LOAN-${loanNo}-EMI-${emiNo}`,
    debitAmount: 0,
    creditAmount: amount,
    narration: `EMI payment - Loan No: ${loanNo}, EMI No: ${emiNo}`,
  });
}

export async function recordAdvancePayment(
  organizationId: string,
  employeeId: string,
  employeeCode: string,
  employeeName: string,
  amount: number,
  paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI",
  paymentRef?: string,
  narration?: string
): Promise<PayLedger> {
  const serialNo = await getNextPayLedgerSerialNo(organizationId);

  return createPayLedger({
    organizationId,
    serialNo,
    date: new Date().toISOString().split("T")[0],
    employeeId,
    employeeCode,
    employeeName,
    transactionType: "ADVANCE",
    debitAmount: amount,
    creditAmount: 0,
    paymentMode,
    paymentRef,
    narration: narration || "Salary advance",
  });
}

// ==================== Balance & Summary ====================

export async function getEmployeeBalance(employeeId: string): Promise<number> {
  const ledger = await fetchPayLedgerByEmployee(employeeId);

  return ledger.reduce((balance, entry) => {
    return balance + entry.debitAmount - entry.creditAmount;
  }, 0);
}

export async function getEmployeeLedgerSummary(employeeId: string): Promise<{
  totalCredits: number;
  totalDebits: number;
  balance: number;
  transactions: number;
}> {
  const ledger = await fetchPayLedgerByEmployee(employeeId);

  const totalCredits = ledger.reduce((sum, e) => sum + e.creditAmount, 0);
  const totalDebits = ledger.reduce((sum, e) => sum + e.debitAmount, 0);

  return {
    totalCredits,
    totalDebits,
    balance: totalDebits - totalCredits,
    transactions: ledger.length,
  };
}
