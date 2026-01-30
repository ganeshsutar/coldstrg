import type { LoanEmiSchedule, PayLoan } from "../types";

/**
 * Calculate EMI using flat rate method
 * EMI = (Principal + Total Interest) / Tenure
 */
export function calculateFlatEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  const totalInterest = (principal * annualInterestRate * tenureMonths) / (12 * 100);
  return (principal + totalInterest) / tenureMonths;
}

/**
 * Calculate EMI using reducing balance method
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where P = Principal, r = monthly interest rate, n = tenure in months
 */
export function calculateReducingEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  if (annualInterestRate === 0) {
    return principal / tenureMonths;
  }

  const monthlyRate = annualInterestRate / (12 * 100);
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;

  return numerator / denominator;
}

/**
 * Generate EMI schedule for a loan (reducing balance method)
 */
export function generateEmiSchedule(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  startDate: string,
  paidEmis: number = 0
): LoanEmiSchedule[] {
  const schedule: LoanEmiSchedule[] = [];
  const monthlyRate = annualInterestRate / (12 * 100);
  const emi = calculateReducingEmi(principal, annualInterestRate, tenureMonths);

  let balance = principal;
  const start = new Date(startDate);

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPart = emi - interest;
    balance = balance - principalPart;

    // Calculate due date
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);

    // Determine status
    let status: "PENDING" | "PAID" | "OVERDUE" = "PENDING";
    if (i <= paidEmis) {
      status = "PAID";
    } else if (dueDate < new Date()) {
      status = "OVERDUE";
    }

    schedule.push({
      emiNo: i,
      dueDate: dueDate.toISOString().split("T")[0],
      emiAmount: Math.round(emi * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
      status,
    });
  }

  return schedule;
}

/**
 * Generate EMI schedule for a loan (flat rate method)
 */
export function generateFlatEmiSchedule(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  startDate: string,
  paidEmis: number = 0
): LoanEmiSchedule[] {
  const schedule: LoanEmiSchedule[] = [];
  const totalInterest = (principal * annualInterestRate * tenureMonths) / (12 * 100);
  const emi = (principal + totalInterest) / tenureMonths;
  const monthlyInterest = totalInterest / tenureMonths;
  const monthlyPrincipal = principal / tenureMonths;

  let balance = principal + totalInterest;
  const start = new Date(startDate);

  for (let i = 1; i <= tenureMonths; i++) {
    balance = balance - emi;

    // Calculate due date
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);

    // Determine status
    let status: "PENDING" | "PAID" | "OVERDUE" = "PENDING";
    if (i <= paidEmis) {
      status = "PAID";
    } else if (dueDate < new Date()) {
      status = "OVERDUE";
    }

    schedule.push({
      emiNo: i,
      dueDate: dueDate.toISOString().split("T")[0],
      emiAmount: Math.round(emi * 100) / 100,
      principal: Math.round(monthlyPrincipal * 100) / 100,
      interest: Math.round(monthlyInterest * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
      status,
    });
  }

  return schedule;
}

/**
 * Calculate total interest for a loan
 */
export function calculateTotalInterest(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  method: "FLAT" | "REDUCING" = "FLAT"
): number {
  if (method === "FLAT") {
    return (principal * annualInterestRate * tenureMonths) / (12 * 100);
  }

  // For reducing balance, calculate from EMI
  const emi = calculateReducingEmi(principal, annualInterestRate, tenureMonths);
  return emi * tenureMonths - principal;
}

/**
 * Calculate outstanding balance after n payments
 */
export function calculateOutstandingBalance(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  paymentsMade: number
): number {
  if (paymentsMade >= tenureMonths) return 0;

  const monthlyRate = annualInterestRate / (12 * 100);
  const emi = calculateReducingEmi(principal, annualInterestRate, tenureMonths);

  if (monthlyRate === 0) {
    return principal - emi * paymentsMade;
  }

  // P * (1+r)^n - EMI * ((1+r)^n - 1) / r
  const factor = Math.pow(1 + monthlyRate, paymentsMade);
  const balance = principal * factor - emi * ((factor - 1) / monthlyRate);

  return Math.max(0, Math.round(balance * 100) / 100);
}

/**
 * Calculate next EMI details
 */
export function getNextEmiDetails(loan: PayLoan): {
  emiNo: number;
  dueDate: string;
  amount: number;
} | null {
  if (loan.emisRemaining <= 0) return null;

  const nextEmiNo = loan.emisPaid + 1;
  const startDate = new Date(loan.startDate);
  startDate.setMonth(startDate.getMonth() + nextEmiNo);

  return {
    emiNo: nextEmiNo,
    dueDate: startDate.toISOString().split("T")[0],
    amount: loan.emiAmount,
  };
}

/**
 * Check if loan has overdue EMIs
 */
export function hasOverdueEmis(loan: PayLoan): boolean {
  if (loan.status === "COMPLETED" || loan.status === "CANCELLED") return false;

  const expectedPaidEmis = getExpectedPaidEmis(loan.startDate);
  return loan.emisPaid < expectedPaidEmis;
}

/**
 * Get count of expected paid EMIs based on start date
 */
export function getExpectedPaidEmis(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();

  const monthsDiff =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  return Math.max(0, monthsDiff);
}

/**
 * Calculate prepayment impact
 */
export function calculatePrepaymentImpact(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  paymentsMade: number,
  prepaymentAmount: number
): {
  newOutstanding: number;
  interestSaved: number;
  newTenure: number;
} {
  const currentOutstanding = calculateOutstandingBalance(
    principal,
    annualInterestRate,
    tenureMonths,
    paymentsMade
  );

  const newOutstanding = Math.max(0, currentOutstanding - prepaymentAmount);
  const remainingTenure = tenureMonths - paymentsMade;

  // Calculate interest on original vs new outstanding
  const originalRemainingInterest = calculateTotalInterest(
    currentOutstanding,
    annualInterestRate,
    remainingTenure
  );

  const newRemainingInterest = calculateTotalInterest(
    newOutstanding,
    annualInterestRate,
    remainingTenure
  );

  const interestSaved = originalRemainingInterest - newRemainingInterest;

  // Calculate new tenure if same EMI is maintained
  const emi = calculateReducingEmi(principal, annualInterestRate, tenureMonths);
  let newTenure = 0;
  let balance = newOutstanding;
  const monthlyRate = annualInterestRate / (12 * 100);

  while (balance > 0 && newTenure < 360) {
    // Max 30 years
    const interest = balance * monthlyRate;
    const principalPart = emi - interest;
    balance -= principalPart;
    newTenure++;
  }

  return {
    newOutstanding,
    interestSaved: Math.round(interestSaved * 100) / 100,
    newTenure,
  };
}
