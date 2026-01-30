import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import type { Employee } from "../../types";
import { formatCurrency } from "../../utils";

interface EmployeeColumnsOptions {
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function getEmployeeColumns({
  onView,
  onEdit,
  onDelete,
}: EmployeeColumnsOptions): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("code")}</span>
      ),
    },
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => {
        const firstName = row.original.firstName;
        const lastName = row.original.lastName;
        const nameHindi = row.original.nameHindi;
        return (
          <div>
            <div className="font-medium">
              {firstName} {lastName}
            </div>
            {nameHindi && (
              <div className="text-xs text-muted-foreground">{nameHindi}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "postName",
      header: "Designation",
      cell: ({ row }) => row.getValue("postName") || "-",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.getValue("phone") || "-",
    },
    {
      accessorKey: "basicSalary",
      header: "Basic Salary",
      cell: ({ row }) => {
        const salary = row.getValue("basicSalary") as number;
        return formatCurrency(salary);
      },
    },
    {
      accessorKey: "joiningDate",
      header: "Joining Date",
      cell: ({ row }) => {
        const date = row.getValue("joiningDate") as string;
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          ACTIVE: "default",
          ON_LEAVE: "secondary",
          RESIGNED: "destructive",
          TERMINATED: "destructive",
        };
        return (
          <Badge variant={variants[status] || "secondary"}>
            {status?.replace("_", " ") || "Unknown"}
          </Badge>
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
            onClick={() => onView(row.original)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
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
