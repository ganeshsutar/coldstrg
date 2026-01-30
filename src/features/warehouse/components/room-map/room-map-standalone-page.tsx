import { useState } from "react";
import { useOrganization } from "@/features/organizations";
import { RoomMapPage } from "./room-map-page";
import { LoadingDialog } from "../loading/loading-dialog";
import { UnloadingDialog } from "../unloading/unloading-dialog";
import { ShiftingWizard } from "../shifting/shifting-wizard";
import type { RackOccupancy, Chamber } from "../../types";

export function RoomMapStandalonePage() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;

  // Dialog states
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [unloadingDialogOpen, setUnloadingDialogOpen] = useState(false);
  const [shiftingWizardOpen, setShiftingWizardOpen] = useState(false);
  const [selectedRack, setSelectedRack] = useState<RackOccupancy | undefined>();
  const [selectedChamber, setSelectedChamber] = useState<Chamber | undefined>();

  if (!orgId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No organization selected</div>
      </div>
    );
  }

  function handleLoadGoods(rack: RackOccupancy, chamber: Chamber) {
    setSelectedRack(rack);
    setSelectedChamber(chamber);
    setLoadingDialogOpen(true);
  }

  function handleUnloadGoods(rack: RackOccupancy, chamber: Chamber) {
    setSelectedRack(rack);
    setSelectedChamber(chamber);
    setUnloadingDialogOpen(true);
  }

  function handleShiftGoods(rack: RackOccupancy, chamber: Chamber) {
    setSelectedRack(rack);
    setSelectedChamber(chamber);
    setShiftingWizardOpen(true);
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Room Map</h1>
        <p className="text-sm text-muted-foreground">
          Visual overview of chamber rack occupancy and status
        </p>
      </div>

      <RoomMapPage
        organizationId={orgId}
        onLoadGoods={handleLoadGoods}
        onUnloadGoods={handleUnloadGoods}
        onShiftGoods={handleShiftGoods}
      />

      {/* Dialogs */}
      <LoadingDialog
        open={loadingDialogOpen}
        onOpenChange={(open) => {
          setLoadingDialogOpen(open);
          if (!open) {
            setSelectedRack(undefined);
            setSelectedChamber(undefined);
          }
        }}
        organizationId={orgId}
        preselectedRack={selectedRack}
        preselectedChamber={selectedChamber}
      />

      <UnloadingDialog
        open={unloadingDialogOpen}
        onOpenChange={(open) => {
          setUnloadingDialogOpen(open);
          if (!open) {
            setSelectedRack(undefined);
            setSelectedChamber(undefined);
          }
        }}
        organizationId={orgId}
        preselectedRack={selectedRack}
        preselectedChamber={selectedChamber}
      />

      <ShiftingWizard
        open={shiftingWizardOpen}
        onOpenChange={(open) => {
          setShiftingWizardOpen(open);
          if (!open) {
            setSelectedRack(undefined);
            setSelectedChamber(undefined);
          }
        }}
        organizationId={orgId}
        preselectedRack={selectedRack}
        preselectedChamber={selectedChamber}
      />
    </div>
  );
}
