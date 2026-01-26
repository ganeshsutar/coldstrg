import {
  AlertTriangle,
  AlertCircle,
  Info,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Alert, AlertType } from "../types";

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig: Record<
  AlertType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    badgeVariant: "destructive" | "secondary" | "default" | "outline";
  }
> = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    badgeVariant: "destructive",
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    badgeVariant: "secondary",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    badgeVariant: "outline",
  },
  temperature: {
    icon: Thermometer,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    badgeVariant: "secondary",
  },
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const criticalCount = alerts.filter((a) => a.type === "critical").length;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Alerts & Notifications
        </CardTitle>
        {criticalCount > 0 && (
          <Badge variant="destructive">{criticalCount} critical</Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6">
          <div className="space-y-3 pb-4">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {alert.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
