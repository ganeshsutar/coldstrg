import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/data-table";
import { useUnloadings } from "../../hooks/use-unloading";
import type { Unloading } from "../../types";

interface UnloadingListProps {
  organizationId: string;
}

const columns: ColumnDef<Unloading>[] = [
  {
    accessorKey: "unloadingNo",
    header: "Unloading #",
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
    accessorKey: "vehicleNo",
    header: "Vehicle",
  },
];

export function UnloadingList({ organizationId }: UnloadingListProps) {
  const { data: unloadings = [], isLoading } = useUnloadings(organizationId);

  const sortedUnloadings = useMemo(
    () =>
      [...unloadings]
        .filter((u) => u.isActive !== false)
        .sort((a, b) => b.unloadingNo - a.unloadingNo),
    [unloadings]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <DataTable columns={columns} data={sortedUnloadings} />;
}
