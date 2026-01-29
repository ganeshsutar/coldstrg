import { Card, CardContent } from "@/components/ui/card";
import { Package, Box, AlertTriangle, Thermometer } from "lucide-react";
import type { ChamberStats, Chamber } from "../../types";

interface RoomKpiCardsProps {
  stats: ChamberStats | null;
  chamber: Chamber | undefined;
}

export function RoomKpiCards({ stats, chamber }: RoomKpiCardsProps) {
  if (!stats || !chamber) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Racks</span>
          </div>
          <div className="mt-1 text-2xl font-bold">{stats.totalRacks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Occupied</span>
          </div>
          <div className="mt-1 text-2xl font-bold">
            {stats.occupiedRacks}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              ({stats.occupancyPercentage}%)
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-muted-foreground">Empty</span>
          </div>
          <div className="mt-1 text-2xl font-bold">{stats.emptyRacks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <div className="mt-1 text-2xl font-bold">
            {chamber.currentTemperature != null
              ? `${chamber.currentTemperature}°C`
              : "N/A"}
          </div>
        </CardContent>
      </Card>

      {stats.maintenanceRacks > 0 && (
        <Card className="border-yellow-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-yellow-600">
              {stats.maintenanceRacks}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
