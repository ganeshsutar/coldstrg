import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Eye, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { LoanAmount } from "../../types";
import { formatCurrency, formatLoanNo, calculateLimitUsage } from "../../utils";

interface LagColumnOptions {
  onView?: (loan: LoanAmount) => void;
  onRecordPayment?: (loan: LoanAmount) => void;
  onClose?: (loan: LoanAmount) => void;
}

function getStatusBadge(status: LoanAmount["status"]) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          Active
        </Badge>
      );
    case "PARTIAL_REPAID":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          Partial
        </Badge>
      );
    case "OVERDUE":
      return <Badge variant="destructive">Overdue</Badge>;
    case "CLOSED":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function getLagColumns(options: LagColumnOptions): ColumnDef<LoanAmount>[] {
  return [
    {
      accessorKey: "loanNo",
      header: "Loan #",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatLoanNo(row.getValue("loanNo"))}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("date")), "dd/MM/yyyy"),
    },
    {
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => row.getValue("partyName") || "Unknown",
    },
    {
      accessorKey: "amadNo",
      header: "Amad #",
      cell: ({ row }) => {
        const amadNo = row.getValue("amadNo") as number | null;
        return amadNo ? `#${amadNo}` : "-";
      },
    },
    {
      accessorKey: "collateralBags",
      header: "Bags",
      cell: ({ row }) => row.getValue("collateralBags") ?? "-",
    },
    {
      accessorKey: "disbursedAmount",
      header: "Disbursed",
      cell: ({ row }) => formatCurrency(row.getValue("disbursedAmount")),
    },
    {
      accessorKey: "outstandingBalance",
      header: "Balance",
      cell: ({ row }) => {
        const balance = row.getValue("outstandingBalance") as number;
        const disbursed = row.original.disbursedAmount;
        const repaidPercent = calculateLimitUsage(
          disbursed - balance,
          disbursed
        );

        return (
          <div className="space-y-1">
            <span className="font-medium">{formatCurrency(balance)}</span>
            <Progress value={repaidPercent} className="h-1" />
          </div>
        );
      },
    },
    {
      accessorKey: "interestRate",
      header: "Rate",
      cell: ({ row }) => {
        const rate = row.getValue("interestRate") as number;
        return rate > 0 ? `${rate}% p.m.` : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const loan = row.original;
        const isActive =
          loan.status === "ACTIVE" || loan.status === "PARTIAL_REPAID";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {options.onView && (
                <DropdownMenuItem onClick={() => options.onView!(loan)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {isActive && options.onRecordPayment && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onRecordPayment!(loan)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Record Payment
                  </DropdownMenuItem>
                </>
              )}
              {isActive && options.onClose && (
                <DropdownMenuItem onClick={() => options.onClose!(loan)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Loan
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
