/**
 * Statutory deduction calculations for Indian payroll
 * - PF (Provident Fund)
 * - ESI (Employee State Insurance)
 * - TDS (Tax Deducted at Source) - simplified
 */

// ============== PF CALCULATIONS ==============

export const PF_RATES = {
  EMPLOYEE_CONTRIBUTION: 12, // 12% of basic
  EMPLOYER_CONTRIBUTION: 12, // 12% of basic
  EPS_CONTRIBUTION: 8.33, // 8.33% goes to EPS (out of employer's 12%)
  EPF_CONTRIBUTION: 3.67, // 3.67% goes to EPF (out of employer's 12%)
  ADMIN_CHARGES: 0.5, // 0.5% admin charges
  EDLI_CHARGES: 0.5, // 0.5% EDLI charges
} as const;

export const PF_WAGE_CEILING = 15000; // PF wage ceiling

/**
 * Calculate PF deduction from employee salary
 */
export function calculatePfDeduction(
  basicSalary: number,
  rate: number = PF_RATES.EMPLOYEE_CONTRIBUTION
): number {
  return (basicSalary * rate) / 100;
}

/**
 * Calculate employer PF contribution
 */
export function calculateEmployerPfContribution(
  basicSalary: number,
  rate: number = PF_RATES.EMPLOYER_CONTRIBUTION
): number {
  return (basicSalary * rate) / 100;
}

/**
 * Calculate PF on capped basic (15000)
 */
export function calculatePfOnCappedBasic(
  basicSalary: number,
  rate: number = PF_RATES.EMPLOYEE_CONTRIBUTION
): number {
  const cappedBasic = Math.min(basicSalary, PF_WAGE_CEILING);
  return (cappedBasic * rate) / 100;
}

// ============== ESI CALCULATIONS ==============

export const ESI_RATES = {
  EMPLOYEE_CONTRIBUTION: 0.75, // 0.75% of gross
  EMPLOYER_CONTRIBUTION: 3.25, // 3.25% of gross
  WAGE_THRESHOLD: 21000, // ESI applicable if gross <= 21000
} as const;

/**
 * Calculate ESI deduction from employee salary
 */
export function calculateEsiDeduction(
  grossSalary: number,
  rate: number = ESI_RATES.EMPLOYEE_CONTRIBUTION,
  threshold: number = ESI_RATES.WAGE_THRESHOLD
): number {
  if (grossSalary > threshold) {
    return 0;
  }
  return (grossSalary * rate) / 100;
}

/**
 * Calculate employer ESI contribution
 */
export function calculateEmployerEsiContribution(
  grossSalary: number,
  rate: number = ESI_RATES.EMPLOYER_CONTRIBUTION,
  threshold: number = ESI_RATES.WAGE_THRESHOLD
): number {
  if (grossSalary > threshold) {
    return 0;
  }
  return (grossSalary * rate) / 100;
}

/**
 * Check if ESI is applicable
 */
export function isEsiApplicable(
  grossSalary: number,
  threshold: number = ESI_RATES.WAGE_THRESHOLD
): boolean {
  return grossSalary <= threshold;
}

// ============== TDS CALCULATIONS ==============

// New Tax Regime slabs (FY 2024-25)
export const NEW_TAX_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
] as const;

// Old Tax Regime slabs
export const OLD_TAX_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
] as const;

export const SURCHARGE_SLABS = [
  { min: 5000000, max: 10000000, rate: 10 },
  { min: 10000000, max: 20000000, rate: 15 },
  { min: 20000000, max: 50000000, rate: 25 },
  { min: 50000000, max: Infinity, rate: 37 },
] as const;

export const CESS_RATE = 4; // Health and Education Cess

/**
 * Calculate annual tax based on income slabs
 */
export function calculateAnnualTax(
  annualIncome: number,
  slabs: readonly { min: number; max: number; rate: number }[] = NEW_TAX_SLABS
): number {
  let tax = 0;

  for (const slab of slabs) {
    if (annualIncome <= slab.min) break;

    const taxableInThisSlab = Math.min(annualIncome, slab.max) - slab.min;
    tax += (taxableInThisSlab * slab.rate) / 100;
  }

  return tax;
}

/**
 * Calculate surcharge on tax
 */
