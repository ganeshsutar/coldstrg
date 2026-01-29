import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ThermometerSnowflake, ThermometerSun } from "lucide-react";
import type { Chamber } from "../../types";

interface TempAlertCardProps {
  chambers: Chamber[];
}

export function TempAlertCard({ chambers }: TempAlertCardProps) {
  const alerts = chambers.filter(
    (c) => c.temperatureStatus === "WARNING" || c.temperatureStatus === "CRITICAL"
  );

  if (alerts.length === 0) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <ThermometerSnowflake className="h-8 w-8 text-green-500" />
            <div>
              <div className="font-medium text-green-700 dark:text-green-300">
                All Temperatures Normal
              </div>
              <div className="text-sm text-muted-foreground">
                All chambers are within acceptable range.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          Temperature Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((chamber) => (
          <div
            key={chamber.id}
            className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded"
          >
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-4 w-4 text-red-500" />
              <span className="font-medium">{chamber.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-red-600 dark:text-red-400">
                {chamber.currentTemperature}°C
              </div>
              <div className="text-xs text-muted-foreground">
                Target: {chamber.targetTemperature}°C
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
