import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { LocationPicker } from "../loading/location-picker";
import { AmadSelector } from "../loading/amad-selector";
import { useCreateUnloading } from "../../hooks/use-unloading";
import { getNextUnloadingNo } from "../../api/unloading";
import type { Chamber, RackOccupancy, CreateUnloadingInput } from "../../types";
import type { Amad } from "@/features/inventory/types";

interface UnloadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  preselectedRack?: RackOccupancy;
  preselectedChamber?: Chamber;
}

export function UnloadingDialog({
  open,
  onOpenChange,
  organizationId,
  preselectedRack,
  preselectedChamber,
}: UnloadingDialogProps) {
  const createMutation = useCreateUnloading();

  const [unloadingNo, setUnloadingNo] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedAmad, setSelectedAmad] = useState<Amad | null>(null);
  const [chamberId, setChamberId] = useState<string | undefined>(preselectedChamber?.id);
  const [chamberName, setChamberName] = useState<string | undefined>(preselectedChamber?.name);
  const [floorNumber, setFloorNumber] = useState<number | undefined>(preselectedRack?.floorNumber);
  const [rackNumber, setRackNumber] = useState<number | undefined>(preselectedRack?.rackNumber);
  const [pkt1, setPkt1] = useState("");
  const [pkt2, setPkt2] = useState("");
  const [pkt3, setPkt3] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [remarks, setRemarks] = useState("");

  // Fetch unloading number when dialog opens
  useEffect(() => {
    if (open) {
      getNextUnloadingNo(organizationId).then(setUnloadingNo);
    }
  }, [open, organizationId]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      // Initialize with preselected values when opening
      if (preselectedChamber) {
        setChamberId(preselectedChamber.id);
        setChamberName(preselectedChamber.name);
      }
      if (preselectedRack) {
        setFloorNumber(preselectedRack.floorNumber);
        setRackNumber(preselectedRack.rackNumber);
      }
    } else {
      // Reset form when closing
      setSelectedAmad(null);
      setPkt1("");
      setPkt2("");
      setPkt3("");
      setVehicleNo("");
      setRemarks("");
    }
    onOpenChange(newOpen);
  }, [onOpenChange, preselectedChamber, preselectedRack]);

  const totalQuantity =
    (parseInt(pkt1, 10) || 0) + (parseInt(pkt2, 10) || 0) + (parseInt(pkt3, 10) || 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAmad || !chamberId || !floorNumber || !rackNumber) return;

    const input: CreateUnloadingInput = {
      organizationId,
      unloadingNo,
      date,
      amadId: selectedAmad.id,
      amadNo: selectedAmad.amadNo,
      partyId: selectedAmad.partyId || undefined,
      partyName: selectedAmad.partyName,
      commodityName: selectedAmad.commodityName || undefined,
      chamberId,
      chamberName,
      floorNumber,
      rackNumber,
      pkt1: parseInt(pkt1, 10) || 0,
      pkt2: parseInt(pkt2, 10) || 0,
      pkt3: parseInt(pkt3, 10) || 0,
      totalQuantity,
      vehicleNo: vehicleNo || undefined,
      remarks: remarks || undefined,
      isActive: true,
    };

    createMutation.mutate(input, {
      onSuccess: () => {
        handleOpenChange(false);
      },
    });
  }

  const isValid = selectedAmad && chamberId && floorNumber && rackNumber && totalQuantity > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="unloading-form-dialog">
        <DialogHeader>
          <DialogTitle>Unload Goods from Rack</DialogTitle>
          <DialogDescription>
            Remove goods from a rack for dispatch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unloadingNo">Unloading #</Label>
              <Input id="unloadingNo" value={unloadingNo} disabled data-testid="unloading-form-unloading-no-input" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="unloading-form-date-input"
              />
            </div>
          </div>

          <Separator />

          <AmadSelector
            organizationId={organizationId}
            selectedAmadId={selectedAmad?.id}
            onSelect={setSelectedAmad}
            filterStatus={["IN_STOCK", "PARTIAL_DISPATCH"]}
          />

          <Separator />

          <LocationPicker
            organizationId={organizationId}
            selectedChamberId={chamberId}
            selectedFloorNumber={floorNumber}
            selectedRackNumber={rackNumber}
            onChamberChange={(id, chamber) => {
              setChamberId(id);
              setChamberName(chamber?.name);
              setFloorNumber(undefined);
              setRackNumber(undefined);
            }}
            onFloorChange={(num) => {
              setFloorNumber(num);
              setRackNumber(undefined);
            }}
            onRackChange={setRackNumber}
          />

          <Separator />

          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pkt1">PKT1</Label>
              <Input
                id="pkt1"
                type="number"
                min="0"
                value={pkt1}
                onChange={(e) => setPkt1(e.target.value)}
                data-testid="unloading-form-pkt1-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pkt2">PKT2</Label>
              <Input
                id="pkt2"
                type="number"
                min="0"
                value={pkt2}
                onChange={(e) => setPkt2(e.target.value)}
                data-testid="unloading-form-pkt2-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pkt3">PKT3</Label>
              <Input
                id="pkt3"
                type="number"
                min="0"
                value={pkt3}
                onChange={(e) => setPkt3(e.target.value)}
                data-testid="unloading-form-pkt3-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Total</Label>
              <div className="h-10 flex items-center font-medium" data-testid="unloading-form-total-quantity">
                {totalQuantity} bags
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicleNo">Vehicle Number</Label>
            <Input
              id="vehicleNo"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              placeholder="e.g., UP32AB1234"
              data-testid="unloading-form-vehicle-no-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              data-testid="unloading-form-remarks-input"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} data-testid="unloading-form-cancel-button">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || createMutation.isPending} data-testid="unloading-form-submit-button">
              {createMutation.isPending ? "Saving..." : "Unload Goods"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
