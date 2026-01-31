import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { SHIFTING_STATUS_COLORS } from "@/config/constants";
import { useShiftingHeaders } from "../../hooks/use-shifting";
import { TableSkeleton } from "@/components/loading";
import type { ShiftingHeader } from "../../types";

interface ShiftingListProps {
  organizationId: string;
}

const columns: ColumnDef<ShiftingHeader>[] = [
  {
    accessorKey: "shiftNo",
    header: "Shift #",
  },
  {
    accessorKey: "shiftDate",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.shiftDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "fromChamberName",
    header: "From Chamber",
  },
  {
    accessorKey: "toChamberName",
    header: "To Chamber",
  },
  {
    accessorKey: "totalItems",
    header: "Items",
  },
  {
    accessorKey: "totalQuantity",
    header: "Quantity",
    cell: ({ row }) => `${row.original.totalQuantity} bags`,
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (!status) return null;
      return (
        <Badge variant="secondary" className={SHIFTING_STATUS_COLORS[status]}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
];

export function ShiftingList({ organizationId }: ShiftingListProps) {
  const { data: shiftings = [], isLoading } = useShiftingHeaders(organizationId);

  const sortedShiftings = useMemo(
    () =>
      [...shiftings]
        .filter((s) => s.isActive !== false)
        .sort((a, b) => b.shiftNo - a.shiftNo),
    [shiftings]
  );

  if (isLoading) {
    return <TableSkeleton columns={8} rows={6} />;
  }

  return <DataTable columns={columns} data={sortedShiftings} />;
}
