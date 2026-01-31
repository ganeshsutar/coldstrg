import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CHAMBER_CONFIG } from "@/config/constants";
import type { Chamber, CreateChamberInput } from "../../types";

interface ChamberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chamber?: Chamber | null;
  nextCode: string;
  nextRoomNumber: number;
  organizationId: string;
  onSave: (input: CreateChamberInput & { id?: string }) => void;
  isPending: boolean;
}

export function ChamberDialog({
  open,
  onOpenChange,
  chamber,
  nextCode,
  nextRoomNumber,
  organizationId,
  onSave,
  isPending,
}: ChamberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="chamber-form-dialog">
        {open && (
          <ChamberForm
            chamber={chamber}
            nextCode={nextCode}
            nextRoomNumber={nextRoomNumber}
            organizationId={organizationId}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ChamberFormProps {
  chamber?: Chamber | null;
  nextCode: string;
  nextRoomNumber: number;
  organizationId: string;
  onSave: (input: CreateChamberInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function ChamberForm({
  chamber,
  nextCode,
  nextRoomNumber,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: ChamberFormProps) {
  const isEdit = !!chamber;

  const [code, setCode] = useState(chamber?.code ?? nextCode);
  const [roomNumber, setRoomNumber] = useState(
    chamber?.roomNumber?.toString() ?? nextRoomNumber.toString()
  );
  const [name, setName] = useState(chamber?.name ?? "");
  const [nameHindi, setNameHindi] = useState(chamber?.nameHindi ?? "");
  const [floors, setFloors] = useState(
    chamber?.floors?.toString() ?? DEFAULT_CHAMBER_CONFIG.floors.toString()
  );
  const [totalRacks, setTotalRacks] = useState(
    chamber?.totalRacks?.toString() ?? DEFAULT_CHAMBER_CONFIG.totalRacks.toString()
  );
  const [racksPerRow, setRacksPerRow] = useState(
    chamber?.racksPerRow?.toString() ?? DEFAULT_CHAMBER_CONFIG.racksPerRow.toString()
  );
  const [rackCapacity, setRackCapacity] = useState(
    chamber?.rackCapacity?.toString() ?? DEFAULT_CHAMBER_CONFIG.rackCapacity.toString()
  );
  const [targetTemperature, setTargetTemperature] = useState(
    chamber?.targetTemperature?.toString() ?? DEFAULT_CHAMBER_CONFIG.targetTemperature.toString()
  );
  const [minTemperature, setMinTemperature] = useState(
    chamber?.minTemperature?.toString() ?? DEFAULT_CHAMBER_CONFIG.minTemperature.toString()
  );
  const [maxTemperature, setMaxTemperature] = useState(
    chamber?.maxTemperature?.toString() ?? DEFAULT_CHAMBER_CONFIG.maxTemperature.toString()
  );
  const [description, setDescription] = useState(chamber?.description ?? "");
  const [isActive, setIsActive] = useState(chamber?.isActive !== false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateChamberInput & { id?: string } = {
      organizationId,
      code,
      roomNumber: parseInt(roomNumber, 10),
      name,
      isActive,
      ...(isEdit && { id: chamber!.id }),
      ...(nameHindi && { nameHindi }),
      floors: parseInt(floors, 10) || 1,
      totalRacks: parseInt(totalRacks, 10) || 0,
      racksPerRow: parseInt(racksPerRow, 10) || 10,
      rackCapacity: parseInt(rackCapacity, 10) || 100,
      targetTemperature: parseFloat(targetTemperature) || -18,
      minTemperature: parseFloat(minTemperature) || -25,
      maxTemperature: parseFloat(maxTemperature) || -15,
      ...(description && { description }),
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Chamber" : "Add Chamber"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the chamber details below."
            : "Fill in the details to add a new chamber/room."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isEdit}
              data-testid="chamber-form-code-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              type="number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
              data-testid="chamber-form-room-number-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="isActive">Status</Label>
            <Select
              value={isActive ? "active" : "inactive"}
              onValueChange={(v) => setIsActive(v === "active")}
            >
              <SelectTrigger className="w-full" data-testid="chamber-form-status-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name (English)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="chamber-form-name-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameHindi">Name (Hindi)</Label>
            <Input
              id="nameHindi"
              value={nameHindi}
              onChange={(e) => setNameHindi(e.target.value)}
              data-testid="chamber-form-name-hindi-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="floors">Floors</Label>
            <Input
              id="floors"
              type="number"
              min="1"
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
              data-testid="chamber-form-floors-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="totalRacks">Total Racks</Label>
            <Input
              id="totalRacks"
              type="number"
              min="0"
              value={totalRacks}
              onChange={(e) => setTotalRacks(e.target.value)}
              data-testid="chamber-form-total-racks-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="racksPerRow">Racks/Row</Label>
            <Input
              id="racksPerRow"
              type="number"
              min="1"
              value={racksPerRow}
              onChange={(e) => setRacksPerRow(e.target.value)}
              data-testid="chamber-form-racks-per-row-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rackCapacity">Rack Capacity</Label>
            <Input
              id="rackCapacity"
              type="number"
              min="1"
              value={rackCapacity}
              onChange={(e) => setRackCapacity(e.target.value)}
              data-testid="chamber-form-rack-capacity-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="targetTemperature">Target Temp (°C)</Label>
            <Input
              id="targetTemperature"
              type="number"
              step="0.1"
              value={targetTemperature}
              onChange={(e) => setTargetTemperature(e.target.value)}
              data-testid="chamber-form-target-temp-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="minTemperature">Min Temp (°C)</Label>
            <Input
              id="minTemperature"
              type="number"
              step="0.1"
              value={minTemperature}
              onChange={(e) => setMinTemperature(e.target.value)}
              data-testid="chamber-form-min-temp-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="maxTemperature">Max Temp (°C)</Label>
            <Input
              id="maxTemperature"
              type="number"
              step="0.1"
              value={maxTemperature}
              onChange={(e) => setMaxTemperature(e.target.value)}
              data-testid="chamber-form-max-temp-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            data-testid="chamber-form-description-input"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} data-testid="chamber-form-cancel-button">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !name || !code} data-testid="chamber-form-submit-button">
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
