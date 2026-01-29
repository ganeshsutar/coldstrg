import { RACK_STATUS_BG_COLORS, RACK_STATUS_OPTIONS } from "@/config/constants";

export function RackLegend() {
  return (
    <div className="flex flex-wrap gap-4">
      {RACK_STATUS_OPTIONS.map((status) => (
        <div key={status.value} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded ${
              RACK_STATUS_BG_COLORS[status.value]?.split(" ")[0] || "bg-gray-200"
            }`}
          />
          <span className="text-sm text-muted-foreground">{status.label}</span>
        </div>
      ))}
    </div>
  );
}
