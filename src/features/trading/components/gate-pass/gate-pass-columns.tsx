import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Printer,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { GatePass } from "../../types";
import { formatGpNo, formatNumber } from "../../utils";

interface GatePassColumnOptions {
  onView?: (gatePass: GatePass) => void;
  onEdit?: (gatePass: GatePass) => void;
  onDelete?: (gatePass: GatePass) => void;
  onPrint?: (gatePass: GatePass) => void;
  onConfirm?: (gatePass: GatePass) => void;
  onMarkDone?: (gatePass: GatePass) => void;
  onCancel?: (gatePass: GatePass) => void;
}

function getStatusBadge(status: GatePass["status"]) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge
          variant="outline"
          className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
        >
          Draft
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20"
        >
          Pending
        </Badge>
      );
    case "DONE":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 border-green-500/20"
        >
          Done
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-600 border-red-500/20"
        >
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function getGatePassColumns(options: GatePassColumnOptions): ColumnDef<GatePass>[] {
  return [
    {
      accessorKey: "gpNo",
      header: "GP #",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatGpNo(row.getValue("gpNo"))}
        </span>
      ),
    },
    {
      accessorKey: "gpDate",
      header: "Date",
      cell: ({ row }) => (
        <div>
          <div>{format(new Date(row.getValue("gpDate")), "dd/MM/yyyy")}</div>
          {row.original.gpTime && (
            <div className="text-xs text-muted-foreground">
              {row.original.gpTime}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "sellerPartyName",
      header: "From",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.getValue("sellerPartyName") || "Unknown"}
          </div>
          {row.original.sellerVillage && (
            <div className="text-xs text-muted-foreground">
              {row.original.sellerVillage}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "buyerPartyName",
      header: "To",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.getValue("buyerPartyName") || "-"}
          </div>
          {row.original.buyerLocation && (
            <div className="text-xs text-muted-foreground">
              {row.original.buyerLocation}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "saudaNo",
      header: "Deal #",
      cell: ({ row }) => {
        const saudaNo = row.getValue("saudaNo") as number | null;
        return saudaNo ? `SD-${String(saudaNo).padStart(5, "0")}` : "-";
      },
    },
    {
      accessorKey: "totalPackets",
      header: "Bags",
      cell: ({ row }) => (
        <div className="text-right">
          {formatNumber(row.getValue("totalPackets"))}
        </div>
      ),
    },
    {
      accessorKey: "vehicleNo",
      header: "Vehicle",
      cell: ({ row }) => (
        <div>
          <div>{row.getValue("vehicleNo") || "-"}</div>
          {row.original.driverName && (
            <div className="text-xs text-muted-foreground">
              {row.original.driverName}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const gatePass = row.original;
        const isDraft = gatePass.status === "DRAFT";
        const isPending = gatePass.status === "PENDING";
        const canEdit = isDraft;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {options.onView && (
                <DropdownMenuItem onClick={() => options.onView!(gatePass)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {options.onPrint && (
                <DropdownMenuItem onClick={() => options.onPrint!(gatePass)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              )}
              {canEdit && options.onEdit && (
                <DropdownMenuItem onClick={() => options.onEdit!(gatePass)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {isDraft && options.onConfirm && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options.onConfirm!(gatePass)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm & Print
                  </DropdownMenuItem>
                </>
              )}
              {isPending && options.onMarkDone && (
                <DropdownMenuItem onClick={() => options.onMarkDone!(gatePass)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Done
                </DropdownMenuItem>
              )}
              {(isDraft || isPending) && options.onCancel && (
                <DropdownMenuItem onClick={() => options.onCancel!(gatePass)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </DropdownMenuItem>
              )}
              {isDraft && options.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onDelete!(gatePass)}
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
