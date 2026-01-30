import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Check, Ban } from "lucide-react";
import type { PaySATTN } from "../../types";
import { formatCurrency } from "../../utils";

interface SalarySheetTableProps {
  salaries: PaySATTN[];
  onView: (salary: PaySATTN) => void;
  onApprove: (salary: PaySATTN) => void;
  onPay: (salary: PaySATTN) => void;
  onCancel: (salary: PaySATTN) => void;
}

export function SalarySheetTable({
  salaries,
  onView,
  onApprove,
  onPay,
  onCancel,
}: SalarySheetTableProps) {
  const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    DRAFT: "outline",
    PROCESSED: "secondary",
    APPROVED: "default",
    PAID: "default",
    CANCELLED: "destructive",
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="text-right">Working Days</TableHead>
            <TableHead className="text-right">Present</TableHead>
            <TableHead className="text-right">Basic</TableHead>
            <TableHead className="text-right">Allowances</TableHead>
            <TableHead className="text-right">Gross</TableHead>
            <TableHead className="text-right">PF</TableHead>
            <TableHead className="text-right">ESI</TableHead>
            <TableHead className="text-right">Deductions</TableHead>
            <TableHead className="text-right">Net Pay</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary) => (
            <TableRow key={salary.id}>
              <TableCell>
                <div className="font-medium">{salary.employeeName}</div>
                <div className="text-xs text-muted-foreground">
                  {salary.employeeCode}
                </div>
              </TableCell>
              <TableCell className="text-right">{salary.workingDays}</TableCell>
              <TableCell className="text-right">
                {salary.presentDays + salary.halfDays * 0.5}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(salary.basicSalary)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(salary.totalAllowances)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(salary.grossSalary)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(salary.pfAmount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(salary.esiAmount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(
                  salary.totalDeductions + salary.loanDeduction
                )}
              </TableCell>
              <TableCell className="text-right font-bold text-green-600">
                {formatCurrency(salary.netSalary)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={statusVariants[salary.status]}>
                  {salary.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onView(salary)}
                    title="View Details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  {salary.status === "DRAFT" && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onApprove(salary)}
                      title="Approve"
                    >
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </Button>
                  )}
                  {salary.status === "APPROVED" && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onPay(salary)}
                      title="Mark as Paid"
                    >
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                    </Button>
                  )}
                  {salary.status !== "PAID" && salary.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onCancel(salary)}
                      title="Cancel"
                    >
                      <Ban className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {salaries.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                No salary records found for this period
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
