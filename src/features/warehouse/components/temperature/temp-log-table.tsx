import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { TEMPERATURE_STATUS_COLORS } from "@/config/constants";
import type { TemperatureLog } from "../../types";

interface TempLogTableProps {
  logs: TemperatureLog[];
}

const columns: ColumnDef<TemperatureLog>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "chamberName",
    header: "Chamber",
  },
  {
    accessorKey: "lowTemp",
    header: "Low",
    cell: ({ row }) => `${row.original.lowTemp}°C`,
  },
  {
    accessorKey: "highTemp",
    header: "High",
    cell: ({ row }) => `${row.original.highTemp}°C`,
  },
  {
    accessorKey: "avgTemp",
    header: "Avg",
    cell: ({ row }) =>
      row.original.avgTemp != null ? `${row.original.avgTemp}°C` : "-",
  },
  {
    accessorKey: "humidity",
    header: "Humidity",
    cell: ({ row }) =>
      row.original.humidity != null ? `${row.original.humidity}%` : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (!status) return null;
      return (
        <Badge variant="secondary" className={TEMPERATURE_STATUS_COLORS[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "recordedBy",
    header: "Recorded By",
  },
];

export function TempLogTable({ logs }: TempLogTableProps) {
  const sortedLogs = useMemo(
    () =>
      [...logs].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      }),
    [logs]
  );

  return <DataTable columns={columns} data={sortedLogs} />;
}
