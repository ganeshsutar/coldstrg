import { useState } from "react";
import { useOrganization } from "@/features/organizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText } from "lucide-react";
import { MonthYearSelector } from "../attendance/month-year-selector";
import { SalarySheetTable } from "./salary-sheet-table";
import {
  useActiveEmployees,
  usePaySATTNForMonth,
  useMonthlySalaryStats,
  useProcessAllSalaries,
  useApproveSalary,
  useMarkSalaryPaid,
  useCancelSalary,
} from "../../hooks";
import { formatCurrency } from "../../utils";
import type { PaySATTN } from "../../types";

export function SalaryProcessingPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: employees = [] } = useActiveEmployees(organizationId);
  const { data: salaries = [], isLoading } = usePaySATTNForMonth(
    organizationId,
    year,
    month
  );
  const { data: stats } = useMonthlySalaryStats(organizationId, year, month);

  const processAllMutation = useProcessAllSalaries();
  const approveMutation = useApproveSalary();
  const payMutation = useMarkSalaryPaid();
  const cancelMutation = useCancelSalary();

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleProcessAll = async () => {
    if (!organizationId) return;

    try {
      await processAllMutation.mutateAsync({
        organizationId,
        employees,
        year,
        month,
      });
      console.log("Salaries processed successfully");
    } catch (error) {
      console.error("Failed to process salaries", error);
    }
  };

  const handleView = (salary: PaySATTN) => {
    // Navigate to payslip view
    window.location.href = `/payroll/payslip?id=${salary.id}`;
  };

  const handleApprove = async (salary: PaySATTN) => {
    if (!organizationId) return;

    try {
      await approveMutation.mutateAsync({
        organizationId,
        salaryId: salary.id,
        approvedBy: "Admin", // Would come from auth context
      });
      console.log("Salary approved");
    } catch (error) {
      console.error("Failed to approve salary", error);
    }
  };

  const handlePay = async (salary: PaySATTN) => {
    if (!organizationId) return;

    try {
      await payMutation.mutateAsync({
        organizationId,
        salaryId: salary.id,
        paidBy: "Admin",
        paymentMode: "BANK",
      });
      console.log("Salary marked as paid");
    } catch (error) {
      console.error("Failed to mark salary as paid", error);
    }
  };

  const handleCancel = async (salary: PaySATTN) => {
    if (!organizationId) return;

    try {
      await cancelMutation.mutateAsync({
        organizationId,
        salaryId: salary.id,
      });
      console.log("Salary cancelled");
    } catch (error) {
      console.error("Failed to cancel salary", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Salary Processing
          </h1>
          <p className="text-sm text-muted-foreground">
            Calculate and process monthly salaries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleProcessAll}
            disabled={processAllMutation.isPending}
          >
            <Calculator className="mr-2 h-4 w-4" />
            {processAllMutation.isPending ? "Processing..." : "Calculate All"}
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gross
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalGross || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats?.totalNet || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total PF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalPf || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.employeeCount || 0}</div>
            <div className="text-xs text-muted-foreground">
              {stats?.paidCount || 0} paid
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <MonthYearSelector
          year={year}
          month={month}
          onChange={handleMonthChange}
        />
      </div>

      {/* Salary Sheet */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <SalarySheetTable
              salaries={salaries}
              onView={handleView}
              onApprove={handleApprove}
              onPay={handlePay}
              onCancel={handleCancel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
