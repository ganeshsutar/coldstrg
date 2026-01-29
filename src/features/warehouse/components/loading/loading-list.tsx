import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { RACK_STATUS_COLORS } from "@/config/constants";
import { useLoadings } from "../../hooks/use-loading";
import type { Loading } from "../../types";

interface LoadingListProps {
  organizationId: string;
}

const columns: ColumnDef<Loading>[] = [
  {
    accessorKey: "loadingNo",
    header: "Loading #",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
  },
  {
    accessorKey: "amadNo",
    header: "Amad #",
  },
  {
    accessorKey: "partyName",
    header: "Party",
  },
  {
    accessorKey: "commodityName",
    header: "Commodity",
  },
  {
    accessorKey: "chamberName",
    header: "Chamber",
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <span>
        F{row.original.floorNumber}-R{row.original.rackNumber}
      </span>
    ),
  },
  {
    accessorKey: "totalQuantity",
    header: "Quantity",
    cell: ({ row }) => `${row.original.totalQuantity} bags`,
  },
  {
    accessorKey: "rackStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.rackStatus;
      if (!status) return null;
      return (
        <Badge variant="secondary" className={RACK_STATUS_COLORS[status]}>
          {status}
        </Badge>
      );
    },
  },
];

export function LoadingList({ organizationId }: LoadingListProps) {
  const { data: loadings = [], isLoading } = useLoadings(organizationId);

  const sortedLoadings = useMemo(
    () =>
      [...loadings]
        .filter((l) => l.isActive !== false)
        .sort((a, b) => b.loadingNo - a.loadingNo),
    [loadings]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <DataTable columns={columns} data={sortedLoadings} />;
}
