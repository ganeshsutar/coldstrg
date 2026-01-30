import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Printer, Check, X, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RentBillHeader, BillStatusValue } from "../../types";
import { formatIndianRupees } from "../../utils";

interface ColumnOptions {
  onView: (bill: RentBillHeader) => void;
  onPrint: (bill: RentBillHeader) => void;
  onConfirm: (bill: RentBillHeader) => void;
  onCancel: (bill: RentBillHeader) => void;
  onRecordPayment: (bill: RentBillHeader) => void;
}

function getStatusBadgeVariant(
  status: BillStatusValue | null | undefined
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PAID":
      return "default";
    case "PARTIAL_PAID":
      return "secondary";
    case "OVERDUE":
    case "CANCELLED":
      return "destructive";
    case "DRAFT":
      return "outline";
    default:
      return "secondary";
  }
}

function getStatusLabel(status: BillStatusValue | null | undefined): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "CONFIRMED":
      return "Pending";
    case "PARTIAL_PAID":
      return "Partial";
    case "PAID":
      return "Paid";
    case "CANCELLED":
      return "Cancelled";
    case "OVERDUE":
      return "Overdue";
    default:
      return "Unknown";
  }
}

export function getRentBillColumns(options: ColumnOptions): ColumnDef<RentBillHeader>[] {
  return [
    {
      accessorKey: "billNo",
      header: "Bill #",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.billNo}</span>
      ),
    },
    {
      accessorKey: "billDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.billDate);
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.partyName}</div>
          {row.original.partyVillage && (
            <div className="text-xs text-muted-foreground">
              {row.original.partyVillage}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "roundedAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium">
            {formatIndianRupees(row.original.roundedAmount)}
          </div>
          {row.original.cgstAmount + row.original.sgstAmount + row.original.igstAmount > 0 && (
            <div className="text-xs text-muted-foreground">
              +GST{" "}
              {formatIndianRupees(
                row.original.cgstAmount +
                  row.original.sgstAmount +
                  row.original.igstAmount
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: "Paid",
      cell: ({ row }) => (
        <div className="text-right">
          <div>{formatIndianRupees(row.original.paidAmount)}</div>
          {row.original.balanceAmount > 0 && (
            <div className="text-xs text-orange-500">
              Bal: {formatIndianRupees(row.original.balanceAmount)}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const bill = row.original;
        const isDraft = bill.status === "DRAFT";
        const isPending =
          bill.status === "CONFIRMED" ||
          bill.status === "PARTIAL_PAID" ||
          bill.status === "OVERDUE";
        const isCancelled = bill.status === "CANCELLED";
        const isPaid = bill.status === "PAID";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => options.onView(bill)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              {!isCancelled && (
                <DropdownMenuItem onClick={() => options.onPrint(bill)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </DropdownMenuItem>
              )}
              {isPending && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options.onRecordPayment(bill)}>
                    <Banknote className="mr-2 h-4 w-4" />
                    Record Payment
                  </DropdownMenuItem>
                </>
              )}
              {isDraft && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options.onConfirm(bill)}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => options.onCancel(bill)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
              {(isPending || isDraft) && !isPaid && (
                <>
                  {bill.status !== "DRAFT" && <DropdownMenuSeparator />}
                  {bill.status !== "DRAFT" && (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => options.onCancel(bill)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Bill
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
