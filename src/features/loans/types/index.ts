// ============== LOANS ENUMS ==============

export type AdvanceStatusValue = "PENDING" | "CONVERTED" | "ADJUSTED" | "CLOSED";
export type LoanStatusValue = "ACTIVE" | "PARTIAL_REPAID" | "CLOSED" | "OVERDUE";
export type LoanTransactionTypeValue = "DISBURSEMENT" | "REPAYMENT" | "INTEREST";
export type PaymentModeValue = "CASH" | "CHEQUE" | "BANK" | "UPI";

// ============== ADVANCE TYPES ==============

// Advance - Pre-season advances to farmers
export interface Advance {
  id: string;
  organizationId: string;
  advanceNo: number;
  date: string;
  expectedDate?: string | null;
  partyId: string;
  partyName?: string | null;
  expectedBags?: number | null;
  amount: number;
  interestRate: number;
  bardanaVoucherId?: string | null;
  paymentMode?: PaymentModeValue | null;
  status: AdvanceStatusValue;
  narration?: string | null;
  convertedAmadId?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvanceInput {
  organizationId: string;
  advanceNo: number;
  date: string;
  expectedDate?: string;
  partyId: string;
  partyName?: string;
  expectedBags?: number;
  amount: number;
  interestRate?: number;
  bardanaVoucherId?: string;
  paymentMode?: PaymentModeValue;
  status: AdvanceStatusValue;
  narration?: string;
  convertedAmadId?: string;
  isActive?: boolean;
}

export interface UpdateAdvanceInput extends Partial<CreateAdvanceInput> {
  id: string;
}

// ============== LOAN AMOUNT TYPES ==============

// LoanAmount - Loans against stored goods
export interface LoanAmount {
  id: string;
  organizationId: string;
  loanNo: number;
  date: string;
  partyId: string;
  partyName?: string | null;
  amadId: string;
  amadNo?: number | null;
  collateralBags?: number | null;
  disbursedAmount: number;
  interestRate: number;
  repaidAmount: number;
  outstandingBalance: number;
  paymentMode?: PaymentModeValue | null;
  status: LoanStatusValue;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanAmountInput {
  organizationId: string;
  loanNo: number;
  date: string;
  partyId: string;
  partyName?: string;
  amadId: string;
  amadNo?: number;
  collateralBags?: number;
  disbursedAmount: number;
  interestRate?: number;
  repaidAmount?: number;
  outstandingBalance?: number;
  paymentMode?: PaymentModeValue;
  status: LoanStatusValue;
  narration?: string;
  isActive?: boolean;
}

export interface UpdateLoanAmountInput extends Partial<CreateLoanAmountInput> {
  id: string;
}

// ============== LOAN PARTY LEDGER TYPES ==============

// LoanPartyLedger - Transaction history
export interface LoanPartyLedger {
  id: string;
  organizationId: string;
  serialNo: number;
  partyId: string;
  date: string;
  transactionType: LoanTransactionTypeValue;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  interestRate?: number | null;
  amadId?: string | null;
  advanceId?: string | null;
  loanAmountId?: string | null;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanPartyLedgerInput {
  organizationId: string;
  serialNo: number;
  partyId: string;
  date: string;
  transactionType: LoanTransactionTypeValue;
  debitAmount?: number;
  creditAmount?: number;
  balance?: number;
  interestRate?: number;
  amadId?: string;
  advanceId?: string;
  loanAmountId?: string;
  narration?: string;
  isActive?: boolean;
}

export interface UpdateLoanPartyLedgerInput extends Partial<CreateLoanPartyLedgerInput> {
  id: string;
}

// ============== FORM INPUT TYPES ==============

export interface AdvanceFormInput {
  partyId: string;
  partyName?: string;
  date: string;
  expectedDate?: string;
  expectedBags?: number;
  amount: number;
  interestRate?: number;
  paymentMode?: PaymentModeValue;
  bardanaVoucherId?: string;
  narration?: string;
}

export interface LoanAgainstGoodsFormInput {
  partyId: string;
  partyName?: string;
  date: string;
  amadId: string;
  amadNo?: number;
  collateralBags?: number;
  loanAmount: number;
  interestRate?: number;
  paymentMode?: PaymentModeValue;
  narration?: string;
}

export interface RepaymentFormInput {
  loanId: string;
  date: string;
  amount: number;
  paymentMode?: PaymentModeValue;
  narration?: string;
}

// ============== STATISTICS & SUMMARY TYPES ==============

export interface LoanStats {
  totalAdvances: number;
  advanceCount: number;
  activeLoans: number;
  loanCount: number;
  interestAccrued: number;
  overdueAmount: number;
  overdueCount: number;
}

export interface PartyLoanSummary {
  partyId: string;
  partyName: string;
  totalAdvances: number;
  advanceCount: number;
  totalLoans: number;
  loanCount: number;
  totalInterest: number;
  totalRepaid: number;
  outstandingBalance: number;
}

export interface CollateralOption {
  amadId: string;
  amadNo: number;
  date: string;
  commodity: string;
  bags: number;
  maxLoan: number;
  existingLoan: number;
  availableLoan: number;
}

// ============== INTEREST CHART TYPES ==============

export interface InterestChartEntry {
  partyId: string;
  partyName: string;
  openingBalance: number;
  disbursements: number;
  recoveries: number;
  closingBalance: number;
  interest: number;
  details: InterestDetailRow[];
}

export interface InterestDetailRow {
  fromDate: string;
  toDate: string;
  days: number;
  balance: number;
  rate: number;
  interest: number;
}

// ============== RECENT TRANSACTION TYPE ==============

export interface RecentLoanTransaction {
  id: string;
  type: "ADVANCE" | "LOAN" | "REPAYMENT" | "INTEREST";
  date: string;
  voucherNo: number;
  partyName: string;
  amount: number;
  balance?: number;
  status: AdvanceStatusValue | LoanStatusValue;
}
