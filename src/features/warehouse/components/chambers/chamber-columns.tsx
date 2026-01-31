import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEMPERATURE_STATUS_COLORS } from "@/config/constants";
import type { Chamber } from "../../types";

interface ChamberColumnsProps {
  onEdit: (chamber: Chamber) => void;
  onDelete: (chamber: Chamber) => void;
  onConfigureFloors: (chamber: Chamber) => void;
}

export function getChamberColumns({
  onEdit,
  onDelete,
  onConfigureFloors,
}: ChamberColumnsProps): ColumnDef<Chamber>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          {row.original.nameHindi && (
            <div className="text-sm text-muted-foreground">
              {row.original.nameHindi}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "roomNumber",
      header: "Room #",
    },
    {
      accessorKey: "floors",
      header: "Floors",
    },
    {
      accessorKey: "totalRacks",
      header: "Racks",
    },
    {
      accessorKey: "targetTemperature",
      header: "Target Temp",
      cell: ({ row }) => (
        <span>
          {row.original.targetTemperature != null
            ? `${row.original.targetTemperature}°C`
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "currentTemperature",
      header: "Current Temp",
      cell: ({ row }) => {
        const temp = row.original.currentTemperature;
        const status = row.original.temperatureStatus;
        return (
          <span
            className={
              status ? TEMPERATURE_STATUS_COLORS[status] : ""
            }
          >
            {temp != null ? `${temp}°C` : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "temperatureStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.temperatureStatus;
        if (!status) return null;
        return (
          <Badge
            variant="secondary"
            className={TEMPERATURE_STATUS_COLORS[status]}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive !== false ? "default" : "secondary"}>
          {row.original.isActive !== false ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const chamber = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(chamber)}
              title="Edit"
              data-testid={`chamber-edit-button-${chamber.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onConfigureFloors(chamber)}
              title="Configure Floors"
              data-testid={`chamber-floors-button-${chamber.id}`}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(chamber)}
              title="Delete"
              data-testid={`chamber-delete-button-${chamber.id}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];
}
