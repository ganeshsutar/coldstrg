import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Ban } from "lucide-react";
import type { PayLoan } from "../../types";
import { formatCurrency, formatDate } from "../../utils";

interface LoanColumnsOptions {
  onView: (loan: PayLoan) => void;
  onCancel: (loan: PayLoan) => void;
}

export function getLoanColumns({
  onView,
  onCancel,
}: LoanColumnsOptions): ColumnDef<PayLoan>[] {
  return [
    {
      accessorKey: "loanNo",
      header: "Loan No",
      cell: ({ row }) => (
        <span className="font-mono text-sm">LN-{row.getValue("loanNo")}</span>
      ),
    },
    {
      accessorKey: "employeeName",
      header: "Employee",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.employeeName}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.employeeCode}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "loanDate",
      header: "Loan Date",
      cell: ({ row }) => formatDate(row.getValue("loanDate")),
    },
    {
      accessorKey: "loanAmount",
      header: "Loan Amount",
      cell: ({ row }) => formatCurrency(row.getValue("loanAmount")),
    },
    {
      accessorKey: "emiAmount",
      header: "EMI",
      cell: ({ row }) => formatCurrency(row.getValue("emiAmount")),
    },
    {
      accessorKey: "tenure",
      header: "Tenure",
      cell: ({ row }) => `${row.getValue("tenure")} months`,
    },
    {
      accessorKey: "emisPaid",
      header: "Progress",
      cell: ({ row }) => {
        const paid = row.original.emisPaid;
        const total = row.original.tenure;
        const percent = Math.round((paid / total) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs">
              {paid}/{total}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "outstandingBalance",
      header: "Outstanding",
      cell: ({ row }) => (
        <span className="text-destructive font-medium">
          {formatCurrency(row.getValue("outstandingBalance"))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          ACTIVE: "default",
          COMPLETED: "secondary",
          CANCELLED: "destructive",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          {row.original.status === "ACTIVE" && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onCancel(row.original)}
            >
              <Ban className="h-3.5 w-3.5 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ];
}
