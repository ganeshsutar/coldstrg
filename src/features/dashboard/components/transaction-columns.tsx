"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Truck, PackageOpen, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { TransactionRow } from "../types";

export const transactionColumns: ColumnDef<TransactionRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "partyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Party
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("partyName")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const Icon =
        type === "amad" ? Truck : type === "nikasi" ? PackageOpen : Receipt;
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      const colorClass =
        type === "amad"
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/50"
          : type === "nikasi"
            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/50"
            : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/50";

      return (
        <Badge variant="outline" className={colorClass}>
          <Icon className="mr-1 h-3 w-3" />
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="tabular-nums">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "room",
    header: "Room",
    cell: ({ row }) => {
      const room = row.getValue("room") as string | undefined;
      return room ? <div>{room}</div> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      const date = new Date(timestamp);
      return (
        <div className="text-muted-foreground">
          {date.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })}{" "}
          {date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "completed" ? "secondary" : "outline"}
          className={
            status === "completed"
              ? ""
              : "border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
];
