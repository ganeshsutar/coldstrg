import { Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { RoomOccupancy } from "../types";

interface RoomOccupancyProps {
  rooms: RoomOccupancy[];
}

export function RoomOccupancyCard({ rooms }: RoomOccupancyProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Room Occupancy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.map((room) => {
            const statusColors = {
              normal: "bg-green-500",
              warning: "bg-yellow-500",
              critical: "bg-red-500",
            };

            const progressColors = {
              normal: "[&>div]:bg-green-500",
              warning: "[&>div]:bg-yellow-500",
              critical: "[&>div]:bg-red-500",
            };

            const tempColors = {
              normal: "text-green-600 dark:text-green-400",
              warning: "text-yellow-600 dark:text-yellow-400",
              critical: "text-red-600 dark:text-red-400",
            };

            return (
              <div key={room.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        statusColors[room.status]
                      )}
                    />
                    <span className="text-sm font-medium">{room.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Thermometer
                        className={cn("h-3.5 w-3.5", tempColors[room.status])}
                      />
                      <span
                        className={cn("text-xs font-medium", tempColors[room.status])}
                      >
                        {room.temperature}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {room.occupancy}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress
                    value={room.occupancy}
                    className={cn("flex-1 h-2", progressColors[room.status])}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{room.current}</span>
                  <span>/ {room.capacity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
