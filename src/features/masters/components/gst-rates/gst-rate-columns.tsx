import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { GstRate } from "../../types";

interface GstRateColumnsOptions {
  onEdit: (rate: GstRate) => void;
  onDelete: (rate: GstRate) => void;
}

export function getGstRateColumns({
  onEdit,
  onDelete,
}: GstRateColumnsOptions): ColumnDef<GstRate>[] {
  return [
    {
      accessorKey: "hsnCode",
      header: "HSN Code",
      cell: ({ row }) => {
        const val = row.getValue("hsnCode") as string | null;
        return val ? (
          <span className="font-mono text-sm">{val}</span>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.getValue("description") || "-",
    },
    {
      accessorKey: "cgstRate",
      header: "CGST %",
      cell: ({ row }) => `${row.getValue("cgstRate")}%`,
    },
    {
      accessorKey: "sgstRate",
      header: "SGST %",
      cell: ({ row }) => `${row.getValue("sgstRate")}%`,
    },
    {
      accessorKey: "igstRate",
      header: "IGST %",
      cell: ({ row }) => `${row.getValue("igstRate")}%`,
    },
    {
      accessorKey: "effectiveDate",
      header: "Effective Date",
      cell: ({ row }) => {
        const date = row.getValue("effectiveDate") as string;
        return new Date(date).toLocaleDateString("en-IN");
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
