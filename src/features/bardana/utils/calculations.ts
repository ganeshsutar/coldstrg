import type { BardanaConditionValue } from "../types";

/**
 * Calculate credit rate based on condition
 * Good: 100%, Fair: 50%, Damaged: 0%, Unusable: 0%
 */
export function calculateCreditRate(
  fullRate: number,
  condition: BardanaConditionValue
): number {
  switch (condition) {
    case "GOOD":
      return fullRate;
    case "FAIR":
      return fullRate * 0.5;
    case "DAMAGED":
    case "UNUSABLE":
      return 0;
    default:
      return fullRate;
  }
}

/**
 * Get condition credit percentage
 */
export function getConditionCreditPercent(condition: BardanaConditionValue): number {
  switch (condition) {
    case "GOOD":
      return 100;
    case "FAIR":
      return 50;
    case "DAMAGED":
    case "UNUSABLE":
      return 0;
    default:
      return 100;
  }
}

/**
 * Calculate interest for bardana advance
 * Interest = (Amount × Rate × Days) / (30 × 100)
 */
export function calculateBardanaInterest(
  amount: number,
  interestRatePm: number,
  fromDate: Date,
  toDate: Date
): number {
  const days = Math.ceil(
    (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return (amount * interestRatePm * days) / (30 * 100);
}

/**
 * Calculate estimated interest preview
 */
export function calculateEstimatedInterest(
  amount: number,
  interestRatePm: number,
  expectedArrivalDate: Date | null
): { days: number; interest: number } | null {
  if (!expectedArrivalDate || interestRatePm <= 0) {
    return null;
  }

  const today = new Date();
  const days = Math.ceil(
    (expectedArrivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return null;
  }

  const interest = calculateBardanaInterest(
    amount,
    interestRatePm,
    today,
    expectedArrivalDate
  );

  return { days, interest };
}

/**
 * Calculate line item amount
 */
export function calculateItemAmount(quantity: number, rate: number): number {
  return quantity * rate;
}

/**
 * Calculate receipt item amounts with condition adjustment
 */
export function calculateReceiptItemAmounts(
  quantity: number,
  rate: number,
  condition: BardanaConditionValue
): { creditRate: number; amount: number; deduction: number; netAmount: number } {
  const creditRate = calculateCreditRate(rate, condition);
  const amount = quantity * rate;
  const netAmount = quantity * creditRate;
  const deduction = amount - netAmount;

  return { creditRate, amount, deduction, netAmount };
}

/**
 * Calculate total quantities from items
 */
export function calculateIssueTotals(
  items: { quantity: number; amount: number }[]
): { totalQuantity: number; totalAmount: number } {
  return items.reduce(
    (acc, item) => ({
      totalQuantity: acc.totalQuantity + item.quantity,
      totalAmount: acc.totalAmount + item.amount,
    }),
    { totalQuantity: 0, totalAmount: 0 }
  );
}

/**
 * Calculate receipt totals from items
 */
export function calculateReceiptTotals(
  items: {
    quantity: number;
    condition: BardanaConditionValue;
    amount: number;
    deduction: number;
    netAmount: number;
  }[]
): {
  totalQuantity: number;
  totalGoodQuantity: number;
  totalFairQuantity: number;
  totalDamagedQuantity: number;
  totalAmount: number;
  totalDeduction: number;
  netAmount: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalQuantity: acc.totalQuantity + item.quantity,
      totalGoodQuantity:
        acc.totalGoodQuantity + (item.condition === "GOOD" ? item.quantity : 0),
      totalFairQuantity:
        acc.totalFairQuantity + (item.condition === "FAIR" ? item.quantity : 0),
      totalDamagedQuantity:
        acc.totalDamagedQuantity +
        (item.condition === "DAMAGED" || item.condition === "UNUSABLE"
          ? item.quantity
          : 0),
      totalAmount: acc.totalAmount + item.amount,
      totalDeduction: acc.totalDeduction + item.deduction,
      netAmount: acc.netAmount + item.netAmount,
    }),
    {
      totalQuantity: 0,
      totalGoodQuantity: 0,
      totalFairQuantity: 0,
      totalDamagedQuantity: 0,
      totalAmount: 0,
      totalDeduction: 0,
      netAmount: 0,
    }
  );
}

/**
 * Calculate stock availability percentage
 */
export function calculateStockAvailability(
  currentStock: number,
  totalIssued: number
): number {
  const total = currentStock + totalIssued;
  if (total === 0) return 100;
  return Math.round((currentStock / total) * 100);
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with Indian locale
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}
