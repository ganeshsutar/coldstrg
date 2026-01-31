import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { MeterReadingDialog } from "./meter-reading-dialog";
import { useChambers } from "../../hooks/use-chambers";
import { useMeterReadings } from "../../hooks/use-meter-reading";
import type { MeterReading } from "../../types";

interface MeterReadingTabProps {
  organizationId: string;
}

const columns: ColumnDef<MeterReading>[] = [
  {
    accessorKey: "readingDate",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.readingDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "readingTime",
    header: "Time",
  },
  {
    accessorKey: "chamberName",
    header: "Chamber",
    cell: ({ row }) => row.original.chamberName || "General",
  },
  {
    accessorKey: "meterNumber",
    header: "Meter #",
  },
  {
    accessorKey: "previousReading",
    header: "Previous",
    cell: ({ row }) =>
      row.original.previousReading != null
        ? `${row.original.previousReading.toFixed(2)} kWh`
        : "-",
  },
  {
    accessorKey: "currentReading",
    header: "Current",
    cell: ({ row }) => `${row.original.currentReading.toFixed(2)} kWh`,
  },
  {
    accessorKey: "consumption",
    header: "Consumption",
    cell: ({ row }) =>
      row.original.consumption != null
        ? `${row.original.consumption.toFixed(2)} kWh`
        : "-",
  },
  {
    accessorKey: "recordedBy",
    header: "Recorded By",
  },
];

export function MeterReadingTab({ organizationId }: MeterReadingTabProps) {
  const { data: chambers = [] } = useChambers(organizationId);
  const { data: readings = [], isLoading } = useMeterReadings(organizationId);

  const [selectedChamberId, setSelectedChamberId] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredReadings = useMemo(() => {
    let filtered = readings.filter((r) => r.isActive !== false);
    if (selectedChamberId !== "all") {
      filtered = filtered.filter((r) => r.chamberId === selectedChamberId);
    }
    return filtered.sort((a, b) => b.readingDate.localeCompare(a.readingDate));
  }, [readings, selectedChamberId]);

  const totalConsumption = useMemo(() => {
    return filteredReadings.reduce((sum, r) => sum + (r.consumption || 0), 0);
  }, [filteredReadings]);

  const selectedChamber = chambers.find((c) => c.id === selectedChamberId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Select value={selectedChamberId} onValueChange={setSelectedChamberId}>
          <SelectTrigger className="w-64" data-testid="meter-chamber-filter">
            <SelectValue placeholder="All Meters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meters</SelectItem>
            {chambers.map((chamber) => (
              <SelectItem key={chamber.id} value={chamber.id}>
                {chamber.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setDialogOpen(true)} data-testid="new-meter-reading-button">
          <Plus className="h-4 w-4 mr-1" />
          Add Reading
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReadings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsumption.toFixed(2)} kWh</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredReadings[0]?.currentReading?.toFixed(2) || "N/A"} kWh
            </div>
            {filteredReadings[0] && (
              <div className="text-sm text-muted-foreground">
                {format(new Date(filteredReadings[0].readingDate), "dd MMM yyyy")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Readings Table */}
      <DataTable columns={columns} data={filteredReadings} />

      {/* Dialog */}
      <MeterReadingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        organizationId={organizationId}
        preselectedChamber={selectedChamber}
      />
    </div>
  );
}
