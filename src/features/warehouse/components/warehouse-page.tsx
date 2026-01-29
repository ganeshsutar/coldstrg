import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/features/organizations";
import { ChambersTab } from "./chambers/chambers-tab";
import { RoomMapPage } from "./room-map/room-map-page";
import { LoadingList } from "./loading/loading-list";
import { UnloadingList } from "./unloading/unloading-list";
import { ShiftingList } from "./shifting/shifting-list";
import { TemperatureDashboard } from "./temperature/temperature-dashboard";
import { MeterReadingTab } from "./meter-reading/meter-reading-tab";
import { LoadingDialog } from "./loading/loading-dialog";
import { UnloadingDialog } from "./unloading/unloading-dialog";
import { ShiftingWizard } from "./shifting/shifting-wizard";
import type { RackOccupancy, Chamber } from "../types";

interface WarehouseTab {
  id: string;
  label: string;
}

const WAREHOUSE_TABS: WarehouseTab[] = [
  { id: "room-map", label: "Room Map" },
  { id: "chambers", label: "Chambers" },
  { id: "loading", label: "Loading" },
  { id: "unloading", label: "Unloading" },
  { id: "shifting", label: "Shifting" },
  { id: "temperature", label: "Temperature" },
  { id: "meter-reading", label: "Meter Reading" },
];

export function WarehousePage() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;
  const [activeTab, setActiveTab] = useState("room-map");

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
        <h1 className="text-2xl font-semibold tracking-tight">Warehouse</h1>
        <p className="text-sm text-muted-foreground">
          Manage chambers, rack occupancy, loading/unloading, and temperature monitoring.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left sidebar with tabs */}
        <nav className="flex flex-row gap-1 md:flex-col md:w-48 md:shrink-0 overflow-x-auto md:overflow-visible">
          {WAREHOUSE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md text-left transition-colors whitespace-nowrap",
                "hover:bg-muted",
                activeTab === tab.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {activeTab === "room-map" && (
            <RoomMapPage
              organizationId={orgId}
              onLoadGoods={handleLoadGoods}
              onUnloadGoods={handleUnloadGoods}
              onShiftGoods={handleShiftGoods}
            />
          )}
          {activeTab === "chambers" && (
            <ChambersTab organizationId={orgId} />
          )}
          {activeTab === "loading" && (
            <LoadingList organizationId={orgId} />
          )}
          {activeTab === "unloading" && (
            <UnloadingList organizationId={orgId} />
          )}
          {activeTab === "shifting" && (
            <ShiftingList organizationId={orgId} />
          )}
          {activeTab === "temperature" && (
            <TemperatureDashboard organizationId={orgId} />
          )}
          {activeTab === "meter-reading" && (
            <MeterReadingTab organizationId={orgId} />
          )}
        </div>
      </div>

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
