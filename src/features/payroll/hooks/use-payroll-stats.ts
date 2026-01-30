import { useQuery } from "@tanstack/react-query";
import { getEmployeeStats } from "../api/employees";
import { getTodayAttendanceStats } from "../api/attendance";
import { getMonthlySalaryStats } from "../api/pay-sattn";
import { getPayLoanStats } from "../api/pay-loans";
import type { PayrollStats } from "../types";

export function usePayrollStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["payroll-stats", organizationId],
    queryFn: async (): Promise<PayrollStats> => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      const [employeeStats, attendanceStats, loanStats] = await Promise.all([
        getEmployeeStats(organizationId),
        getTodayAttendanceStats(organizationId),
        getPayLoanStats(organizationId),
      ]);

      // Get current month stats
      const now = new Date();
      const salaryStats = await getMonthlySalaryStats(
        organizationId,
        now.getFullYear(),
        now.getMonth() + 1
      );

      return {
        totalEmployees: employeeStats.total,
        activeEmployees: employeeStats.active,
        presentToday: attendanceStats.present,
        salaryPayable: salaryStats.totalNet,
        loanOutstanding: loanStats.totalOutstanding,
      };
    },
    enabled: !!organizationId,
  });
}

export function useSalaryTrend(
  organizationId: string | undefined,
  months: number = 6
) {
  return useQuery({
    queryKey: ["salary-trend", organizationId, months],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      const trends = [];
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        try {
          const stats = await getMonthlySalaryStats(organizationId, year, month);
          trends.push({
            month: date.toLocaleDateString("en-IN", { month: "short" }),
            year,
            totalGross: stats.totalGross,
            totalDeductions:
              stats.totalPf + stats.totalEsi + (stats.totalGross - stats.totalNet),
            totalNet: stats.totalNet,
            employeeCount: stats.employeeCount,
          });
        } catch {
          trends.push({
            month: date.toLocaleDateString("en-IN", { month: "short" }),
            year,
            totalGross: 0,
            totalDeductions: 0,
            totalNet: 0,
            employeeCount: 0,
          });
        }
      }

      return trends;
    },
    enabled: !!organizationId,
  });
}
