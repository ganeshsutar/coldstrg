import { Progress } from "@/components/ui/progress";
import { calculateDealProgress } from "../../utils";

interface SaudaProgressProps {
  dispatched: number;
  total: number;
  showLabels?: boolean;
}

export function SaudaProgress({ dispatched, total, showLabels = true }: SaudaProgressProps) {
  const progress = calculateDealProgress(dispatched, total);

  return (
    <div className="w-24">
      <Progress value={progress} className="h-2" />
      {showLabels && (
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {dispatched}/{total}
        </div>
      )}
    </div>
  );
}
