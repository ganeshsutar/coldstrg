import type { LoanPartyLedger, InterestDetailRow } from "../types";

/**
 * Calculate interest using reducing balance method
 * Interest = Principal × Rate × Days / (Days in Year × 100)
 * Default: 360 days in year (commercial standard)
 */
export function calculateInterest(
  principal: number,
  ratePerMonth: number,
  days: number,
  daysInYear: number = 360
): number {
  if (principal <= 0 || ratePerMonth <= 0 || days <= 0) {
    return 0;
  }
  // Convert monthly rate to annual rate for calculation
  const annualRate = ratePerMonth * 12;
  return (principal * annualRate * days) / (daysInYear * 100);
}

/**
 * Calculate interest for a date range (simple)
 * Interest = (Amount × Rate × Days) / (30 × 100)
 */
export function calculateSimpleInterest(
  amount: number,
  ratePerMonth: number,
  fromDate: Date,
  toDate: Date
): number {
  const days = Math.ceil(
    (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) return 0;
  return (amount * ratePerMonth * days) / (30 * 100);
}

/**
 * Calculate loan limit based on bags and rate per bag
 */
export function calculateLoanLimit(
  bags: number,
  limitPerBag: number,
  existingLoan: number = 0
): { maxLoan: number; available: number } {
  const maxLoan = bags * limitPerBag;
  const available = Math.max(0, maxLoan - existingLoan);
  return { maxLoan, available };
}

/**
 * Calculate advance limit based on expected bags and rate per bag
 */
export function calculateAdvanceLimit(
  expectedBags: number,
  advancePerBag: number,
  existingAdvance: number = 0
): { maxAdvance: number; available: number } {
  const maxAdvance = expectedBags * advancePerBag;
  const available = Math.max(0, maxAdvance - existingAdvance);
  return { maxAdvance, available };
}

/**
 * Calculate period-wise interest breakdown from transactions
 * Uses reducing balance method
 */
export function calculatePeriodInterest(
  transactions: LoanPartyLedger[],
  fromDate: Date,
  toDate: Date,
  ratePerMonth: number
): InterestDetailRow[] {
  if (!transactions.length) return [];

  // Sort transactions by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const details: InterestDetailRow[] = [];
  let currentBalance = 0;
  let periodStart = fromDate;

  for (const txn of sorted) {
    const txnDate = new Date(txn.date);

    // Skip transactions outside the range
    if (txnDate < fromDate) {
      currentBalance = txn.balance;
      continue;
    }
    if (txnDate > toDate) break;

    // Calculate interest for period before this transaction
    if (currentBalance > 0 && txnDate > periodStart) {
      const days = Math.ceil(
        (txnDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const interest = calculateInterest(currentBalance, ratePerMonth, days);

      if (days > 0) {
        details.push({
          fromDate: periodStart.toISOString().split("T")[0],
          toDate: txnDate.toISOString().split("T")[0],
          days,
          balance: currentBalance,
          rate: ratePerMonth,
          interest,
        });
      }
    }

    // Update balance and period start
    currentBalance = txn.balance;
    periodStart = txnDate;
  }

  // Calculate interest for remaining period
  if (currentBalance > 0 && periodStart < toDate) {
    const days = Math.ceil(
      (toDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const interest = calculateInterest(currentBalance, ratePerMonth, days);

    if (days > 0) {
      details.push({
        fromDate: periodStart.toISOString().split("T")[0],
        toDate: toDate.toISOString().split("T")[0],
        days,
        balance: currentBalance,
        rate: ratePerMonth,
        interest,
      });
    }
  }

  return details;
}

/**
 * Calculate total interest from detail rows
 */
export function sumInterestDetails(details: InterestDetailRow[]): number {
  return details.reduce((sum, d) => sum + d.interest, 0);
}

/**
 * Calculate outstanding balance after repayment
 */
export function calculateNewBalance(
  currentBalance: number,
  repayment: number
): { newBalance: number; excess: number } {
  const newBalance = Math.max(0, currentBalance - repayment);
  const excess = repayment > currentBalance ? repayment - currentBalance : 0;
  return { newBalance, excess };
}

/**
 * Calculate loan limit usage percentage
 */
export function calculateLimitUsage(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

/**
 * Determine if a loan is overdue based on status and balance
 */
export function isLoanOverdue(
  status: string,
  outstandingBalance: number,
  dueDate?: string
): boolean {
  if (outstandingBalance <= 0) return false;
  if (status === "OVERDUE") return true;
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

/**
 * Format currency for display (Indian Rupees)
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

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(fromDate: Date, toDate: Date): number {
  return Math.ceil(
    (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}
