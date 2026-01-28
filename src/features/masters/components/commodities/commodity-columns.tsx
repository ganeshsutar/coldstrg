import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Commodity } from "../../types";

interface CommodityColumnsOptions {
  onEdit: (commodity: Commodity) => void;
  onDelete: (commodity: Commodity) => void;
}

export function getCommodityColumns({
  onEdit,
  onDelete,
}: CommodityColumnsOptions): ColumnDef<Commodity>[] {
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
      header: "Name",
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
      accessorKey: "commodityType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("commodityType") as string | null;
        if (!type) return "-";
        return (
          <Badge variant="secondary" className="text-xs capitalize">
            {type.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "rentRatePKT1",
      header: "Rate PKT1",
      cell: ({ row }) => {
        const val = row.getValue("rentRatePKT1") as number | null;
        return val != null ? `\u20B9${val}` : "-";
      },
    },
    {
      accessorKey: "gracePeriod",
      header: "Grace Days",
      cell: ({ row }) => {
        const val = row.getValue("gracePeriod") as number | null;
        return val != null ? `${val} days` : "-";
      },
    },
    {
      accessorKey: "loanRate",
      header: "Loan Rate",
      cell: ({ row }) => {
        const val = row.getValue("loanRate") as number | null;
        return val != null ? `\u20B9${val}` : "-";
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
