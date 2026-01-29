import { cn } from "@/lib/utils";
import { Thermometer } from "lucide-react";
import { TEMPERATURE_STATUS_COLORS } from "@/config/constants";
import type { Chamber } from "../../types";

interface ChamberSelectorProps {
  chambers: Chamber[];
  selectedChamberId: string | undefined;
  onSelect: (chamberId: string) => void;
}

export function ChamberSelector({
  chambers,
  selectedChamberId,
  onSelect,
}: ChamberSelectorProps) {
  if (chambers.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No chambers configured. Add chambers in the Chambers tab.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chambers.map((chamber) => (
        <button
          key={chamber.id}
          onClick={() => onSelect(chamber.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
            "hover:bg-muted",
            selectedChamberId === chamber.id
              ? "border-primary bg-primary/10"
              : "border-border"
          )}
        >
          <div className="text-left">
            <div className="font-medium text-sm">{chamber.name}</div>
            <div className="text-xs text-muted-foreground">
              Room {chamber.roomNumber}
            </div>
          </div>
          {chamber.currentTemperature != null && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                chamber.temperatureStatus
                  ? TEMPERATURE_STATUS_COLORS[chamber.temperatureStatus]
                  : ""
              )}
            >
              <Thermometer className="h-3 w-3" />
              {chamber.currentTemperature}°C
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
