import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { StockTransfer, TransferStatusValue } from "../../types";

interface TransferColumnsOptions {
  onDelete: (transfer: StockTransfer) => void;
}

function getTransferStatusBadge(status: TransferStatusValue | null | undefined) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="default">Completed</Badge>;
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        >
          Pending
        </Badge>
      );
    case "CANCELLED":
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">-</Badge>;
  }
}

export function getTransferColumns({
  onDelete,
}: TransferColumnsOptions): ColumnDef<StockTransfer>[] {
  return [
    {
      accessorKey: "transferNo",
      header: "Transfer #",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("transferNo")}
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
      accessorKey: "fromPartyName",
      header: "From Party",
      cell: ({ row }) => row.original.fromPartyName || "-",
    },
    {
      accessorKey: "toPartyName",
      header: "To Party",
      cell: ({ row }) => row.original.toPartyName || "-",
    },
    {
      accessorKey: "amadNo",
      header: "Amad #",
      cell: ({ row }) => {
        const val = row.getValue("amadNo") as number | null;
        return val != null ? (
          <span className="font-mono text-sm">{val}</span>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "totalPackets",
      header: "Packets",
      cell: ({ row }) => row.original.totalPackets ?? 0,
    },
    {
      id: "rooms",
      header: "Room Transfer",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.sourceRoom || "?"} → {row.original.destRoom || "?"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        getTransferStatusBadge(
          row.getValue("status") as TransferStatusValue | null
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
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
