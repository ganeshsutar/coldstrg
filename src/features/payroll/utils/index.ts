import { getDaysInMonth as getDaysInMonthFn } from "./salary-calculation";

export {
  calculateGrossSalary,
  calculateTotalAllowances,
  calculateTotalDeductions,
  calculateProRataSalary,
  calculateEffectiveDays,
  calculateOvertimeAmount,
  calculateNetSalary,
  getWorkingDaysInMonth,
  getDaysInMonth,
  calculateSalaryBreakdown,
  type SalaryBreakdown,
} from "./salary-calculation";

export {
  PF_RATES,
  PF_WAGE_CEILING,
  calculatePfDeduction,
  calculateEmployerPfContribution,
  calculatePfOnCappedBasic,
  ESI_RATES,
  calculateEsiDeduction,
  calculateEmployerEsiContribution,
  isEsiApplicable,
  NEW_TAX_SLABS,
  OLD_TAX_SLABS,
  calculateAnnualTax,
  calculateSurcharge,
  calculateCess,
  calculateTotalTax,
  calculateMonthlyTds,
  calculateTdsForMonth,
  PROFESSIONAL_TAX_SLABS,
  calculateProfessionalTax,
  calculateAllStatutoryDeductions,
  type StatutoryDeductionsSummary,
} from "./statutory-deductions";

export {
  calculateFlatEmi,
  calculateReducingEmi,
  generateEmiSchedule,
  generateFlatEmiSchedule,
  calculateTotalInterest,
  calculateOutstandingBalance,
  getNextEmiDetails,
  hasOverdueEmis,
  getExpectedPaidEmis,
  calculatePrepaymentImpact,
} from "./emi-calculation";

// ============== FORMATTING UTILITIES ==============

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function formatEmployeeCode(code: string): string {
  return code.toUpperCase();
}

// ============== VOUCHER NUMBER UTILITIES ==============

export function getNextEmployeeCode(
  employees: { code: string }[],
  prefix: string = "EMP"
): string {
  const codes = employees
    .map((e) => e.code)
    .filter((c) => c.startsWith(prefix))
    .map((c) => parseInt(c.replace(prefix, ""), 10))
    .filter((n) => !isNaN(n));

  const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
  return `${prefix}${String(maxCode + 1).padStart(4, "0")}`;
}

export function getNextLoanNo(loans: { loanNo: number }[]): number {
  if (loans.length === 0) return 1;
  return Math.max(...loans.map((l) => l.loanNo)) + 1;
}

export function getNextSerialNo(records: { serialNo: number }[]): number {
  if (records.length === 0) return 1;
  return Math.max(...records.map((r) => r.serialNo)) + 1;
}

// ============== DATE UTILITIES ==============

export function getMonthDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const totalDays = getDaysInMonthFn(year, month);

  for (let day = 1; day <= totalDays; day++) {
    dates.push(new Date(year, month - 1, day));
  }

  return dates;
}

export function isWeekend(date: Date, weeklyOffs: number[] = [0]): boolean {
  return weeklyOffs.includes(date.getDay());
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ============== ATTENDANCE UTILITIES ==============

export function getAttendanceStatusLabel(
  status: string
): { label: string; short: string; color: string } {
  switch (status) {
    case "PRESENT":
      return { label: "Present", short: "P", color: "green" };
    case "ABSENT":
      return { label: "Absent", short: "A", color: "red" };
    case "HALF_DAY":
      return { label: "Half Day", short: "½", color: "yellow" };
    case "LEAVE":
      return { label: "Leave", short: "L", color: "blue" };
    case "HOLIDAY":
      return { label: "Holiday", short: "H", color: "purple" };
    case "WEEKLY_OFF":
      return { label: "Weekly Off", short: "W", color: "gray" };
    default:
      return { label: status, short: "-", color: "gray" };
  }
}

export function cycleAttendanceStatus(currentStatus: string): string {
  const cycle = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"];
  const currentIndex = cycle.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % cycle.length;
  return cycle[nextIndex];
}
