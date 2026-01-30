// Employee hooks
export {
  useEmployeeList,
  useEmployee,
  useEmployeesByPost,
  useActiveEmployees,
  useNextEmployeeCode,
  useEmployeeStats,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "./use-employees";

// Pay Post hooks
export {
  usePayPostList,
  usePayPost,
  useCreatePayPost,
  useUpdatePayPost,
  useDeletePayPost,
} from "./use-pay-posts";

// Pay Allowance hooks
export {
  usePayAllowanceList,
  usePayAllowance,
  useCreatePayAllowance,
  useUpdatePayAllowance,
  useDeletePayAllowance,
} from "./use-pay-allowances";

// Pay Deduction hooks
export {
  usePayDeductionList,
  usePayDeduction,
  useCreatePayDeduction,
  useUpdatePayDeduction,
  useDeletePayDeduction,
} from "./use-pay-deductions";

// Attendance hooks
export {
  useAttendanceList,
  useAttendanceByEmployee,
  useAttendanceByEmployeeForMonth,
  useMonthlyAttendance,
  useAttendanceSummary,
  useTodayAttendanceStats,
  useMarkAttendance,
  useMarkBulkAttendance,
  useMarkAllPresent,
} from "./use-attendance";

// Salary (PaySATTN) hooks
export {
  usePaySATTNList,
  usePaySATTN,
  usePaySATTNByEmployee,
  usePaySATTNForMonth,
  useMonthlySalaryStats,
  useProcessSalary,
  useProcessAllSalaries,
  useApproveSalary,
  useMarkSalaryPaid,
  useCancelSalary,
} from "./use-pay-sattn";

// Pay Loan hooks
export {
  usePayLoanList,
  usePayLoan,
  usePayLoansByEmployee,
  useActivePayLoansByEmployee,
  useNextPayLoanNo,
  usePayLoanStats,
  useEmployeeLoanSummary,
  useCreatePayLoan,
  useUpdatePayLoan,
  useDeletePayLoan,
  useRecordEmiPayment,
  useCancelPayLoan,
} from "./use-pay-loans";

// Daily Wage hooks
export {
  useDWageList,
  useDWage,
  useDWageByDate,
  useDWageByDateRange,
  useUnpaidDWages,
  useDWageStats,
  useDailyWagesSummary,
  useCreateDWage,
  useUpdateDWage,
  useDeleteDWage,
  useMarkDWageAsPaid,
  useMarkBulkDWageAsPaid,
} from "./use-daily-wages";

// Payroll Stats hooks
export { usePayrollStats, useSalaryTrend } from "./use-payroll-stats";
