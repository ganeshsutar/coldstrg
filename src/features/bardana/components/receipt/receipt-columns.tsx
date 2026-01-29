import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import type { BardanaReceiptHeader, BardanaStatusValue } from "../../types";
import { formatCurrency, formatNumber } from "../../utils/calculations";
import { formatReceiptVoucherNo } from "../../utils/voucher-number";

interface ReceiptColumnsOptions {
  onView: (receipt: BardanaReceiptHeader) => void;
  onEdit: (receipt: BardanaReceiptHeader) => void;
  onDelete: (receipt: BardanaReceiptHeader) => void;
  onConfirm: (receipt: BardanaReceiptHeader) => void;
  onCancel: (receipt: BardanaReceiptHeader) => void;
}

function getStatusBadge(status: BardanaStatusValue) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        >
          Draft
        </Badge>
      );
    case "CONFIRMED":
      return <Badge variant="default">Confirmed</Badge>;
    case "CANCELLED":
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">-</Badge>;
  }
}

export function getReceiptColumns({
  onView,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
}: ReceiptColumnsOptions): ColumnDef<BardanaReceiptHeader>[] {
  return [
    {
      accessorKey: "voucherNo",
      header: "Voucher #",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {formatReceiptVoucherNo(row.getValue("voucherNo"))}
        </span>
      ),
    },
    {
      accessorKey: "receiptDate",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("receiptDate") as string;
        return date
          ? new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";
      },
    },
    {
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.partyName || "-"}</div>
          {row.original.partyVillage && (
            <div className="text-xs text-muted-foreground">
              {row.original.partyVillage}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "totalQuantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatNumber(row.getValue("totalQuantity") ?? 0)}
        </span>
      ),
    },
    {
      id: "condition",
      header: "Condition",
      cell: ({ row }) => {
        const good = row.original.totalGoodQuantity ?? 0;
        const fair = row.original.totalFairQuantity ?? 0;
        const damaged = row.original.totalDamagedQuantity ?? 0;
        return (
          <div className="text-xs space-y-0.5">
            {good > 0 && <div className="text-green-600">Good: {good}</div>}
            {fair > 0 && <div className="text-yellow-600">Fair: {fair}</div>}
            {damaged > 0 && <div className="text-red-600">Damaged: {damaged}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatCurrency(row.getValue("totalAmount") ?? 0)}
        </span>
      ),
    },
    {
      accessorKey: "netAmount",
      header: "Net Amount",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatCurrency(row.original.netAmount ?? 0)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const receipt = row.original;
        const isDraft = receipt.status === "DRAFT";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onView(receipt)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {isDraft && (
              <>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onEdit(receipt)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onConfirm(receipt)}
                  title="Confirm"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onCancel(receipt)}
                  title="Cancel"
                >
                  <XCircle className="h-3.5 w-3.5 text-orange-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(receipt)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
