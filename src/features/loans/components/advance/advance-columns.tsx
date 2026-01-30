import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Advance } from "../../types";
import { formatCurrency, formatAdvanceNo } from "../../utils";

interface AdvanceColumnOptions {
  onView?: (advance: Advance) => void;
  onEdit?: (advance: Advance) => void;
  onDelete?: (advance: Advance) => void;
  onConvert?: (advance: Advance) => void;
  onClose?: (advance: Advance) => void;
}

function getStatusBadge(status: Advance["status"]) {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
    case "CONVERTED":
      return <Badge variant="secondary">Converted</Badge>;
    case "ADJUSTED":
      return <Badge variant="secondary">Adjusted</Badge>;
    case "CLOSED":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function getAdvanceColumns(options: AdvanceColumnOptions): ColumnDef<Advance>[] {
  return [
    {
      accessorKey: "advanceNo",
      header: "Advance #",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatAdvanceNo(row.getValue("advanceNo"))}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("date")), "dd/MM/yyyy"),
    },
    {
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => row.getValue("partyName") || "Unknown",
    },
    {
      accessorKey: "expectedBags",
      header: "Expected Bags",
      cell: ({ row }) => row.getValue("expectedBags") ?? "-",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("amount")),
    },
    {
      accessorKey: "interestRate",
      header: "Interest",
      cell: ({ row }) => {
        const rate = row.getValue("interestRate") as number;
        return rate > 0 ? `${rate}% p.m.` : "-";
      },
    },
    {
      accessorKey: "expectedDate",
      header: "Expected Arrival",
      cell: ({ row }) => {
        const date = row.getValue("expectedDate") as string | null;
        return date ? format(new Date(date), "dd/MM/yyyy") : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const advance = row.original;
        const isPending = advance.status === "PENDING";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {options.onView && (
                <DropdownMenuItem onClick={() => options.onView!(advance)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {isPending && options.onEdit && (
                <DropdownMenuItem onClick={() => options.onEdit!(advance)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {isPending && options.onConvert && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options.onConvert!(advance)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Convert to Loan
                  </DropdownMenuItem>
                </>
              )}
              {isPending && options.onClose && (
                <DropdownMenuItem onClick={() => options.onClose!(advance)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Advance
                </DropdownMenuItem>
              )}
              {isPending && options.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onDelete!(advance)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
