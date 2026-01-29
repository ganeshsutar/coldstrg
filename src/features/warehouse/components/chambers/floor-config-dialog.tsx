import { useState, useMemo, useCallback } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import type { Chamber, CreateChamberFloorInput } from "../../types";
import { useChamberFloorsByChamberId } from "../../hooks/use-chamber-floors";

interface FloorConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chamber: Chamber | null;
  organizationId: string;
  onSave: (floors: (CreateChamberFloorInput & { id?: string })[]) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

interface FloorFormData {
  id?: string;
  floorNumber: number;
  floorName: string;
  fromRack: number;
  toRack: number;
  racksPerRow: number;
}

export function FloorConfigDialog({
  open,
  onOpenChange,
  chamber,
  organizationId,
  onSave,
  onDelete,
  isPending,
}: FloorConfigDialogProps) {
  const { data: existingFloors = [] } = useChamberFloorsByChamberId(
    open ? chamber?.id : undefined
  );

  const [localChanges, setLocalChanges] = useState<FloorFormData[] | null>(null);

  const initialFloors = useMemo(() => {
    if (!chamber) return [];

    if (existingFloors.length > 0) {
      return existingFloors.map((f) => ({
        id: f.id,
        floorNumber: f.floorNumber,
        floorName: f.floorName || `Floor ${f.floorNumber}`,
        fromRack: f.fromRack,
        toRack: f.toRack,
        racksPerRow: f.racksPerRow || 10,
      }));
    }

    // Generate default floors based on chamber config
    const numFloors = chamber.floors || 1;
    const totalRacks = chamber.totalRacks || 100;
    const racksPerFloor = Math.ceil(totalRacks / numFloors);
    const defaultFloors: FloorFormData[] = [];

    for (let i = 1; i <= numFloors; i++) {
      const fromRack = (i - 1) * racksPerFloor + 1;
      const toRack = Math.min(i * racksPerFloor, totalRacks);
      defaultFloors.push({
        floorNumber: i,
        floorName: `Floor ${i}`,
        fromRack,
        toRack,
        racksPerRow: chamber.racksPerRow || 10,
      });
    }
    return defaultFloors;
  }, [chamber, existingFloors]);

  const floors = localChanges ?? initialFloors;

  const handleAddFloor = useCallback(() => {
    const maxFloor = floors.length > 0 ? Math.max(...floors.map((f) => f.floorNumber)) : 0;
    const lastFloor = floors[floors.length - 1];
    const fromRack = lastFloor ? lastFloor.toRack + 1 : 1;

    setLocalChanges([
      ...floors,
      {
        floorNumber: maxFloor + 1,
        floorName: `Floor ${maxFloor + 1}`,
        fromRack,
        toRack: fromRack + 9,
        racksPerRow: chamber?.racksPerRow || 10,
      },
    ]);
  }, [floors, chamber?.racksPerRow]);

  function handleRemoveFloor(index: number) {
    const floor = floors[index];
    if (floor.id) {
      onDelete(floor.id);
    }
    setLocalChanges(floors.filter((_, i) => i !== index));
  }

  function handleFloorChange(index: number, field: keyof FloorFormData, value: string | number) {
    const updated = [...floors];
    updated[index] = { ...updated[index], [field]: value };
    setLocalChanges(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chamber) return;

    const inputs = floors.map((f) => ({
      ...(f.id && { id: f.id }),
      organizationId,
      chamberId: chamber.id,
      floorNumber: f.floorNumber,
      floorName: f.floorName,
      fromRack: f.fromRack,
      toRack: f.toRack,
      racksPerRow: f.racksPerRow,
      isActive: true,
    }));

    onSave(inputs);
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setLocalChanges(null);
    }
    onOpenChange(newOpen);
  }

  if (!chamber) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Floors - {chamber.name}</DialogTitle>
          <DialogDescription>
            Define the rack ranges for each floor in this chamber.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {floors.map((floor, index) => (
              <div
                key={floor.id || `new-${index}`}
                className="grid grid-cols-6 gap-3 items-end p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <Label className="text-xs">Floor #</Label>
                  <Input
                    type="number"
                    min="1"
                    value={floor.floorNumber}
                    onChange={(e) =>
                      handleFloorChange(index, "floorNumber", parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={floor.floorName}
                    onChange={(e) => handleFloorChange(index, "floorName", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">From Rack</Label>
                  <Input
                    type="number"
                    min="1"
                    value={floor.fromRack}
                    onChange={(e) =>
                      handleFloorChange(index, "fromRack", parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Rack</Label>
                  <Input
                    type="number"
                    min="1"
                    value={floor.toRack}
                    onChange={(e) =>
                      handleFloorChange(index, "toRack", parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Racks/Row</Label>
                  <Input
                    type="number"
                    min="1"
                    value={floor.racksPerRow}
                    onChange={(e) =>
                      handleFloorChange(index, "racksPerRow", parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFloor(index)}
                    disabled={floors.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={handleAddFloor}>
            <Plus className="h-4 w-4 mr-1" />
            Add Floor
          </Button>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || floors.length === 0}>
              {isPending ? "Saving..." : "Save Floors"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
