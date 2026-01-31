/**
 * Test data fixtures for accounting module E2E tests
 */

// Party test data
export const testParties = {
  kisan: {
    name: "Test Kisan Party",
    nameHindi: "टेस्ट किसान पार्टी",
    phone: "9876543210",
    openingBalance: "5000",
    partyType: "KISAN",
  },
  aarti: {
    name: "Test Aarti Party",
    nameHindi: "टेस्ट आड़ती पार्टी",
    phone: "9876543211",
    openingBalance: "10000",
    partyType: "AARTI",
  },
  vyapari: {
    name: "Test Vyapari Party",
    nameHindi: "टेस्ट व्यापारी पार्टी",
    phone: "9876543212",
    openingBalance: "0",
    partyType: "VYAPARI",
  },
  simple: {
    name: "Simple Test Party",
    phone: "9876543213",
  },
};

// Voucher test data
export const testVouchers = {
  receipt: {
    type: "CR" as const,
    amount: "5000",
    narration: "Test receipt voucher",
    paymentMode: "CASH" as const,
  },
  payment: {
    type: "DR" as const,
    amount: "3000",
    narration: "Test payment voucher",
    paymentMode: "CASH" as const,
  },
  chequeReceipt: {
    type: "CR" as const,
    amount: "25000",
    narration: "Test cheque receipt",
    paymentMode: "CHEQUE" as const,
  },
  bankPayment: {
    type: "DR" as const,
    amount: "15000",
    narration: "Test bank payment",
    paymentMode: "BANK" as const,
  },
  journal: {
    type: "JV" as const,
    amount: "10000",
    narration: "Test journal entry",
  },
  contra: {
    type: "CV" as const,
    amount: "50000",
    narration: "Cash deposit to bank",
  },
};

// Date helpers
export const testDates = {
  today: () => new Date().toISOString().split("T")[0],
  yesterday: () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  },
  tomorrow: () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  },
  daysAgo: (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  },
};

// Generate unique test data with timestamp
export function uniquePartyName(baseName: string): string {
  return `${baseName}_${Date.now()}`;
}

export function uniqueNarration(baseNarration: string): string {
  return `${baseNarration} - ${Date.now()}`;
}
