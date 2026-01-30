import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Truck,
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
import type { Sauda } from "../../types";
import { formatSaudaNo, formatCurrency } from "../../utils";
import { SaudaProgress } from "./sauda-progress";

interface SaudaColumnOptions {
  onView?: (sauda: Sauda) => void;
  onEdit?: (sauda: Sauda) => void;
  onDelete?: (sauda: Sauda) => void;
  onCreateGatePass?: (sauda: Sauda) => void;
  onCancel?: (sauda: Sauda) => void;
  onComplete?: (sauda: Sauda) => void;
}

function getStatusBadge(status: Sauda["status"]) {
  switch (status) {
    case "OPEN":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 border-blue-500/20"
        >
          Open
        </Badge>
      );
    case "PARTIAL":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20"
        >
          Partial
        </Badge>
      );
    case "DISPATCHED":
      return (
        <Badge
          variant="outline"
          className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
        >
          Dispatched
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 border-green-500/20"
        >
          Completed
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

export function getSaudaColumns(options: SaudaColumnOptions): ColumnDef<Sauda>[] {
  return [
    {
      accessorKey: "saudaNo",
      header: "Deal #",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatSaudaNo(row.getValue("saudaNo"))}
        </span>
      ),
    },
    {
      accessorKey: "saudaDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("saudaDate")), "dd/MM/yyyy"),
    },
    {
      accessorKey: "sellerPartyName",
      header: "Seller",
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
      header: "Buyer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.getValue("buyerPartyName") || "Unknown"}
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
      accessorKey: "commodityName",
      header: "Commodity",
      cell: ({ row }) => (
        <div>
          <div>{row.getValue("commodityName") || "-"}</div>
          {row.original.variety && (
            <div className="text-xs text-muted-foreground">
              {row.original.variety}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Bags",
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("quantity")}
        </div>
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <div className="text-right">
          {formatCurrency(row.getValue("rate"))}
        </div>
      ),
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <SaudaProgress
          dispatched={row.original.dispatchedQty}
          total={row.original.quantity}
        />
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
        const sauda = row.original;
        const isOpen = sauda.status === "OPEN" || sauda.status === "PARTIAL";
        const canDispatch = isOpen && sauda.balanceQty > 0;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {options.onView && (
                <DropdownMenuItem onClick={() => options.onView!(sauda)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {isOpen && options.onEdit && (
                <DropdownMenuItem onClick={() => options.onEdit!(sauda)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDispatch && options.onCreateGatePass && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options.onCreateGatePass!(sauda)}>
                    <Truck className="h-4 w-4 mr-2" />
                    Create Gate Pass
                  </DropdownMenuItem>
                </>
              )}
              {isOpen && options.onComplete && (
                <DropdownMenuItem onClick={() => options.onComplete!(sauda)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </DropdownMenuItem>
              )}
              {isOpen && options.onCancel && (
                <DropdownMenuItem onClick={() => options.onCancel!(sauda)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Deal
                </DropdownMenuItem>
              )}
              {isOpen && options.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onDelete!(sauda)}
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
