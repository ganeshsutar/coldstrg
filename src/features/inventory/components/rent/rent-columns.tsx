import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Rent } from "../../types";

interface RentColumnsOptions {
  onEdit: (rent: Rent) => void;
  onDelete: (rent: Rent) => void;
}

export function getRentColumns({
  onEdit,
  onDelete,
}: RentColumnsOptions): ColumnDef<Rent>[] {
  return [
    {
      accessorKey: "serialNo",
      header: "Serial #",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("serialNo")}
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
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.partyName}</span>
      ),
    },
    {
      accessorKey: "receiverName",
      header: "Receiver",
      cell: ({ row }) => row.original.receiverName || "-",
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
      accessorKey: "totalPackets",
      header: "Packets",
      cell: ({ row }) => row.original.totalPackets ?? 0,
    },
    {
      accessorKey: "totalWeight",
      header: "Weight (kg)",
      cell: ({ row }) => {
        const val = row.getValue("totalWeight") as number | null;
        return val != null ? val.toLocaleString("en-IN") : "-";
      },
    },
    {
      accessorKey: "storageDays",
      header: "Days",
      cell: ({ row }) => row.original.storageDays ?? "-",
    },
    {
      accessorKey: "rent",
      header: "Rent",
      cell: ({ row }) => {
        const val = row.getValue("rent") as number | null;
        return val != null ? `\u20B9${val.toLocaleString("en-IN")}` : "-";
      },
    },
    {
      accessorKey: "billAmount",
      header: "Bill Amount",
      cell: ({ row }) => {
        const val = row.getValue("billAmount") as number | null;
        return val != null ? (
          <span className="font-medium">
            {`\u20B9${val.toLocaleString("en-IN")}`}
          </span>
        ) : (
          "-"
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
