// Bardana enums
export type BardanaIssueTypeValue = "REGULAR" | "ADVANCE";
export type BardanaStatusValue = "DRAFT" | "CONFIRMED" | "CANCELLED";
export type BardanaConditionValue = "GOOD" | "FAIR" | "DAMAGED" | "UNUSABLE";

// BardanaType - Master for bag types
export interface BardanaType {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string | null;
  defaultRate: number;
  unit: string;
  openingStock: number;
  currentStock: number;
  description?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBardanaTypeInput {
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string;
  defaultRate?: number;
  unit?: string;
  openingStock?: number;
  currentStock?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateBardanaTypeInput extends Partial<CreateBardanaTypeInput> {
  id: string;
}

// BardanaStock - Party-wise stock balances
export interface BardanaStock {
  id: string;
  organizationId: string;
  partyId: string;
  partyName?: string | null;
  partyVillage?: string | null;
  bardanaTypeId: string;
  bardanaTypeName?: string | null;
  totalIssued: number;
  totalReturned: number;
  balance: number;
  totalValue: number;
  lastIssueDate?: string | null;
  lastReturnDate?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBardanaStockInput {
  organizationId: string;
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  bardanaTypeId: string;
  bardanaTypeName?: string;
  totalIssued?: number;
  totalReturned?: number;
  balance?: number;
  totalValue?: number;
  lastIssueDate?: string;
  lastReturnDate?: string;
  isActive?: boolean;
}

export interface UpdateBardanaStockInput extends Partial<CreateBardanaStockInput> {
  id: string;
}

// BardanaIssueHeader - Issue voucher header
export interface BardanaIssueHeader {
  id: string;
  organizationId: string;
  voucherNo: number;
  issueDate: string;
  partyId: string;
  partyName?: string | null;
  partyVillage?: string | null;
  issueType: BardanaIssueTypeValue;
  interestRatePm?: number | null;
  expectedArrivalDate?: string | null;
  expectedBags?: number | null;
  referenceNo?: string | null;
  amadId?: string | null;
  amadNo?: number | null;
  totalQuantity: number;
  totalAmount: number;
  status: BardanaStatusValue;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBardanaIssueHeaderInput {
  organizationId: string;
  voucherNo: number;
  issueDate: string;
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  issueType: BardanaIssueTypeValue;
  interestRatePm?: number;
  expectedArrivalDate?: string;
  expectedBags?: number;
  referenceNo?: string;
  amadId?: string;
  amadNo?: number;
  totalQuantity?: number;
  totalAmount?: number;
  status: BardanaStatusValue;
  confirmedAt?: string;
  confirmedBy?: string;
  narration?: string;
  isActive?: boolean;
}

export interface UpdateBardanaIssueHeaderInput extends Partial<CreateBardanaIssueHeaderInput> {
  id: string;
}

// BardanaIssueItem - Issue line items
export interface BardanaIssueItem {
  id: string;
  organizationId: string;
  issueHeaderId: string;
  bardanaTypeId: string;
  bardanaTypeName?: string | null;
  quantity: number;
  rate: number;
  amount: number;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBardanaIssueItemInput {
  organizationId: string;
  issueHeaderId: string;
  bardanaTypeId: string;
  bardanaTypeName?: string;
  quantity: number;
  rate: number;
  amount: number;
  isActive?: boolean;
}

export interface UpdateBardanaIssueItemInput extends Partial<CreateBardanaIssueItemInput> {
  id: string;
}

// BardanaReceiptHeader - Return voucher header
export interface BardanaReceiptHeader {
  id: string;
  organizationId: string;
  voucherNo: number;
  receiptDate: string;
  partyId: string;
  partyName?: string | null;
  partyVillage?: string | null;
  rentId?: string | null;
  rentSerialNo?: number | null;
  totalQuantity: number;
  totalGoodQuantity: number;
  totalFairQuantity: number;
  totalDamagedQuantity: number;
  totalAmount: number;
  totalDeduction: number;
  netAmount: number;
  status: BardanaStatusValue;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBardanaReceiptHeaderInput {
  organizationId: string;
  voucherNo: number;
  receiptDate: string;
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  rentId?: string;
  rentSerialNo?: number;
  totalQuantity?: number;
  totalGoodQuantity?: number;
  totalFairQuantity?: number;
  totalDamagedQuantity?: number;
  totalAmount?: number;
  totalDeduction?: number;
  netAmount?: number;
  status: BardanaStatusValue;
  confirmedAt?: string;
  confirmedBy?: string;
  narration?: string;
  isActive?: boolean;
}

export interface UpdateBardanaReceiptHeaderInput extends Partial<CreateBardanaReceiptHeaderInput> {
  id: string;
}

// BardanaReceiptItem - Return line items
export interface BardanaReceiptItem {
  id: string;
  organizationId: string;
  receiptHeaderId: string;
  bardanaTypeId: string;
  bardanaTypeName?: string | null;
  quantity: number;
  condition: BardanaConditionValue;
  rate: number;
  creditRate: number;
  amount: number;
  deduction: number;
  netAmount: number;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBardanaReceiptItemInput {
  organizationId: string;
  receiptHeaderId: string;
  bardanaTypeId: string;
  bardanaTypeName?: string;
  quantity: number;
  condition: BardanaConditionValue;
  rate: number;
  creditRate: number;
  amount: number;
  deduction?: number;
  netAmount: number;
  isActive?: boolean;
}

export interface UpdateBardanaReceiptItemInput extends Partial<CreateBardanaReceiptItemInput> {
  id: string;
}

// Issue form input (combined header + items for form)
export interface BardanaIssueFormInput {
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  issueDate: string;
  issueType: BardanaIssueTypeValue;
  interestRatePm?: number;
  expectedArrivalDate?: string;
  expectedBags?: number;
  referenceNo?: string;
  amadId?: string;
  amadNo?: number;
  narration?: string;
  items: {
    bardanaTypeId: string;
    bardanaTypeName?: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

// Receipt form input (combined header + items for form)
export interface BardanaReceiptFormInput {
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  receiptDate: string;
  rentId?: string;
  rentSerialNo?: number;
  narration?: string;
  items: {
    bardanaTypeId: string;
    bardanaTypeName?: string;
    quantity: number;
    condition: BardanaConditionValue;
    rate: number;
  }[];
}

// Summary types for dashboard
export interface BardanaStockSummary {
  bardanaTypeId: string;
  bardanaTypeName: string;
  openingStock: number;
  currentStock: number;
  totalIssued: number;
  totalReturned: number;
  rate: number;
  totalValue: number;
}

export interface PartyOutstanding {
  partyId: string;
  partyName: string;
  partyVillage?: string;
  totalIssued: number;
  totalReturned: number;
  balance: number;
  totalValue: number;
  byType: {
    bardanaTypeId: string;
    bardanaTypeName: string;
    issued: number;
    returned: number;
    balance: number;
    rate: number;
    value: number;
  }[];
}

// Recent transaction for dashboard
export interface RecentBardanaTransaction {
  id: string;
  type: "ISSUE" | "RECEIPT";
  date: string;
  voucherNo: number;
  partyName: string;
  bardanaTypeName: string;
  quantity: number;
  amount: number;
  status: BardanaStatusValue;
}
