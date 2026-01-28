import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Bank } from "../../types";

interface BankColumnsOptions {
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
}

export function getBankColumns({
  onEdit,
  onDelete,
}: BankColumnsOptions): ColumnDef<Bank>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("code")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Bank Name",
    },
    {
      accessorKey: "ifscPattern",
      header: "IFSC Pattern",
      cell: ({ row }) => {
        const val = row.getValue("ifscPattern") as string | null;
        return val ? (
          <span className="font-mono text-sm">{val}</span>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("isActive") as boolean | null;
        return (
          <Badge variant={active !== false ? "default" : "secondary"}>
            {active !== false ? "Active" : "Inactive"}
          </Badge>
        );
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
