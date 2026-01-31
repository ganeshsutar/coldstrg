/**
 * Test data fixtures for billing module E2E tests
 */

// Test data for bill generation
export const testBillData = {
  // Party selection test data
  partySearchTerm: "Ram",

  // Additional charges
  charges: {
    loading: { rate: "5", qty: "50" },
    unloading: { rate: "5", qty: "50" },
    dala: { rate: "2", qty: "50" },
  },

  // GST configuration
  gst: {
    intraState: { type: "INTRA_STATE", rate: "18" },
    interState: { type: "INTER_STATE", rate: "18" },
  },

  // Discount
  discount: "100",

  // Notes
  notes: "Test bill notes",
};

// Test data for receipts
export const testReceiptData = {
  cash: {
    mode: "CASH" as const,
    amount: "5000",
    narration: "Cash payment for rent",
  },
  cheque: {
    mode: "CHEQUE" as const,
    amount: "10000",
    chequeNumber: "123456",
    chequeDate: new Date().toISOString().split("T")[0],
    bank: "HDFC Bank",
    branch: "Agra Main",
    narration: "Cheque payment",
    isPdc: false,
  },
  upi: {
    mode: "UPI" as const,
    amount: "3000",
    upiRef: "UPI123456789",
    narration: "UPI payment",
  },
  bank: {
    mode: "BANK" as const,
    amount: "15000",
    bankRef: "NEFT12345",
    narration: "Bank transfer",
  },
  pdc: {
    mode: "CHEQUE" as const,
    amount: "20000",
    chequeNumber: "654321",
    chequeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    bank: "ICICI Bank",
    branch: "Delhi Branch",
    narration: "Post-dated cheque",
    isPdc: true,
  },
};

// Date helpers
export const billingDates = {
  today: () => new Date().toISOString().split("T")[0],
  yesterday: () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  },
  lastMonth: () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  },
  nextMonth: () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  },
};

// Generate unique test data with timestamp
export function uniqueNarration(base: string): string {
  return `${base} - ${Date.now()}`;
}

export function uniqueNotes(base: string): string {
  return `${base} - Test ${Date.now()}`;
}

// Bill status types
export type BillStatus = "all" | "draft" | "pending" | "paid" | "cancelled";
export type ReceiptStatus = "all" | "draft" | "confirmed" | "cancelled";
export type PaymentMode = "CASH" | "CHEQUE" | "BANK" | "UPI";
