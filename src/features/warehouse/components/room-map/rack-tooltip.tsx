import { Badge } from "@/components/ui/badge";
import { RACK_STATUS_COLORS } from "@/config/constants";
import type { RackOccupancy } from "../../types";

interface RackTooltipProps {
  rack: RackOccupancy | null;
}

export function RackTooltip({ rack }: RackTooltipProps) {
  if (!rack) return null;

  return (
    <div className="z-50 p-3 bg-popover border rounded-lg shadow-lg min-w-[200px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Rack {rack.rackNumber}</span>
          <Badge
            variant="secondary"
            className={RACK_STATUS_COLORS[rack.status]}
          >
            {rack.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Floor {rack.floorNumber}
        </div>
        {rack.totalQuantity > 0 && (
          <div className="pt-2 border-t space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Quantity:</span>{" "}
              <span className="font-medium">{rack.totalQuantity} bags</span>
            </div>
            {rack.amadNo && (
              <div>
                <span className="text-muted-foreground">Amad #:</span>{" "}
                <span className="font-medium">{rack.amadNo}</span>
              </div>
            )}
            {rack.partyName && (
              <div>
                <span className="text-muted-foreground">Party:</span>{" "}
                <span className="font-medium">{rack.partyName}</span>
              </div>
            )}
            {rack.commodityName && (
              <div>
                <span className="text-muted-foreground">Commodity:</span>{" "}
                <span className="font-medium">{rack.commodityName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
