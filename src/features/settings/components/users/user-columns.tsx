import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ROLE_BADGE_COLORS } from "@/config/constants";
import type { OrganizationMembership } from "@/features/organizations/types";

interface UserColumnsOptions {
  onEdit: (member: OrganizationMembership) => void;
}

export function getUserColumns({ onEdit }: UserColumnsOptions): ColumnDef<OrganizationMembership>[] {
  return [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string | null;
        return (
          <span className="text-sm">
            {email || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge className={ROLE_BADGE_COLORS[role] || ""} variant="secondary">
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string | null;
        return (
          <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
            {status || "PENDING"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }) => {
        const date = row.getValue("lastLoginAt") as string | null;
        if (!date) return <span className="text-muted-foreground">Never</span>;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.getValue("joinedAt") as string | null;
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon-xs" onClick={() => onEdit(row.original)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];
}
