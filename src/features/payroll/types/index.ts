// ============== PAYROLL ENUMS ==============

export type PayComponentTypeValue = "FIXED" | "PERCENTAGE";
export type AttendanceStatusValue =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "LEAVE"
  | "HOLIDAY"
  | "WEEKLY_OFF";
export type SalaryProcessStatusValue =
  | "DRAFT"
  | "PROCESSED"
  | "APPROVED"
  | "PAID"
  | "CANCELLED";
export type StaffLoanStatusValue = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type EmployeeStatusValue = "ACTIVE" | "ON_LEAVE" | "RESIGNED" | "TERMINATED";
export type PaymentModeValue = "CASH" | "CHEQUE" | "BANK" | "UPI";

// ============== PAY POST TYPES ==============

export interface PayPost {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string | null;
  basicSalary: number;
  casualLeave: number;
  sickLeave: number;
  earnedLeave: number;
  pfApplicable: boolean;
  esiApplicable: boolean;
  otRate: number;
  otMultiplier: number;
  description?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayPostInput {
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string;
  basicSalary?: number;
  casualLeave?: number;
  sickLeave?: number;
  earnedLeave?: number;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  otRate?: number;
  otMultiplier?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePayPostInput extends Partial<CreatePayPostInput> {
  id: string;
}

// ============== PAY ALLOWANCE TYPES ==============

export interface PayAllowance {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string | null;
  componentType: PayComponentTypeValue;
  defaultValue: number;
  calculationBase?: string | null;
  isTaxable: boolean;
  description?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayAllowanceInput {
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string;
  componentType: PayComponentTypeValue;
  defaultValue?: number;
  calculationBase?: string;
  isTaxable?: boolean;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePayAllowanceInput extends Partial<CreatePayAllowanceInput> {
  id: string;
}

// ============== PAY DEDUCTION TYPES ==============

export interface PayDeduction {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string | null;
  componentType: PayComponentTypeValue;
  defaultValue: number;
  calculationBase?: string | null;
  isStatutory: boolean;
  description?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayDeductionInput {
  organizationId: string;
  code: string;
  name: string;
  nameHindi?: string;
  componentType: PayComponentTypeValue;
  defaultValue?: number;
  calculationBase?: string;
  isStatutory?: boolean;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePayDeductionInput extends Partial<CreatePayDeductionInput> {
  id: string;
}

// ============== STAFF ALLOWANCE TYPES ==============

export interface PaySAllowance {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  allowanceId: string;
  allowanceCode?: string | null;
  allowanceName?: string | null;
  componentType: PayComponentTypeValue;
  value: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaySAllowanceInput {
  organizationId: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  allowanceId: string;
  allowanceCode?: string;
  allowanceName?: string;
  componentType: PayComponentTypeValue;
  value: number;
  effectiveFrom: string;
  effectiveTo?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdatePaySAllowanceInput extends Partial<CreatePaySAllowanceInput> {
  id: string;
}

// ============== STAFF DEDUCTION TYPES ==============

export interface PaySDeduction {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  deductionId: string;
  deductionCode?: string | null;
  deductionName?: string | null;
  componentType: PayComponentTypeValue;
  value: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaySDeductionInput {
  organizationId: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  deductionId: string;
  deductionCode?: string;
  deductionName?: string;
  componentType: PayComponentTypeValue;
  value: number;
  effectiveFrom: string;
  effectiveTo?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdatePaySDeductionInput extends Partial<CreatePaySDeductionInput> {
  id: string;
}

// ============== PAY INCREMENTS TYPES ==============

export interface PayIncrements {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  incrementDate: string;
  previousBasic: number;
  previousGross: number;
  newBasic: number;
  newGross: number;
  incrementAmount: number;
  incrementPercent: number;
  pfRate: number;
  esiRate: number;
  reason?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayIncrementsInput {
  organizationId: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  incrementDate: string;
  previousBasic?: number;
  previousGross?: number;
  newBasic: number;
  newGross?: number;
  incrementAmount?: number;
  incrementPercent?: number;
  pfRate?: number;
  esiRate?: number;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdatePayIncrementsInput extends Partial<CreatePayIncrementsInput> {
  id: string;
}

// ============== PAY SATTN (SALARY ATTENDANCE) TYPES ==============

export interface PaySATTN {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  postId?: string | null;
  postName?: string | null;
  year: number;
  month: number;
  totalDays: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  holidays: number;
  weeklyOffs: number;
  effectiveDays: number;
  otHours: number;
  otAmount: number;
  basicSalary: number;
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  pfAmount: number;
  esiAmount: number;
  tdsAmount: number;
  loanDeduction: number;
  advanceDeduction: number;
  netSalary: number;
  status: SalaryProcessStatusValue;
  processedAt?: string | null;
  processedBy?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  paidAt?: string | null;
  paidBy?: string | null;
  paymentMode?: PaymentModeValue | null;
  paymentRef?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaySATTNInput {
  organizationId: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  postId?: string;
  postName?: string;
  year: number;
  month: number;
  totalDays?: number;
  workingDays?: number;
  presentDays?: number;
  absentDays?: number;
  halfDays?: number;
  leaveDays?: number;
  holidays?: number;
  weeklyOffs?: number;
  effectiveDays?: number;
  otHours?: number;
  otAmount?: number;
  basicSalary?: number;
  grossSalary?: number;
  totalAllowances?: number;
  totalDeductions?: number;
  pfAmount?: number;
  esiAmount?: number;
  tdsAmount?: number;
  loanDeduction?: number;
  advanceDeduction?: number;
  netSalary?: number;
  status: SalaryProcessStatusValue;
  processedAt?: string;
  processedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  paidBy?: string;
  paymentMode?: PaymentModeValue;
  paymentRef?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdatePaySATTNInput extends Partial<CreatePaySATTNInput> {
  id: string;
}

// ============== PAY LOAN TYPES ==============

export interface PayLoan {
  id: string;
  organizationId: string;
  loanNo: number;
  loanDate: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  emisPaid: number;
  emisRemaining: number;
  startDate: string;
  endDate?: string | null;
  lastEmiDate?: string | null;
  status: StaffLoanStatusValue;
  purpose?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayLoanInput {
  organizationId: string;
  loanNo: number;
  loanDate: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  loanAmount: number;
  interestRate?: number;
  tenure: number;
  emiAmount: number;
  totalPaid?: number;
  outstandingBalance?: number;
  emisPaid?: number;
  emisRemaining?: number;
  startDate: string;
  endDate?: string;
  lastEmiDate?: string;
  status: StaffLoanStatusValue;
  purpose?: string;
  approvedBy?: string;
  approvedAt?: string;
  narration?: string;
  isActive?: boolean;
}

export interface UpdatePayLoanInput extends Partial<CreatePayLoanInput> {
  id: string;
}

// ============== PAY LEDGER TYPES ==============

export interface PayLedger {
  id: string;
  organizationId: string;
  serialNo: number;
  date: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  transactionType: string;
  referenceId?: string | null;
  referenceNo?: string | null;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  year?: number | null;
  month?: number | null;
  paymentMode?: PaymentModeValue | null;
  paymentRef?: string | null;
  narration?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayLedgerInput {
  organizationId: string;
  serialNo: number;
  date: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  transactionType: string;
  referenceId?: string;
  referenceNo?: string;
  debitAmount?: number;
  creditAmount?: number;
  balance?: number;
  year?: number;
  month?: number;
  paymentMode?: PaymentModeValue;
  paymentRef?: string;
  narration?: string;
  isActive?: boolean;
}

export interface UpdatePayLedgerInput extends Partial<CreatePayLedgerInput> {
  id: string;
}

// ============== DAILY WAGE TYPES ==============

export interface DWage {
  id: string;
  organizationId: string;
  serialNo: number;
  date: string;
  workerName: string;
  workerContact?: string | null;
  workType?: string | null;
  hoursWorked: number;
  ratePerHour: number;
  unitsCompleted: number;
  ratePerUnit: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  isPaid: boolean;
  paidAt?: string | null;
  paymentMode?: PaymentModeValue | null;
  paymentRef?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDWageInput {
  organizationId: string;
  serialNo: number;
  date: string;
  workerName: string;
  workerContact?: string;
  workType?: string;
  hoursWorked?: number;
  ratePerHour?: number;
  unitsCompleted?: number;
  ratePerUnit?: number;
  grossAmount?: number;
  deductions?: number;
  netAmount?: number;
  isPaid?: boolean;
  paidAt?: string;
  paymentMode?: PaymentModeValue;
  paymentRef?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateDWageInput extends Partial<CreateDWageInput> {
  id: string;
}

// ============== EMPLOYEE TYPES ==============

export interface Employee {
  id: string;
  organizationId: string;
  code: string;
  firstName: string;
  lastName?: string | null;
  nameHindi?: string | null;
  fatherName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  aadharNo?: string | null;
  panNo?: string | null;
  postId?: string | null;
  postName?: string | null;
  joiningDate: string;
  confirmationDate?: string | null;
  resignationDate?: string | null;
  relievingDate?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankIfsc?: string | null;
  bankBranch?: string | null;
  basicSalary: number;
  grossSalary: number;
  pfNo?: string | null;
  esiNo?: string | null;
  uanNo?: string | null;
  pfApplicable: boolean;
  esiApplicable: boolean;
  casualLeaveBalance: number;
  sickLeaveBalance: number;
  earnedLeaveBalance: number;
  status: EmployeeStatusValue;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  organizationId: string;
  code: string;
  firstName: string;
  lastName?: string;
  nameHindi?: string;
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  aadharNo?: string;
  panNo?: string;
  postId?: string;
  postName?: string;
  joiningDate: string;
  confirmationDate?: string;
  resignationDate?: string;
  relievingDate?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankBranch?: string;
  basicSalary?: number;
  grossSalary?: number;
  pfNo?: string;
  esiNo?: string;
  uanNo?: string;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  casualLeaveBalance?: number;
  sickLeaveBalance?: number;
  earnedLeaveBalance?: number;
  status: EmployeeStatusValue;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  id: string;
}

// ============== ATTENDANCE TYPES ==============

export interface Attendance {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName?: string | null;
  date: string;
  status: AttendanceStatusValue;
  inTime?: string | null;
  outTime?: string | null;
  hoursWorked: number;
  otHours: number;
  leaveType?: string | null;
  remarks?: string | null;
  markedBy?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceInput {
  organizationId: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  date: string;
  status: AttendanceStatusValue;
  inTime?: string;
  outTime?: string;
  hoursWorked?: number;
  otHours?: number;
  leaveType?: string;
  remarks?: string;
  markedBy?: string;
  isActive?: boolean;
}

export interface UpdateAttendanceInput extends Partial<CreateAttendanceInput> {
  id: string;
}

// ============== FORM INPUT TYPES ==============

export interface EmployeeFormInput {
  code: string;
  firstName: string;
  lastName?: string;
  nameHindi?: string;
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  aadharNo?: string;
  panNo?: string;
  postId?: string;
  postName?: string;
  joiningDate: string;
  confirmationDate?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankBranch?: string;
  basicSalary?: number;
  grossSalary?: number;
  pfNo?: string;
  esiNo?: string;
  uanNo?: string;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  status: EmployeeStatusValue;
  remarks?: string;
}

export interface PayLoanFormInput {
  employeeId: string;
  employeeName?: string;
  loanDate: string;
  loanAmount: number;
  interestRate?: number;
  tenure: number;
  startDate: string;
  purpose?: string;
  narration?: string;
}

export interface DWageFormInput {
  date: string;
  workerName: string;
  workerContact?: string;
  workType?: string;
  hoursWorked?: number;
  ratePerHour?: number;
  unitsCompleted?: number;
  ratePerUnit?: number;
  deductions?: number;
  remarks?: string;
}

export interface AttendanceEntry {
  employeeId: string;
  date: string;
  status: AttendanceStatusValue;
  leaveType?: string;
  remarks?: string;
}

// ============== STATISTICS & SUMMARY TYPES ==============

export interface PayrollStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  salaryPayable: number;
  loanOutstanding: number;
}

export interface MonthlySalaryTrend {
  month: string;
  year: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
}

export interface EmployeeSalarySummary {
  employeeId: string;
  employeeName: string;
  postName?: string;
  basicSalary: number;
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  effectiveDays: number;
  workingDays: number;
}

export interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  effectiveDays: number;
}

export interface LoanEmiSchedule {
  emiNo: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  balance: number;
  status: "PENDING" | "PAID" | "OVERDUE";
}