export function calculateSurcharge(
  tax: number,
  annualIncome: number
): number {
  for (const slab of SURCHARGE_SLABS) {
    if (annualIncome > slab.min && annualIncome <= slab.max) {
      return (tax * slab.rate) / 100;
    }
  }
  return 0;
}

/**
 * Calculate health and education cess
 */
export function calculateCess(
  taxWithSurcharge: number,
  rate: number = CESS_RATE
): number {
  return (taxWithSurcharge * rate) / 100;
}

/**
 * Calculate total tax liability
 */
export function calculateTotalTax(annualIncome: number): number {
  const basicTax = calculateAnnualTax(annualIncome);
  const surcharge = calculateSurcharge(basicTax, annualIncome);
  const cess = calculateCess(basicTax + surcharge);
  return basicTax + surcharge + cess;
}

/**
 * Calculate monthly TDS based on annual income
 */
export function calculateMonthlyTds(
  annualIncome: number,
  monthsRemaining: number = 12
): number {
  const totalTax = calculateTotalTax(annualIncome);
  return totalTax / monthsRemaining;
}

/**
 * Calculate TDS for a month based on projected annual income
 */
export function calculateTdsForMonth(
  monthlySalary: number,
  monthsRemaining: number = 12
): number {
  const projectedAnnualIncome = monthlySalary * 12;
  return calculateMonthlyTds(projectedAnnualIncome, monthsRemaining);
}

// ============== PROFESSIONAL TAX ==============

// PT rates vary by state, this is a simplified version
export const PROFESSIONAL_TAX_SLABS = {
  KARNATAKA: [
    { min: 0, max: 15000, amount: 0 },
    { min: 15000, max: Infinity, amount: 200 },
  ],
  MAHARASHTRA: [
    { min: 0, max: 7500, amount: 0 },
    { min: 7500, max: 10000, amount: 175 },
    { min: 10000, max: Infinity, amount: 200 },
  ],
  UTTAR_PRADESH: [
    { min: 0, max: Infinity, amount: 0 }, // No PT in UP
  ],
} as const;

/**
 * Calculate professional tax based on state
 */
export function calculateProfessionalTax(
  grossSalary: number,
  state: keyof typeof PROFESSIONAL_TAX_SLABS = "UTTAR_PRADESH"
): number {
  const slabs = PROFESSIONAL_TAX_SLABS[state] || PROFESSIONAL_TAX_SLABS.UTTAR_PRADESH;

  for (const slab of slabs) {
    if (grossSalary > slab.min && grossSalary <= slab.max) {
      return slab.amount;
    }
  }

  return 0;
}

// ============== SUMMARY ==============

export interface StatutoryDeductionsSummary {
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  tds: number;
  professionalTax: number;
  totalEmployeeDeduction: number;
  totalEmployerContribution: number;
}

/**
 * Calculate all statutory deductions
 */
export function calculateAllStatutoryDeductions(params: {
  basicSalary: number;
  grossSalary: number;
  pfApplicable: boolean;
  esiApplicable: boolean;
  annualIncome?: number;
  state?: keyof typeof PROFESSIONAL_TAX_SLABS;
}): StatutoryDeductionsSummary {
  const {
    basicSalary,
    grossSalary,
    pfApplicable,
    esiApplicable,
    annualIncome,
    state = "UTTAR_PRADESH",
  } = params;

  const pfEmployee = pfApplicable ? calculatePfDeduction(basicSalary) : 0;
  const pfEmployer = pfApplicable
    ? calculateEmployerPfContribution(basicSalary)
    : 0;

  const esiEmployee = esiApplicable ? calculateEsiDeduction(grossSalary) : 0;
  const esiEmployer = esiApplicable
    ? calculateEmployerEsiContribution(grossSalary)
    : 0;

  const tds = annualIncome ? calculateTdsForMonth(grossSalary) : 0;
  const professionalTax = calculateProfessionalTax(grossSalary, state);

  return {
    pfEmployee,
    pfEmployer,
    esiEmployee,
    esiEmployer,
    tds,
    professionalTax,
    totalEmployeeDeduction: pfEmployee + esiEmployee + tds + professionalTax,
    totalEmployerContribution: pfEmployer + esiEmployer,
  };
}
