import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, ChevronRight } from "lucide-react";
import type { Account } from "../../types";

interface PartyColumnsOptions {
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onView: (account: Account) => void;
}

function getBalanceBadge(balance: number | null | undefined) {
  const val = balance ?? 0;
  if (val > 0) {
    return (
      <Badge
        variant="outline"
        className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
      >
        DR
      </Badge>
    );
  } else if (val < 0) {
    return (
      <Badge
        variant="outline"
        className="border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
      >
        CR
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Nil
    </Badge>
  );
}

const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
};

export function getPartyColumns({
  onEdit,
  onDelete,
  onView,
}: PartyColumnsOptions): ColumnDef<Account>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("code")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Party Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          {row.original.nameHindi && (
            <div className="text-xs text-muted-foreground">
              {row.original.nameHindi}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => row.original.city || "-",
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const balance = row.original.balance ?? 0;
        return (
          <div className="flex items-center gap-2">
            {getBalanceBadge(balance)}
            <span
              className={`font-medium tabular-nums ${
                balance > 0
                  ? "text-green-600 dark:text-green-400"
                  : balance < 0
                    ? "text-red-600 dark:text-red-400"
                    : ""
              }`}
            >
              {formatCurrency(balance)}
            </span>
          </div>
        );
      },
    },
    {
      id: "packets",
      header: "Stock",
      cell: ({ row }) => {
        const arrived =
          (row.original.pkt1A ?? 0) +
          (row.original.pkt2A ?? 0) +
          (row.original.pkt3A ?? 0);
        const dispatched =
          (row.original.pkt1N ?? 0) +
          (row.original.pkt2N ?? 0) +
          (row.original.pkt3N ?? 0);
        const inStock = arrived - dispatched;
        return (
          <div className="text-sm">
            <span className="font-medium">{inStock}</span>
            <span className="text-muted-foreground text-xs ml-1">pkts</span>
          </div>
        );
      },
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
            data-testid={`party-view-button-${row.original.id}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row.original)}
            data-testid={`party-edit-button-${row.original.id}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row.original)}
            data-testid={`party-delete-button-${row.original.id}`}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onView(row.original)}
            data-testid={`party-expand-button-${row.original.id}`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}
