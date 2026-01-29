import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TempStatusCard } from "./temp-status-card";
import { TempAlertCard } from "./temp-alert-card";
import { TempTrendChart } from "./temp-trend-chart";
import { TempLogTable } from "./temp-log-table";
import { TempLogDialog } from "./temp-log-dialog";
import { useChambers } from "../../hooks/use-chambers";
import { useRecentTemperatureLogs, useTemperatureLogsByChamberId } from "../../hooks/use-temperature";

interface TemperatureDashboardProps {
  organizationId: string;
}

export function TemperatureDashboard({ organizationId }: TemperatureDashboardProps) {
  const { data: chambers = [], isLoading: chambersLoading } = useChambers(organizationId);
  const { data: recentLogs = [] } = useRecentTemperatureLogs(organizationId, 7);

  const [selectedChamberId, setSelectedChamberId] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: chamberLogs = [] } = useTemperatureLogsByChamberId(
    selectedChamberId !== "all" ? selectedChamberId : undefined
  );

  const displayLogs = selectedChamberId === "all" ? recentLogs : chamberLogs;
  const selectedChamber = chambers.find((c) => c.id === selectedChamberId);

  if (chambersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Select value={selectedChamberId} onValueChange={setSelectedChamberId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All Chambers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chambers</SelectItem>
            {chambers.map((chamber) => (
              <SelectItem key={chamber.id} value={chamber.id}>
                {chamber.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Log Reading
        </Button>
      </div>

      {/* Alerts */}
      <TempAlertCard chambers={chambers} />

      {/* Chamber Status Cards */}
      {selectedChamberId === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chambers.map((chamber) => {
            const chamberRecentLogs = recentLogs.filter(
              (l) => l.chamberId === chamber.id
            );
            return (
              <TempStatusCard
                key={chamber.id}
                chamber={chamber}
                recentLogs={chamberRecentLogs}
              />
            );
          })}
        </div>
      ) : (
        selectedChamber && (
          <TempStatusCard chamber={selectedChamber} recentLogs={displayLogs} />
        )
      )}

      {/* Trend Chart */}
      <TempTrendChart logs={displayLogs} chamberName={selectedChamber?.name} />

      {/* Log Table */}
      <div>
        <h3 className="text-lg font-medium mb-4">Temperature Logs</h3>
        <TempLogTable logs={displayLogs} />
      </div>

      {/* Log Dialog */}
      <TempLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        organizationId={organizationId}
        preselectedChamber={selectedChamber}
      />
    </div>
  );
}
