import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ACTION_BADGE_COLORS } from "@/config/constants";
import type { AuditLogEntry } from "../../types";

export function getAuditLogColumns(): ColumnDef<AuditLogEntry>[] {
  return [
    {
      accessorKey: "createdAt",
      header: "Date/Time",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <span className="text-sm">
            {new Date(date).toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => {
        const name = row.getValue("userName") as string | null;
        return name || <span className="text-muted-foreground">Unknown</span>;
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        return (
          <Badge className={ACTION_BADGE_COLORS[action] || ""} variant="secondary">
            {action}
          </Badge>
        );
      },
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => {
        const module = row.getValue("module") as string | null;
        return module || "-";
      },
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => {
        const details = row.getValue("details") as string | null;
        return (
          <span className="text-sm max-w-[300px] truncate block">
            {details || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "entityType",
      header: "Entity",
      cell: ({ row }) => {
        const entityType = row.getValue("entityType") as string | null;
        return entityType || "-";
      },
    },
  ];
}
