import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { VOUCHER_TYPE_COLORS } from "@/config/constants";
import type { Voucher, VoucherTypeValue } from "../../types";

interface VoucherColumnsOptions {
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
  onView: (voucher: Voucher) => void;
}

const VOUCHER_TYPE_LABELS: Record<VoucherTypeValue, string> = {
  CR: "Receipt",
  DR: "Payment",
  JV: "Journal",
  CV: "Contra",
  BH: "Bank",
};

function getVoucherTypeBadge(type: VoucherTypeValue) {
  const colorClass = VOUCHER_TYPE_COLORS[type] || "";
  return (
    <Badge variant="outline" className={colorClass}>
      {type} - {VOUCHER_TYPE_LABELS[type]}
    </Badge>
  );
}

const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export function getVoucherColumns({
  onEdit,
  onDelete,
  onView,
}: VoucherColumnsOptions): ColumnDef<Voucher>[] {
  return [
    {
      accessorKey: "voucherNo",
      header: "V.No",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("voucherNo")}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
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
      accessorKey: "voucherType",
      header: "Type",
      cell: ({ row }) =>
        getVoucherTypeBadge(row.getValue("voucherType") as VoucherTypeValue),
    },
    {
      accessorKey: "drAccountName",
      header: "Debit (Dr)",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.drAccountName || "-"}</div>
          {row.original.drAccountCode && (
            <div className="text-xs text-muted-foreground font-mono">
              {row.original.drAccountCode}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "crAccountName",
      header: "Credit (Cr)",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.crAccountName || "-"}</div>
          {row.original.crAccountCode && (
            <div className="text-xs text-muted-foreground font-mono">
              {row.original.crAccountCode}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.getValue("amount") as number)}
        </span>
      ),
    },
    {
      accessorKey: "narration",
      header: "Narration",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.original.narration || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}
