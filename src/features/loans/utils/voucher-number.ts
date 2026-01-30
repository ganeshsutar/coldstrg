import type { Advance, LoanAmount } from "../types";

/**
 * Generate next advance voucher number
 */
export function getNextAdvanceNo(advances: Advance[]): number {
  const numbers = advances
    .map((a) => a.advanceNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}

/**
 * Generate next loan voucher number
 */
export function getNextLoanNo(loans: LoanAmount[]): number {
  const numbers = loans
    .map((l) => l.loanNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}

/**
 * Format advance voucher number with prefix
 * ADV-0001
 */
export function formatAdvanceNo(advanceNo: number, prefix: string = "ADV"): string {
  return `${prefix}-${advanceNo.toString().padStart(4, "0")}`;
}

/**
 * Format loan voucher number with prefix
 * LN-0001
 */
export function formatLoanNo(loanNo: number, prefix: string = "LN"): string {
  return `${prefix}-${loanNo.toString().padStart(4, "0")}`;
}

/**
 * Format repayment voucher number with prefix
 * RP-0001
 */
export function formatRepaymentNo(serialNo: number, prefix: string = "RP"): string {
  return `${prefix}-${serialNo.toString().padStart(4, "0")}`;
}

/**
 * Parse voucher number string to extract numeric value
 */
export function parseVoucherNo(voucherStr: string): number {
  const match = voucherStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
