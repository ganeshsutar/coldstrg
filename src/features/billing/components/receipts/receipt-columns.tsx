import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Printer, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Receipt, ReceiptStatusValue, ReceiptPaymentModeValue } from "../../types";
import { formatIndianRupees } from "../../utils";

interface ColumnOptions {
  onView: (receipt: Receipt) => void;
  onPrint: (receipt: Receipt) => void;
  onConfirm: (receipt: Receipt) => void;
  onCancel: (receipt: Receipt) => void;
}

function getStatusBadgeVariant(
  status: ReceiptStatusValue | null | undefined
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "CONFIRMED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "DRAFT":
      return "outline";
    default:
      return "secondary";
  }
}

function getPaymentModeLabel(mode: ReceiptPaymentModeValue | null | undefined): string {
  switch (mode) {
    case "CASH":
      return "Cash";
    case "CHEQUE":
      return "Cheque";
    case "BANK":
      return "Bank Transfer";
    case "UPI":
      return "UPI";
    default:
      return "-";
  }
}

export function getReceiptColumns(options: ColumnOptions): ColumnDef<Receipt>[] {
  return [
    {
      accessorKey: "receiptNo",
      header: "Receipt #",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.receiptNo}</span>
      ),
    },
    {
      accessorKey: "receiptDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.receiptDate);
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
        <div className="font-medium">{row.original.partyName}</div>
      ),
    },
    {
      accessorKey: "paymentMode",
      header: "Mode",
      cell: ({ row }) => (
        <Badge variant="outline">
          {getPaymentModeLabel(row.original.paymentMode)}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatIndianRupees(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "chequeNo",
      header: "Reference",
      cell: ({ row }) => {
        const receipt = row.original;
        if (receipt.paymentMode === "CHEQUE" && receipt.chequeNo) {
          return (
            <div className="text-sm">
              <div>Chq: {receipt.chequeNo}</div>
              {receipt.bankName && (
                <div className="text-muted-foreground">{receipt.bankName}</div>
              )}
            </div>
          );
        }
        if (receipt.paymentMode === "UPI" && receipt.upiRef) {
          return <div className="text-sm">UPI: {receipt.upiRef}</div>;
        }
        if (receipt.paymentMode === "BANK" && receipt.bankRef) {
          return <div className="text-sm">Ref: {receipt.bankRef}</div>;
        }
        return "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const receipt = row.original;
        const isDraft = receipt.status === "DRAFT";
        const isCancelled = receipt.status === "CANCELLED";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => options.onView(receipt)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              {!isCancelled && (
                <DropdownMenuItem onClick={() => options.onPrint(receipt)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </DropdownMenuItem>
              )}
              {isDraft && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options.onConfirm(receipt)}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => options.onCancel(receipt)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
