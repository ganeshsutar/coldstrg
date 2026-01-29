import { useState, useMemo } from "react";
import { ChamberSelector } from "./chamber-selector";
import { FloorGrid } from "./floor-grid";
import { RackLegend } from "./legend";
import { RoomKpiCards } from "./room-kpi-cards";
import { RackDetailSheet } from "./rack-detail-sheet";
import { RackTooltip } from "./rack-tooltip";
import { useChambers } from "../../hooks/use-chambers";
import { useChamberFloorsByChamberId } from "../../hooks/use-chamber-floors";
import { useRackOccupancy, useChamberStats } from "../../hooks/use-rack-occupancy";
import type { RackOccupancy, Chamber } from "../../types";

interface RoomMapPageProps {
  organizationId: string;
  onLoadGoods?: (rack: RackOccupancy, chamber: Chamber) => void;
  onUnloadGoods?: (rack: RackOccupancy, chamber: Chamber) => void;
  onShiftGoods?: (rack: RackOccupancy, chamber: Chamber) => void;
}

export function RoomMapPage({
  organizationId,
  onLoadGoods,
  onUnloadGoods,
  onShiftGoods,
}: RoomMapPageProps) {
  const { data: chambers = [], isLoading: chambersLoading } = useChambers(organizationId);
  const [selectedChamberId, setSelectedChamberId] = useState<string>();
  const [selectedRack, setSelectedRack] = useState<RackOccupancy | null>(null);
  const [hoveredRack, setHoveredRack] = useState<RackOccupancy | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const selectedChamber = useMemo(
    () => chambers.find((c) => c.id === selectedChamberId),
    [chambers, selectedChamberId]
  );

  const { data: floors = [] } = useChamberFloorsByChamberId(selectedChamberId);
  const { data: occupancies = [] } = useRackOccupancy(selectedChamberId);
  const stats = useChamberStats(selectedChamber);

  // Auto-select first chamber
  useState(() => {
    if (chambers.length > 0 && !selectedChamberId) {
      setSelectedChamberId(chambers[0].id);
    }
  });

  function handleRackClick(rack: RackOccupancy) {
    setSelectedRack(rack);
    setDetailSheetOpen(true);
  }

  if (chambersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading chambers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chamber selector */}
      <ChamberSelector
        chambers={chambers}
        selectedChamberId={selectedChamberId}
        onSelect={setSelectedChamberId}
      />

      {selectedChamber && (
        <>
          {/* KPI Cards */}
          <RoomKpiCards stats={stats} chamber={selectedChamber} />

          {/* Legend */}
          <RackLegend />

          {/* Floor grids */}
          <div className="space-y-4 relative">
            {floors.length > 0 ? (
              floors
                .sort((a, b) => a.floorNumber - b.floorNumber)
                .map((floor) => (
                  <FloorGrid
                    key={floor.id}
                    floor={floor}
                    occupancies={occupancies}
                    selectedRack={selectedRack}
                    onRackClick={handleRackClick}
                    onRackHover={setHoveredRack}
                  />
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No floors configured for this chamber. Configure floors in the
                Chambers tab.
              </div>
            )}

            {/* Tooltip */}
            {hoveredRack && (
              <div className="fixed top-24 right-6 z-50 pointer-events-none">
                <RackTooltip rack={hoveredRack} />
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail sheet */}
      <RackDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        rack={selectedRack}
        chamber={selectedChamber}
        onLoadGoods={() => {
          if (selectedRack && selectedChamber) {
            onLoadGoods?.(selectedRack, selectedChamber);
            setDetailSheetOpen(false);
          }
        }}
        onUnloadGoods={() => {
          if (selectedRack && selectedChamber) {
            onUnloadGoods?.(selectedRack, selectedChamber);
            setDetailSheetOpen(false);
          }
        }}
        onShiftGoods={() => {
          if (selectedRack && selectedChamber) {
            onShiftGoods?.(selectedRack, selectedChamber);
            setDetailSheetOpen(false);
          }
        }}
      />
    </div>
  );
}
