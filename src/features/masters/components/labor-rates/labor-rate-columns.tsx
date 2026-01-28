import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LABOR_RATE_TYPES } from "@/config/constants";
import type { LaborRate } from "../../types";

interface LaborRateColumnsOptions {
  onDelete: (rate: LaborRate) => void;
}

export function getLaborRateColumns({
  onDelete,
}: LaborRateColumnsOptions): ColumnDef<LaborRate>[] {
  return [
    {
      accessorKey: "effectiveDate",
      header: "Effective Date",
      cell: ({ row }) => {
        const date = row.getValue("effectiveDate") as string;
        return new Date(date).toLocaleDateString("en-IN");
      },
    },
    {
      accessorKey: "rateType",
      header: "Rate Type",
      cell: ({ row }) => {
        const type = row.getValue("rateType") as string;
        const label =
          LABOR_RATE_TYPES.find((t) => t.value === type)?.label || type;
        return (
          <Badge variant="secondary" className="text-xs">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "ratePKT1",
      header: "PKT1",
      cell: ({ row }) => `\u20B9${row.getValue("ratePKT1")}`,
    },
    {
      accessorKey: "ratePKT2",
      header: "PKT2",
      cell: ({ row }) => {
        const val = row.getValue("ratePKT2") as number | null;
        return val != null ? `\u20B9${val}` : "-";
      },
    },
    {
      accessorKey: "ratePKT3",
      header: "PKT3",
      cell: ({ row }) => {
        const val = row.getValue("ratePKT3") as number | null;
        return val != null ? `\u20B9${val}` : "-";
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => row.getValue("reason") || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      ),
    },
  ];
}
