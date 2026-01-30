import type {
  Employee,
  PaySAllowance,
  PaySDeduction,
  PayLoan,
  AttendanceSummary,
} from "../types";

/**
 * Calculate gross salary from basic and allowances
 */
export function calculateGrossSalary(
  basicSalary: number,
  allowances: PaySAllowance[]
): number {
  const totalAllowances = allowances.reduce((sum, allowance) => {
    if (allowance.componentType === "FIXED") {
      return sum + allowance.value;
    } else {
      // Percentage of basic
      return sum + (basicSalary * allowance.value) / 100;
    }
  }, 0);

  return basicSalary + totalAllowances;
}

/**
 * Calculate total allowances amount
 */
export function calculateTotalAllowances(
  basicSalary: number,
  allowances: PaySAllowance[]
): number {
  return allowances.reduce((sum, allowance) => {
    if (allowance.componentType === "FIXED") {
      return sum + allowance.value;
    } else {
      return sum + (basicSalary * allowance.value) / 100;
    }
  }, 0);
}

/**
 * Calculate total deductions amount (excluding statutory)
 */
export function calculateTotalDeductions(
  basicSalary: number,
  grossSalary: number,
  deductions: PaySDeduction[]
): number {
  return deductions.reduce((sum, deduction) => {
    if (deduction.componentType === "FIXED") {
      return sum + deduction.value;
    } else {
      // Percentage - determine base
      const base = deduction.deductionCode?.includes("BASIC")
        ? basicSalary
        : grossSalary;
      return sum + (base * deduction.value) / 100;
    }
  }, 0);
}

/**
 * Calculate pro-rata salary based on attendance
 */
export function calculateProRataSalary(
  monthlySalary: number,
  workingDays: number,
  effectiveDays: number
): number {
  if (workingDays <= 0) return 0;
  return (monthlySalary / workingDays) * effectiveDays;
}

/**
 * Calculate effective working days from attendance
 */
export function calculateEffectiveDays(attendance: AttendanceSummary): number {
  return (
    attendance.presentDays +
    attendance.halfDays * 0.5 +
    attendance.leaveDays // Assuming paid leaves
  );
}

/**
 * Calculate overtime amount
 */
export function calculateOvertimeAmount(
  otHours: number,
  basicSalary: number,
  workingDays: number,
  workingHoursPerDay: number = 8,
  otMultiplier: number = 1.5
): number {
  if (workingDays <= 0 || workingHoursPerDay <= 0) return 0;
  const hourlyRate = basicSalary / (workingDays * workingHoursPerDay);
  return otHours * hourlyRate * otMultiplier;
}

/**
 * Calculate net salary
 */
export function calculateNetSalary(
  grossSalary: number,
  totalDeductions: number,
  pfAmount: number,
  esiAmount: number,
  tdsAmount: number,
  loanDeduction: number,
  advanceDeduction: number
): number {
  return (
    grossSalary -
    totalDeductions -
    pfAmount -
    esiAmount -
    tdsAmount -
    loanDeduction -
    advanceDeduction
  );
}

/**
 * Get working days in a month
 */
export function getWorkingDaysInMonth(
  year: number,
  month: number,
  weeklyOffs: number[] = [0] // 0 = Sunday
): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    if (!weeklyOffs.includes(date.getDay())) {
      workingDays++;
    }
  }

  return workingDays;
}

/**
 * Get total days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Calculate salary components for an employee
 */
export interface SalaryBreakdown {
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  totalDeductions: number;
  pfAmount: number;
  esiAmount: number;
  tdsAmount: number;
  loanDeduction: number;
  advanceDeduction: number;
  netSalary: number;
  otAmount: number;
}

export function calculateSalaryBreakdown(params: {
  employee: Employee;
  allowances: PaySAllowance[];
  deductions: PaySDeduction[];
  activeLoans: PayLoan[];
  attendance: AttendanceSummary;
  workingDays: number;
  pfRate?: number;
  esiRate?: number;
  esiThreshold?: number;
  otHours?: number;
}): SalaryBreakdown {
  const {
    employee,
    allowances,
    deductions,
    activeLoans,
    attendance,
    workingDays,
    pfRate = 12,
    esiRate = 0.75,
    esiThreshold = 21000,
    otHours = 0,
  } = params;

  // Calculate effective days
  const effectiveDays = calculateEffectiveDays(attendance);

  // Calculate base amounts (full month)
  const basicSalary = employee.basicSalary;
  const totalAllowances = calculateTotalAllowances(basicSalary, allowances);
  const fullGrossSalary = basicSalary + totalAllowances;

  // Pro-rata for attendance
  const proRataBasic = calculateProRataSalary(
    basicSalary,
    workingDays,
    effectiveDays
  );
  const proRataAllowances = calculateProRataSalary(
    totalAllowances,
    workingDays,
    effectiveDays
  );
  const grossSalary = proRataBasic + proRataAllowances;

  // Calculate OT
  const otAmount = calculateOvertimeAmount(
    otHours,
    basicSalary,
    workingDays
  );

  // Calculate statutory deductions
  const pfAmount = employee.pfApplicable ? (proRataBasic * pfRate) / 100 : 0;
  const esiAmount =
    employee.esiApplicable && fullGrossSalary <= esiThreshold
      ? (grossSalary * esiRate) / 100
      : 0;
  const tdsAmount = 0; // TDS calculation would be more complex

  // Other deductions
  const totalDeductions = calculateTotalDeductions(
    proRataBasic,
    grossSalary,
    deductions
  );

  // Loan EMI deduction
  const loanDeduction = activeLoans.reduce(
    (sum, loan) => sum + loan.emiAmount,
    0
  );
  const advanceDeduction = 0; // Can be extended for salary advances

  // Net salary
  const netSalary = calculateNetSalary(
    grossSalary + otAmount,
    totalDeductions,
    pfAmount,
    esiAmount,
    tdsAmount,
    loanDeduction,
    advanceDeduction
  );

  return {
    basicSalary: proRataBasic,
    totalAllowances: proRataAllowances,
    grossSalary: grossSalary + otAmount,
    totalDeductions,
    pfAmount,
    esiAmount,
    tdsAmount,
    loanDeduction,
    advanceDeduction,
    netSalary,
    otAmount,
  };
}
