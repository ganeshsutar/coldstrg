import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Takpatti } from "../../types";

interface TakpattiColumnsOptions {
  onDelete: (takpatti: Takpatti) => void;
}

export function getTakpattiColumns({
  onDelete,
}: TakpattiColumnsOptions): ColumnDef<Takpatti>[] {
  return [
    {
      accessorKey: "takpattiNo",
      header: "Takpatti #",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("takpattiNo")}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return date
          ? new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";
      },
    },
    {
      accessorKey: "amadNo",
      header: "Amad #",
      cell: ({ row }) => {
        const val = row.getValue("amadNo") as number | null;
        return val != null ? (
          <span className="font-mono text-sm">{val}</span>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "pkt1",
      header: "PKT1",
      cell: ({ row }) => row.original.pkt1 ?? 0,
    },
    {
      accessorKey: "pkt2",
      header: "PKT2",
      cell: ({ row }) => row.original.pkt2 ?? 0,
    },
    {
      accessorKey: "pkt3",
      header: "PKT3",
      cell: ({ row }) => row.original.pkt3 ?? 0,
    },
    {
      accessorKey: "totalPackets",
      header: "Total Pkts",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.totalPackets ?? 0}</span>
      ),
    },
    {
      accessorKey: "room",
      header: "Room",
      cell: ({ row }) => row.original.room || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
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
