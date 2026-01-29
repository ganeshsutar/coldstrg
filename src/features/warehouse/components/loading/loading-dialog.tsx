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
import { LocationPicker } from "./location-picker";
import { AmadSelector } from "./amad-selector";
import { useCreateLoading } from "../../hooks/use-loading";
import { getNextLoadingNo } from "../../api/loading";
import type { Chamber, RackOccupancy, CreateLoadingInput } from "../../types";
import type { Amad } from "@/features/inventory/types";

interface LoadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  preselectedRack?: RackOccupancy;
  preselectedChamber?: Chamber;
}

export function LoadingDialog({
  open,
  onOpenChange,
  organizationId,
  preselectedRack,
  preselectedChamber,
}: LoadingDialogProps) {
  const createMutation = useCreateLoading();

  const [loadingNo, setLoadingNo] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedAmad, setSelectedAmad] = useState<Amad | null>(null);
  const [chamberId, setChamberId] = useState<string | undefined>(preselectedChamber?.id);
  const [chamberName, setChamberName] = useState<string | undefined>(preselectedChamber?.name);
  const [floorNumber, setFloorNumber] = useState<number | undefined>(preselectedRack?.floorNumber);
  const [rackNumber, setRackNumber] = useState<number | undefined>(preselectedRack?.rackNumber);
  const [pkt1, setPkt1] = useState("");
  const [pkt2, setPkt2] = useState("");
  const [pkt3, setPkt3] = useState("");
  const [remarks, setRemarks] = useState("");

  // Fetch loading number when dialog opens
  useEffect(() => {
    if (open) {
      getNextLoadingNo(organizationId).then(setLoadingNo);
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
      setRemarks("");
    }
    onOpenChange(newOpen);
  }, [onOpenChange, preselectedChamber, preselectedRack]);

  const totalQuantity =
    (parseInt(pkt1, 10) || 0) + (parseInt(pkt2, 10) || 0) + (parseInt(pkt3, 10) || 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAmad || !chamberId || !floorNumber || !rackNumber) return;

    const input: CreateLoadingInput = {
      organizationId,
      loadingNo,
      date,
      amadId: selectedAmad.id,
      amadNo: selectedAmad.amadNo,
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
      remarks: remarks || undefined,
      rackStatus: totalQuantity >= 100 ? "FULL" : totalQuantity > 0 ? "PARTIAL" : "EMPTY",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Goods into Rack</DialogTitle>
          <DialogDescription>
            Place goods from an Amad into a specific rack location.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loadingNo">Loading #</Label>
              <Input id="loadingNo" value={loadingNo} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <AmadSelector
            organizationId={organizationId}
            selectedAmadId={selectedAmad?.id}
            onSelect={setSelectedAmad}
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
            <div className="space-y-2">
              <Label htmlFor="pkt1">PKT1</Label>
              <Input
                id="pkt1"
                type="number"
                min="0"
                value={pkt1}
                onChange={(e) => setPkt1(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkt2">PKT2</Label>
              <Input
                id="pkt2"
                type="number"
                min="0"
                value={pkt2}
                onChange={(e) => setPkt2(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkt3">PKT3</Label>
              <Input
                id="pkt3"
                type="number"
                min="0"
                value={pkt3}
                onChange={(e) => setPkt3(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <div className="h-10 flex items-center font-medium">
                {totalQuantity} bags
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Load Goods"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
