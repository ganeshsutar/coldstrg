import type { GstTypeValue } from "../types";

/**
 * Default GST rates for cold storage services (as of 2024)
 * Cold storage services: 18% GST
 */
export const DEFAULT_GST_RATE = 18;
export const DEFAULT_CGST_RATE = 9;
export const DEFAULT_SGST_RATE = 9;
export const DEFAULT_IGST_RATE = 18;

/**
 * HSN codes for cold storage services
 */
export const HSN_CODES = {
  RENT: "996721", // Storage and warehousing services
  LOADING: "996521", // Cargo handling services
  UNLOADING: "996521",
  INSURANCE: "997139", // Insurance auxiliary services
  OTHER: "999799", // Other services
};

/**
 * Determine GST type based on party state and organization state
 */
export function determineGstType(
  partyStateCode: string | null | undefined,
  orgStateCode: string | null | undefined
): GstTypeValue {
  // If either state code is missing, default to intra-state
  if (!partyStateCode || !orgStateCode) {
    return "INTRA_STATE";
  }

  // Compare state codes (first 2 digits of GSTIN)
  return partyStateCode.substring(0, 2) === orgStateCode.substring(0, 2)
    ? "INTRA_STATE"
    : "INTER_STATE";
}

/**
 * Extract state code from GSTIN
 */
export function extractStateCode(gstin: string | null | undefined): string {
  if (!gstin || gstin.length < 2) {
    return "";
  }
  return gstin.substring(0, 2);
}

/**
 * Calculate GST amounts
 */
export function calculateGst(
  taxableAmount: number,
  gstType: GstTypeValue,
  gstRate: number = DEFAULT_GST_RATE
): {
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
} {
  const halfRate = gstRate / 2;

  if (gstType === "INTER_STATE") {
    // IGST for inter-state
    const igstAmount = (taxableAmount * gstRate) / 100;
    return {
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: gstRate,
      igstAmount: Math.round(igstAmount * 100) / 100,
      totalGst: Math.round(igstAmount * 100) / 100,
    };
  } else {
    // CGST + SGST for intra-state
    const cgstAmount = (taxableAmount * halfRate) / 100;
    const sgstAmount = (taxableAmount * halfRate) / 100;
    return {
      cgstRate: halfRate,
      cgstAmount: Math.round(cgstAmount * 100) / 100,
      sgstRate: halfRate,
      sgstAmount: Math.round(sgstAmount * 100) / 100,
      igstRate: 0,
      igstAmount: 0,
      totalGst: Math.round((cgstAmount + sgstAmount) * 100) / 100,
    };
  }
}

/**
 * Calculate TDS (Tax Deducted at Source)
 * Standard TDS rate for rent: 10% (Section 194-I)
 */
export function calculateTds(
  amount: number,
  tdsRate: number = 10
): { tdsRate: number; tdsAmount: number } {
  const tdsAmount = (amount * tdsRate) / 100;
  return {
    tdsRate,
    tdsAmount: Math.round(tdsAmount * 100) / 100,
  };
}

/**
 * Calculate complete bill amounts with GST and TDS
 */
export function calculateBillAmounts(params: {
  rentAmount: number;
  loadingCharges?: number;
  unloadingCharges?: number;
  dalaCharges?: number;
  kataiCharges?: number;
  insuranceAmount?: number;
  reloadCharges?: number;
  dumpCharges?: number;
  otherCharges?: number;
  discountAmount?: number;
  gstType: GstTypeValue;
  gstRate?: number;
  tdsRate?: number;
  applyTds?: boolean;
}): {
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
  tdsRate: number;
  tdsAmount: number;
  totalAmount: number;
  netPayable: number;
} {
  const {
    rentAmount,
    loadingCharges = 0,
    unloadingCharges = 0,
    dalaCharges = 0,
    kataiCharges = 0,
    insuranceAmount = 0,
    reloadCharges = 0,
    dumpCharges = 0,
    otherCharges = 0,
    discountAmount = 0,
    gstType,
    gstRate = DEFAULT_GST_RATE,
    tdsRate = 10,
    applyTds = false,
  } = params;

  // Calculate taxable amount
  const grossAmount =
    rentAmount +
    loadingCharges +
    unloadingCharges +
    dalaCharges +
    kataiCharges +
    insuranceAmount +
    reloadCharges +
    dumpCharges +
    otherCharges;

  const taxableAmount = grossAmount - discountAmount;

  // Calculate GST
  const gst = calculateGst(taxableAmount, gstType, gstRate);

  // Calculate TDS if applicable
  const tds = applyTds
    ? calculateTds(taxableAmount, tdsRate)
    : { tdsRate: 0, tdsAmount: 0 };

  // Total amount (taxable + GST)
  const totalAmount = taxableAmount + gst.totalGst;

  // Net payable (after TDS deduction)
  const netPayable = totalAmount - tds.tdsAmount;

  return {
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    ...gst,
    tdsRate: tds.tdsRate,
    tdsAmount: tds.tdsAmount,
    totalAmount: Math.round(totalAmount * 100) / 100,
    netPayable: Math.round(netPayable * 100) / 100,
  };
}

/**
 * Validate GSTIN format
 */
export function validateGstin(gstin: string): boolean {
  if (!gstin || gstin.length !== 15) {
    return false;
  }

  // GSTIN format: 2 digit state code + 10 digit PAN + 1 digit entity + 1 digit check
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.toUpperCase());
}

/**
 * Format GST for display
 */
export function formatGstBreakup(
  gstType: GstTypeValue,
  cgstRate: number,
  cgstAmount: number,
  sgstRate: number,
  sgstAmount: number,
  igstRate: number,
  igstAmount: number
): string {
  if (gstType === "INTER_STATE") {
    return `IGST @${igstRate}%: ₹${igstAmount.toFixed(2)}`;
  }
  return `CGST @${cgstRate}%: ₹${cgstAmount.toFixed(2)} + SGST @${sgstRate}%: ₹${sgstAmount.toFixed(2)}`;
}
