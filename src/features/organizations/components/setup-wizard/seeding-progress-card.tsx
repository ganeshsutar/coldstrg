import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TableProgress } from "./wizard-types";

interface SeedingProgressCardProps {
  name: string;
  displayName: string;
  icon: string;
  progress: TableProgress;
  onRetry?: () => void;
}

export function SeedingProgressCard({
  name,
  displayName,
  icon,
  progress,
  onRetry,
}: SeedingProgressCardProps) {
  const { total, completed, skipped, status, currentItem, error } = progress;

  const getStatusIcon = () => {
    switch (status) {
      case "done":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "seeding":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "done":
        return "Completed";
      case "seeding":
        return currentItem ? `Creating: ${currentItem}` : "In progress...";
      case "error":
        return error || "Failed";
      default:
        return "Pending...";
    }
  };

  const getCardBgClass = () => {
    switch (status) {
      case "done":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "seeding":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
      case "error":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      default:
        return "bg-muted/30 border-muted";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        getCardBgClass()
      )}
      data-testid={`seeding-progress-${name}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{displayName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {status === "done" && skipped > 0
                ? `${completed - skipped} created, ${skipped} already existed`
                : `${completed} of ${total} records`}
            </p>
          </div>
        </div>
      </div>

      <p className={cn(
        "mt-2 text-sm",
        status === "error" ? "text-destructive" : "text-muted-foreground"
      )}>
        {getStatusText()}
      </p>

      {status === "error" && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
