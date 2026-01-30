import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  LoanAmount,
  CreateLoanAmountInput,
  UpdateLoanAmountInput,
  LoanAgainstGoodsFormInput,
  LoanStatusValue,
} from "../types";
import { getNextLoanNo } from "../utils/voucher-number";
import { calculateNewBalance } from "../utils/calculations";

const client = generateClient<Schema>();

// ==================== LoanAmount CRUD ====================

export async function fetchLoanList(organizationId: string): Promise<LoanAmount[]> {
  const { data, errors } =
    await client.models.LoanAmount.listLoanAmountByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((l) => l.isActive !== false) as unknown as LoanAmount[];
}

export async function fetchLoanById(id: string): Promise<LoanAmount> {
  const { data, errors } = await client.models.LoanAmount.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Loan not found");
  }

  return data as unknown as LoanAmount;
}

export async function fetchLoansByParty(
  organizationId: string,
  partyId: string
): Promise<LoanAmount[]> {
  const { data, errors } =
    await client.models.LoanAmount.listLoanAmountByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (l) => l.organizationId === organizationId && l.isActive !== false
  );

  return filtered as unknown as LoanAmount[];
}

export async function fetchLoansByAmad(
  organizationId: string,
  amadId: string
): Promise<LoanAmount[]> {
  const { data, errors } =
    await client.models.LoanAmount.listLoanAmountByAmadId({
      amadId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (l) => l.organizationId === organizationId && l.isActive !== false
  );

  return filtered as unknown as LoanAmount[];
}

export async function fetchActiveLoans(organizationId: string): Promise<LoanAmount[]> {
  const loans = await fetchLoanList(organizationId);
  return loans.filter((l) => l.status === "ACTIVE" || l.status === "PARTIAL_REPAID");
}

export async function fetchOverdueLoans(organizationId: string): Promise<LoanAmount[]> {
  const loans = await fetchLoanList(organizationId);
  return loans.filter((l) => l.status === "OVERDUE");
}

export async function createLoan(
  input: CreateLoanAmountInput
): Promise<LoanAmount> {
  const { data, errors } = await client.models.LoanAmount.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create loan");
  }

  return data as unknown as LoanAmount;
}

export async function updateLoan(
  input: UpdateLoanAmountInput
): Promise<LoanAmount> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.LoanAmount.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update loan");
  }

  return data as unknown as LoanAmount;
}

export async function deleteLoan(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.LoanAmount.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextLoanNumber(organizationId: string): Promise<number> {
  const loans = await fetchLoanList(organizationId);
  return getNextLoanNo(loans);
}

export async function createLoanFromForm(
  organizationId: string,
  formInput: LoanAgainstGoodsFormInput
): Promise<LoanAmount> {
  // Get next voucher number
  const loanNo = await getNextLoanNumber(organizationId);

  // Create loan
  return createLoan({
    organizationId,
    loanNo,
    date: formInput.date,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    amadId: formInput.amadId,
    amadNo: formInput.amadNo,
    collateralBags: formInput.collateralBags,
    disbursedAmount: formInput.loanAmount,
    interestRate: formInput.interestRate ?? 0,
    repaidAmount: 0,
    outstandingBalance: formInput.loanAmount,
    paymentMode: formInput.paymentMode,
    status: "ACTIVE",
    narration: formInput.narration,
  });
}

export async function recordRepayment(
  loanId: string,
  amount: number
): Promise<LoanAmount> {
  const loan = await fetchLoanById(loanId);

  if (loan.status === "CLOSED") {
    throw new Error("Cannot record repayment on a closed loan");
  }

  const { newBalance, excess } = calculateNewBalance(
    loan.outstandingBalance,
    amount
  );

  if (excess > 0) {
    // Could handle excess as overpayment or reject
    console.warn(`Repayment exceeds balance by ${excess}`);
  }

  const newRepaid = loan.repaidAmount + amount;
  let newStatus: LoanStatusValue = loan.status;

  if (newBalance === 0) {
    newStatus = "CLOSED";
  } else if (newRepaid > 0) {
    newStatus = "PARTIAL_REPAID";
  }

  return updateLoan({
    id: loanId,
    repaidAmount: newRepaid,
    outstandingBalance: newBalance,
    status: newStatus,
  });
}

export async function markLoanOverdue(loanId: string): Promise<LoanAmount> {
  return updateLoan({
    id: loanId,
    status: "OVERDUE",
  });
}

export async function closeLoan(loanId: string): Promise<LoanAmount> {
  return updateLoan({
    id: loanId,
    status: "CLOSED",
    outstandingBalance: 0,
  });
}

// ==================== Statistics ====================

export async function getLoanStats(organizationId: string): Promise<{
  totalDisbursed: number;
  totalRepaid: number;
  totalOutstanding: number;
  activeCount: number;
  overdueCount: number;
  overdueAmount: number;
}> {
  const loans = await fetchLoanList(organizationId);

  const active = loans.filter(
    (l) => l.status === "ACTIVE" || l.status === "PARTIAL_REPAID"
  );
  const overdue = loans.filter((l) => l.status === "OVERDUE");

  return {
    totalDisbursed: loans.reduce((sum, l) => sum + l.disbursedAmount, 0),
    totalRepaid: loans.reduce((sum, l) => sum + l.repaidAmount, 0),
    totalOutstanding: loans.reduce((sum, l) => sum + l.outstandingBalance, 0),
    activeCount: active.length,
    overdueCount: overdue.length,
    overdueAmount: overdue.reduce((sum, l) => sum + l.outstandingBalance, 0),
  };
}

export async function getTotalLoanOnAmad(
  organizationId: string,
  amadId: string
): Promise<number> {
  const loans = await fetchLoansByAmad(organizationId, amadId);
  return loans
    .filter((l) => l.status !== "CLOSED")
    .reduce((sum, l) => sum + l.outstandingBalance, 0);
}
