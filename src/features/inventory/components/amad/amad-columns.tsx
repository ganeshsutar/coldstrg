import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import type { Amad, AmadStatusValue } from "../../types";

interface AmadColumnsOptions {
  onEdit: (amad: Amad) => void;
  onDelete: (amad: Amad) => void;
  onView: (amad: Amad) => void;
}

function getStatusBadge(status: AmadStatusValue | null | undefined) {
  switch (status) {
    case "IN_STOCK":
      return <Badge variant="default">In Stock</Badge>;
    case "PARTIAL_DISPATCH":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        >
          Partial
        </Badge>
      );
    case "DISPATCHED":
      return <Badge variant="secondary">Dispatched</Badge>;
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400"
        >
          Pending
        </Badge>
      );
    default:
      return <Badge variant="secondary">-</Badge>;
  }
}

export function getAmadColumns({
  onEdit,
  onDelete,
  onView,
}: AmadColumnsOptions): ColumnDef<Amad>[] {
  return [
    {
      accessorKey: "amadNo",
      header: "Amad #",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("amadNo")}
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
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.partyName}</div>
          {row.original.villageName && (
            <div className="text-xs text-muted-foreground">
              {row.original.villageName}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "commodityName",
      header: "Commodity",
      cell: ({ row }) => row.original.commodityName || "-",
    },
    {
      accessorKey: "totalPackets",
      header: "Packets",
      cell: ({ row }) => {
        const total = row.original.totalPackets ?? 0;
        const dispatched = row.original.dispatchedPackets ?? 0;
        const balance = total - dispatched;
        return (
          <div className="text-sm">
            <span className="font-medium">{total}</span>
            {dispatched > 0 && (
              <span className="text-muted-foreground"> ({balance} left)</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalWeight",
      header: "Weight (kg)",
      cell: ({ row }) => {
        const val = row.getValue("totalWeight") as number | null;
        return val != null ? val.toLocaleString("en-IN") : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        getStatusBadge(row.getValue("status") as AmadStatusValue | null),
    },
    {
      accessorKey: "room",
      header: "Room",
      cell: ({ row }) => row.original.room || "-",
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
            data-testid={`amad-view-button-${row.original.id}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row.original)}
            data-testid={`amad-edit-button-${row.original.id}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row.original)}
            data-testid={`amad-delete-button-${row.original.id}`}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}
