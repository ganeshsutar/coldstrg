import { cn } from "@/lib/utils";
import { RACK_STATUS_BG_COLORS } from "@/config/constants";
import type { RackOccupancy } from "../../types";

interface RackCellProps {
  rack: RackOccupancy;
  onClick?: (rack: RackOccupancy) => void;
  onHover?: (rack: RackOccupancy | null) => void;
  isSelected?: boolean;
}

export function RackCell({ rack, onClick, onHover, isSelected }: RackCellProps) {
  return (
    <button
      className={cn(
        "w-8 h-8 md:w-10 md:h-10 rounded text-xs font-medium transition-all",
        "flex items-center justify-center",
        "border border-transparent",
        RACK_STATUS_BG_COLORS[rack.status] || "bg-gray-200",
        isSelected && "ring-2 ring-primary ring-offset-1",
        onClick && "cursor-pointer"
      )}
      onClick={() => onClick?.(rack)}
      onMouseEnter={() => onHover?.(rack)}
      onMouseLeave={() => onHover?.(null)}
      title={`Rack ${rack.rackNumber} - ${rack.status}`}
    >
      {rack.rackNumber}
    </button>
  );
}
