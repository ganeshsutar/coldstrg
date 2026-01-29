import type { BardanaIssueHeader, BardanaReceiptHeader } from "../types";

/**
 * Generate next issue voucher number
 */
export function getNextIssueVoucherNo(issues: BardanaIssueHeader[]): number {
  const numbers = issues
    .map((i) => i.voucherNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}

/**
 * Generate next receipt voucher number
 */
export function getNextReceiptVoucherNo(receipts: BardanaReceiptHeader[]): number {
  const numbers = receipts
    .map((r) => r.voucherNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}

/**
 * Format voucher number with prefix
 */
export function formatIssueVoucherNo(voucherNo: number): string {
  return `BI-${voucherNo.toString().padStart(4, "0")}`;
}

/**
 * Format receipt voucher number with prefix
 */
export function formatReceiptVoucherNo(voucherNo: number): string {
  return `BR-${voucherNo.toString().padStart(4, "0")}`;
}

/**
 * Format advance issue voucher number with prefix
 */
export function formatAdvanceVoucherNo(voucherNo: number): string {
  return `BA-${voucherNo.toString().padStart(4, "0")}`;
}
