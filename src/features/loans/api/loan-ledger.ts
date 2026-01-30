import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  LoanPartyLedger,
  CreateLoanPartyLedgerInput,
  LoanTransactionTypeValue,
} from "../types";

const client = generateClient<Schema>();

// ==================== LoanPartyLedger CRUD ====================

export async function fetchLoanLedger(
  organizationId: string,
  partyId?: string
): Promise<LoanPartyLedger[]> {
  let data;
  let errors;

  if (partyId) {
    const result = await client.models.LoanPartyLedger.listLoanPartyLedgerByPartyId({
      partyId,
    });
    data = result.data;
    errors = result.errors;
  } else {
    const result = await client.models.LoanPartyLedger.listLoanPartyLedgerByOrganizationId({
      organizationId,
    });
    data = result.data;
    errors = result.errors;
  }

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (l) => l.organizationId === organizationId && l.isActive !== false
  );

  // Sort by date and serial number
  return (filtered as unknown as LoanPartyLedger[]).sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.serialNo - b.serialNo;
  });
}

export async function fetchLoanLedgerByDateRange(
  organizationId: string,
  partyId: string,
  fromDate: string,
  toDate: string
): Promise<LoanPartyLedger[]> {
  const ledger = await fetchLoanLedger(organizationId, partyId);
  return ledger.filter((l) => l.date >= fromDate && l.date <= toDate);
}

export async function fetchLoanLedgerEntry(id: string): Promise<LoanPartyLedger> {
  const { data, errors } = await client.models.LoanPartyLedger.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Ledger entry not found");
  }

  return data as unknown as LoanPartyLedger;
}

export async function createLedgerEntry(
  input: CreateLoanPartyLedgerInput
): Promise<LoanPartyLedger> {
  const { data, errors } = await client.models.LoanPartyLedger.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create ledger entry");
  }

  return data as unknown as LoanPartyLedger;
}

export async function deleteLedgerEntry(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.LoanPartyLedger.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextSerialNo(
  organizationId: string,
  partyId: string
): Promise<number> {
  const ledger = await fetchLoanLedger(organizationId, partyId);
  const numbers = ledger.map((l) => l.serialNo).filter((n) => !isNaN(n));
  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}

export async function recordDisbursement(
  organizationId: string,
  partyId: string,
  date: string,
  amount: number,
  currentBalance: number,
  options?: {
    interestRate?: number;
    amadId?: string;
    advanceId?: string;
    loanAmountId?: string;
    narration?: string;
  }
): Promise<LoanPartyLedger> {
  const serialNo = await getNextSerialNo(organizationId, partyId);
  const newBalance = currentBalance + amount;

  return createLedgerEntry({
    organizationId,
    serialNo,
    partyId,
    date,
    transactionType: "DISBURSEMENT",
    debitAmount: amount,
    creditAmount: 0,
    balance: newBalance,
    interestRate: options?.interestRate,
    amadId: options?.amadId,
    advanceId: options?.advanceId,
    loanAmountId: options?.loanAmountId,
    narration: options?.narration ?? "Loan disbursement",
  });
}

export async function recordRepaymentLedger(
  organizationId: string,
  partyId: string,
  date: string,
  amount: number,
  currentBalance: number,
  options?: {
    loanAmountId?: string;
    narration?: string;
  }
): Promise<LoanPartyLedger> {
  const serialNo = await getNextSerialNo(organizationId, partyId);
  const newBalance = Math.max(0, currentBalance - amount);

  return createLedgerEntry({
    organizationId,
    serialNo,
    partyId,
    date,
    transactionType: "REPAYMENT",
    debitAmount: 0,
    creditAmount: amount,
    balance: newBalance,
    loanAmountId: options?.loanAmountId,
    narration: options?.narration ?? "Loan repayment",
  });
}

export async function recordInterestLedger(
  organizationId: string,
  partyId: string,
  date: string,
  interestAmount: number,
  currentBalance: number,
  interestRate: number,
  options?: {
    narration?: string;
  }
): Promise<LoanPartyLedger> {
  const serialNo = await getNextSerialNo(organizationId, partyId);
  const newBalance = currentBalance + interestAmount;

  return createLedgerEntry({
    organizationId,
    serialNo,
    partyId,
    date,
    transactionType: "INTEREST",
    debitAmount: interestAmount,
    creditAmount: 0,
    balance: newBalance,
    interestRate,
    narration: options?.narration ?? `Interest charged @ ${interestRate}% p.m.`,
  });
}

// ==================== Balance Calculations ====================

export async function getPartyLoanBalance(
  organizationId: string,
  partyId: string
): Promise<number> {
  const ledger = await fetchLoanLedger(organizationId, partyId);
  if (ledger.length === 0) return 0;

  // Return the balance from the last entry
  return ledger[ledger.length - 1].balance;
}

export async function getLedgerSummary(
  organizationId: string,
  partyId: string
): Promise<{
  totalDisbursed: number;
  totalRepaid: number;
  totalInterest: number;
  currentBalance: number;
}> {
  const ledger = await fetchLoanLedger(organizationId, partyId);

  const totalDisbursed = ledger
    .filter((l) => l.transactionType === "DISBURSEMENT")
    .reduce((sum, l) => sum + l.debitAmount, 0);

  const totalRepaid = ledger
    .filter((l) => l.transactionType === "REPAYMENT")
    .reduce((sum, l) => sum + l.creditAmount, 0);

  const totalInterest = ledger
    .filter((l) => l.transactionType === "INTEREST")
    .reduce((sum, l) => sum + l.debitAmount, 0);

  const currentBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

  return {
    totalDisbursed,
    totalRepaid,
    totalInterest,
    currentBalance,
  };
}

export async function getTransactionsByType(
  organizationId: string,
  partyId: string,
  transactionType: LoanTransactionTypeValue
): Promise<LoanPartyLedger[]> {
  const ledger = await fetchLoanLedger(organizationId, partyId);
  return ledger.filter((l) => l.transactionType === transactionType);
}
