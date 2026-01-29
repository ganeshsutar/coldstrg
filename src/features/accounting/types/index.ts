// Account types
export type AccountTypeValue = "GROUP" | "ACCOUNT";
export type AccountNatureValue = "DR" | "CR";
export type VoucherTypeValue = "CR" | "DR" | "JV" | "CV" | "BH";
export type PaymentModeValue = "CASH" | "CHEQUE" | "BANK" | "UPI";

// Party filter tab type
export type PartyFilterTab = "all" | "debtors" | "creditors";

// Account interface (Chart of Accounts / Party Master)
export interface Account {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string | null;
  accountType: AccountTypeValue;
  nature: AccountNatureValue;
  parentId?: string | null;
  level?: number | null;
  under?: string | null;
  // Address
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  // Balances
  openingBalance?: number | null;
  dr?: number | null;
  cr?: number | null;
  balance?: number | null;
  // Component balances
  rentDr?: number | null;
  rentCr?: number | null;
  barDr?: number | null;
  barCr?: number | null;
  loanDr?: number | null;
  loanCr?: number | null;
  intrstDr?: number | null;
  intrstCr?: number | null;
  othDr?: number | null;
  othCr?: number | null;
  // Packets
  pkt1A?: number | null;
  pkt2A?: number | null;
  pkt3A?: number | null;
  pkt1N?: number | null;
  pkt2N?: number | null;
  pkt3N?: number | null;
  // Identity
  aadhar?: string | null;
  pan?: string | null;
  gst?: string | null;
  // Settings
  interestRate?: number | null;
  drLimit?: number | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string;
  accountType: AccountTypeValue;
  nature: AccountNatureValue;
  parentId?: string;
  level?: number;
  under?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  phone?: string;
  openingBalance?: number;
  aadhar?: string;
  pan?: string;
  gst?: string;
  interestRate?: number;
  drLimit?: number;
  isActive?: boolean;
}

export interface UpdateAccountInput extends Partial<CreateAccountInput> {
  id: string;
}

// Voucher interface
export interface Voucher {
  id: string;
  organizationId: string;
  voucherNo: number;
  voucherType: VoucherTypeValue;
  date: string;
  drAccountId?: string | null;
  drAccountCode?: string | null;
  drAccountName?: string | null;
  crAccountId?: string | null;
  crAccountCode?: string | null;
  crAccountName?: string | null;
  amount: number;
  rentAmount?: number | null;
  loanAmount?: number | null;
  interestAmount?: number | null;
  bardanaAmount?: number | null;
  otherAmount?: number | null;
  paymentMode?: PaymentModeValue | null;
  chequeNo?: string | null;
  chequeDate?: string | null;
  bankName?: string | null;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherInput {
  organizationId: string;
  voucherNo: number;
  voucherType: VoucherTypeValue;
  date: string;
  drAccountId?: string;
  drAccountCode?: string;
  drAccountName?: string;
  crAccountId?: string;
  crAccountCode?: string;
  crAccountName?: string;
  amount: number;
  rentAmount?: number;
  loanAmount?: number;
  interestAmount?: number;
  bardanaAmount?: number;
  otherAmount?: number;
  paymentMode?: PaymentModeValue;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  narration?: string;
  isActive?: boolean;
}

export interface UpdateVoucherInput extends Partial<CreateVoucherInput> {
  id: string;
}

// Party Ledger interface
export interface PartyLedger {
  id: string;
  organizationId: string;
  srNo: number;
  accountId: string;
  accountCode?: string | null;
  accountName?: string | null;
  voucherType?: VoucherTypeValue | null;
  billNo?: string | null;
  date: string;
  amount?: number | null;
  rent?: number | null;
  loan?: number | null;
  interest?: number | null;
  bardana?: number | null;
  other?: number | null;
  amadId?: string | null;
  amadNo?: number | null;
  rentId?: string | null;
  rentNo?: number | null;
  gpNo?: string | null;
  barQtyIn?: number | null;
  barQtyOut?: number | null;
  roi?: number | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartyLedgerInput {
  organizationId: string;
  srNo: number;
  accountId: string;
  accountCode?: string;
  accountName?: string;
  voucherType?: VoucherTypeValue;
  billNo?: string;
  date: string;
  amount?: number;
  rent?: number;
  loan?: number;
  interest?: number;
  bardana?: number;
  other?: number;
  amadId?: string;
  amadNo?: number;
  rentId?: string;
  rentNo?: number;
  gpNo?: string;
  barQtyIn?: number;
  barQtyOut?: number;
  roi?: number;
  isActive?: boolean;
}

// Daybook interface
export interface Daybook {
  id: string;
  organizationId: string;
  date: string;
  description?: string | null;
  cashOpenDr?: number | null;
  cashOpenCr?: number | null;
  cashDr?: number | null;
  cashCr?: number | null;
  cashCloseDr?: number | null;
  cashCloseCr?: number | null;
  bankOpenDr?: number | null;
  bankOpenCr?: number | null;
  bankDr?: number | null;
  bankCr?: number | null;
  bankCloseDr?: number | null;
  bankCloseCr?: number | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDaybookInput {
  organizationId: string;
  date: string;
  description?: string;
  cashOpenDr?: number;
  cashOpenCr?: number;
  cashDr?: number;
  cashCr?: number;
  cashCloseDr?: number;
  cashCloseCr?: number;
  bankOpenDr?: number;
  bankOpenCr?: number;
  bankDr?: number;
  bankCr?: number;
  bankCloseDr?: number;
  bankCloseCr?: number;
  isActive?: boolean;
}
