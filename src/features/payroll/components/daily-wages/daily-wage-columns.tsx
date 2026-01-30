import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { DWage } from "../../types";
import { formatCurrency, formatDate } from "../../utils";

interface DailyWageColumnsOptions {
  onEdit: (wage: DWage) => void;
  onDelete: (wage: DWage) => void;
}

export function getDailyWageColumns({
  onEdit,
  onDelete,
}: DailyWageColumnsOptions): ColumnDef<DWage>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("date")),
    },
    {
      accessorKey: "workerName",
      header: "Worker Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.workerName}</div>
      ),
    },
    {
      accessorKey: "workType",
      header: "Work Type",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.workType || "General"}</Badge>
      ),
    },
    {
      accessorKey: "hoursWorked",
      header: "Hours",
      cell: ({ row }) => `${row.original.hoursWorked || 0} hrs`,
    },
    {
      accessorKey: "ratePerHour",
      header: "Rate/Hr",
      cell: ({ row }) => formatCurrency(row.original.ratePerHour || 0),
    },
    {
      accessorKey: "grossAmount",
      header: "Gross",
      cell: ({ row }) => formatCurrency(row.original.grossAmount || 0),
    },
    {
      accessorKey: "deductions",
      header: "Deductions",
      cell: ({ row }) =>
        row.original.deductions
          ? formatCurrency(row.original.deductions)
          : "-",
    },
    {
      accessorKey: "netAmount",
      header: "Net",
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {formatCurrency(row.original.netAmount || 0)}
        </span>
      ),
    },
    {
      accessorKey: "isPaid",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isPaid ? "default" : "secondary"}>
          {row.original.isPaid ? "Paid" : "Pending"}
        </Badge>
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
