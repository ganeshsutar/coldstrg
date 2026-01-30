import type { Sauda, GatePass, Katai } from "../types";

// ==================== Number Formatting ====================

export function formatSaudaNo(num: number): string {
  return `SD-${String(num).padStart(5, "0")}`;
}

export function formatGpNo(num: number): string {
  return `GP-${String(num).padStart(5, "0")}`;
}

export function formatKataiNo(num: number): string {
  return `KT-${String(num).padStart(5, "0")}`;
}

// ==================== Next Number Generators ====================

export function getNextSaudaNo(saudas: Sauda[]): number {
  if (!saudas || saudas.length === 0) return 1;
  const maxNo = Math.max(0, ...saudas.map((s) => s.saudaNo ?? 0));
  return maxNo + 1;
}

export function getNextGpNo(gatePasses: GatePass[]): number {
  if (!gatePasses || gatePasses.length === 0) return 1;
  const maxNo = Math.max(0, ...gatePasses.map((g) => g.gpNo ?? 0));
  return maxNo + 1;
}

export function getNextKataiNo(katais: Katai[]): number {
  if (!katais || katais.length === 0) return 1;
  const maxNo = Math.max(0, ...katais.map((k) => k.kataiNo ?? 0));
  return maxNo + 1;
}

// ==================== Currency Formatting ====================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

// ==================== Date Formatting ====================

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(timeStr: string | undefined | null): string {
  if (!timeStr) return "-";
  return timeStr;
}

// ==================== Status Display ====================

export function getSaudaStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    OPEN: "Open",
    PARTIAL: "Partial",
    DISPATCHED: "Dispatched",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  };
  return labels[status] || status;
}

export function getGatePassStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    PENDING: "Pending",
    DONE: "Done",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
}

export function getKataiStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };
  return labels[status] || status;
}
