export const APP_NAME = "Cold Storage";

export const BILLING_STATUS = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  CANCELLED: "CANCELLED",
} as const;

export const MEMBERSHIP_ROLES = {
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
} as const;

export const MEMBERSHIP_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export const PARTY_TYPES = {
  KISSAN: "kissan",
  VYAPARI: "vyapari",
  AARTI: "aarti",
} as const;

export const VOUCHER_TYPES = {
  RECEIPT: "receipt",
  PAYMENT: "payment",
} as const;

export const PAYMENT_MODES = {
  CASH: "cash",
  BANK: "bank",
  UPI: "upi",
} as const;
