import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TEMPERATURE_STATUS_COLORS } from "@/config/constants";
import { formatTemperature, getTemperatureTrend, getTrendColor } from "../../utils/temperature-utils";
import type { Chamber, TemperatureLog } from "../../types";

interface TempStatusCardProps {
  chamber: Chamber;
  recentLogs: TemperatureLog[];
}

export function TempStatusCard({ chamber, recentLogs }: TempStatusCardProps) {
  const trend = getTemperatureTrend(recentLogs);
  const trendColor = getTrendColor(trend);

  const TrendIcon = trend === "rising" ? TrendingUp : trend === "falling" ? TrendingDown : Minus;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{chamber.name}</CardTitle>
          {chamber.temperatureStatus && (
            <Badge
              variant="secondary"
              className={TEMPERATURE_STATUS_COLORS[chamber.temperatureStatus]}
            >
              {chamber.temperatureStatus}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">
                {formatTemperature(chamber.currentTemperature)}
              </div>
              <div className="text-xs text-muted-foreground">
                Target: {formatTemperature(chamber.targetTemperature)}
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-xs capitalize">{trend}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Min: {formatTemperature(chamber.minTemperature)}</span>
          <span>Max: {formatTemperature(chamber.maxTemperature)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
