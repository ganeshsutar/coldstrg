// Billing enums
export type BillStatusValue =
  | "DRAFT"
  | "CONFIRMED"
  | "PARTIAL_PAID"
  | "PAID"
  | "CANCELLED"
  | "OVERDUE";

export type ReceiptPaymentModeValue = "CASH" | "CHEQUE" | "BANK" | "UPI";

export type GstTypeValue = "INTRA_STATE" | "INTER_STATE";

export type ReceiptStatusValue = "DRAFT" | "CONFIRMED" | "CANCELLED";

export type PriceComponentValue =
  | "RENT"
  | "LOADING"
  | "UNLOADING"
  | "DALA"
  | "KATAI"
  | "INSURANCE"
  | "RELOAD"
  | "DUMP"
  | "OTHER";

// RentBillHeader - Rent bill with GST/TDS
export interface RentBillHeader {
  id: string;
  organizationId: string;
  billNo: string;
  billDate: string;
  // Party details
  partyId: string;
  partyName?: string | null;
  partyVillage?: string | null;
  partyGstin?: string | null;
  partyState?: string | null;
  // GST type
  gstType?: GstTypeValue | null;
  // Charge amounts
  rentAmount: number;
  loadingCharges: number;
  unloadingCharges: number;
  dalaCharges: number;
  kataiCharges: number;
  insuranceAmount: number;
  reloadCharges: number;
  dumpCharges: number;
  otherCharges: number;
  // Tax calculation
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  // Discounts and TDS
  discountAmount: number;
  tdsRate: number;
  tdsAmount: number;
  // Total amounts
  totalAmount: number;
  roundedAmount: number;
  roundOffAmount: number;
  amountInWords?: string | null;
  // Payment tracking
  status?: BillStatusValue | null;
  paidAmount: number;
  balanceAmount: number;
  dueDate?: string | null;
  // Notes
  notes?: string | null;
  // Audit
  confirmedAt?: string | null;
  confirmedBy?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancelReason?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentBillHeaderInput {
  organizationId: string;
  billNo: string;
  billDate: string;
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  partyGstin?: string;
  partyState?: string;
  gstType?: GstTypeValue;
  rentAmount?: number;
  loadingCharges?: number;
  unloadingCharges?: number;
  dalaCharges?: number;
  kataiCharges?: number;
  insuranceAmount?: number;
  reloadCharges?: number;
  dumpCharges?: number;
  otherCharges?: number;
  taxableAmount?: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  discountAmount?: number;
  tdsRate?: number;
  tdsAmount?: number;
  totalAmount?: number;
  roundedAmount?: number;
  roundOffAmount?: number;
  amountInWords?: string;
  status?: BillStatusValue;
  paidAmount?: number;
  balanceAmount?: number;
  dueDate?: string;
  notes?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  isActive?: boolean;
}

export interface UpdateRentBillHeaderInput
  extends Partial<CreateRentBillHeaderInput> {
  id: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
}

// RentBillItem - Line items linking to Amads
export interface RentBillItem {
  id: string;
  organizationId: string;
  rentBillId: string;
  // Amad reference
  amadId: string;
  amadNo?: number | null;
  amadDate?: string | null;
  // Denormalized details
  commodityName?: string | null;
  partyName?: string | null;
  // Quantities
  pkt1: number;
  pkt2: number;
  pkt3: number;
  bags: number;
  weightQtl: number;
  // Billing period
  arrivalDate?: string | null;
  dispatchDate?: string | null;
  storageDays: number;
  graceDays: number;
  billableDays: number;
  // Rate and amount
  ratePerQtl: number;
  ratePerBag: number;
  rentAmount: number;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentBillItemInput {
  organizationId: string;
  rentBillId: string;
  amadId: string;
  amadNo?: number;
  amadDate?: string;
  commodityName?: string;
  partyName?: string;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  bags?: number;
  weightQtl?: number;
  arrivalDate?: string;
  dispatchDate?: string;
  storageDays?: number;
  graceDays?: number;
  billableDays?: number;
  ratePerQtl?: number;
  ratePerBag?: number;
  rentAmount?: number;
  isActive?: boolean;
}

export interface UpdateRentBillItemInput
  extends Partial<CreateRentBillItemInput> {
  id: string;
}

// PriceBreakup - Charge components
export interface PriceBreakup {
  id: string;
  organizationId: string;
  rentBillId: string;
  component: PriceComponentValue;
  description?: string | null;
  rate: number;
  quantity: number;
  unit?: string | null;
  amount: number;
  hsnCode?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceBreakupInput {
  organizationId: string;
  rentBillId: string;
  component: PriceComponentValue;
  description?: string;
  rate?: number;
  quantity?: number;
  unit?: string;
  amount?: number;
  hsnCode?: string;
  isActive?: boolean;
}

export interface UpdatePriceBreakupInput
  extends Partial<CreatePriceBreakupInput> {
  id: string;
}

// Receipt - Payment recording
export interface Receipt {
  id: string;
  organizationId: string;
  receiptNo: string;
  receiptDate: string;
  // Party details
  partyId: string;
  partyName?: string | null;
  // Payment details
  paymentMode?: ReceiptPaymentModeValue | null;
  amount: number;
  amountInWords?: string | null;
  // Cheque details
  chequeNo?: string | null;
  chequeDate?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  isPdcCheque: boolean;
  isChequeCleared: boolean;
  chequeClearedDate?: string | null;
  // Bank transfer details
  upiRef?: string | null;
  bankRef?: string | null;
  // Narration
  narration?: string | null;
  // Status
  status?: ReceiptStatusValue | null;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancelReason?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptInput {
  organizationId: string;
  receiptNo: string;
  receiptDate: string;
  partyId: string;
  partyName?: string;
  paymentMode?: ReceiptPaymentModeValue;
  amount: number;
  amountInWords?: string;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  branchName?: string;
  isPdcCheque?: boolean;
  isChequeCleared?: boolean;
  chequeClearedDate?: string;
  upiRef?: string;
  bankRef?: string;
  narration?: string;
  status?: ReceiptStatusValue;
  confirmedAt?: string;
  confirmedBy?: string;
  isActive?: boolean;
}

export interface UpdateReceiptInput extends Partial<CreateReceiptInput> {
  id: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
}

// ReceiptAllocation - Bill allocation
export interface ReceiptAllocation {
  id: string;
  organizationId: string;
  receiptId: string;
  rentBillId: string;
  billNo?: string | null;
  allocatedAmount: number;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptAllocationInput {
  organizationId: string;
  receiptId: string;
  rentBillId: string;
  billNo?: string;
  allocatedAmount: number;
  isActive?: boolean;
}

export interface UpdateReceiptAllocationInput
  extends Partial<CreateReceiptAllocationInput> {
  id: string;
}

// Form input types for combined operations
export interface RentBillFormInput {
  partyId: string;
  partyName?: string;
  partyVillage?: string;
  partyGstin?: string;
  partyState?: string;
  billDate: string;
  dueDate?: string;
  gstType?: GstTypeValue;
  notes?: string;
  items: {
    amadId: string;
    amadNo?: number;
    amadDate?: string;
    commodityName?: string;
    pkt1?: number;
    pkt2?: number;
    pkt3?: number;
    bags: number;
    weightQtl: number;
    arrivalDate?: string;
    dispatchDate?: string;
    storageDays: number;
    graceDays: number;
    billableDays: number;
    ratePerQtl: number;
    ratePerBag?: number;
    rentAmount: number;
  }[];
  charges: {
    component: PriceComponentValue;
    description?: string;
    rate: number;
    quantity: number;
    unit?: string;
    amount: number;
    hsnCode?: string;
  }[];
  // GST settings
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  // Discounts
  discountAmount?: number;
  tdsRate?: number;
}

export interface ReceiptFormInput {
  partyId: string;
  partyName?: string;
  receiptDate: string;
  paymentMode: ReceiptPaymentModeValue;
  amount: number;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  branchName?: string;
  isPdcCheque?: boolean;
  upiRef?: string;
  bankRef?: string;
  narration?: string;
  allocations: {
    rentBillId: string;
    billNo?: string;
    allocatedAmount: number;
  }[];
}

// Summary types for dashboard
export interface BillingSummary {
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  billsByStatus: {
    status: BillStatusValue;
    count: number;
    amount: number;
  }[];
}

export interface BillingStats {
  billsThisMonth: number;
  billsThisMonthAmount: number;
  pendingBills: number;
  pendingAmount: number;
  collectionsThisMonth: number;
  gstPayable: number;
}

export interface BillingTrendData {
  month: string;
  billed: number;
  collected: number;
}

// Party outstanding summary
export interface PartyBillingSummary {
  partyId: string;
  partyName: string;
  partyVillage?: string;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  billCount: number;
  unpaidBillCount: number;
  lastBillDate?: string;
  lastPaymentDate?: string;
}

// Billable Amad (for wizard)
export interface BillableAmad {
  id: string;
  amadNo: number;
  date: string;
  partyName: string;
  commodityName?: string;
  variety?: string;
  pkt1: number;
  pkt2: number;
  pkt3: number;
  totalPackets: number;
  totalWeight: number;
  storageDays: number;
  graceDays: number;
  billableDays: number;
  estimatedRent: number;
  status: string;
  dispatchDate?: string;
  isSelected?: boolean;
}
