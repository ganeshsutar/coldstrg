import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChambers } from "../../hooks/use-chambers";
import { useChamberFloorsByChamberId } from "../../hooks/use-chamber-floors";
import type { Chamber, ChamberFloor } from "../../types";

interface LocationPickerProps {
  organizationId: string;
  selectedChamberId?: string;
  selectedFloorNumber?: number;
  selectedRackNumber?: number;
  onChamberChange: (chamberId: string, chamber?: Chamber) => void;
  onFloorChange: (floorNumber: number, floor?: ChamberFloor) => void;
  onRackChange: (rackNumber: number) => void;
  disabled?: boolean;
}

export function LocationPicker({
  organizationId,
  selectedChamberId,
  selectedFloorNumber,
  selectedRackNumber,
  onChamberChange,
  onFloorChange,
  onRackChange,
  disabled,
}: LocationPickerProps) {
  const { data: chambers = [] } = useChambers(organizationId);
  const { data: floors = [] } = useChamberFloorsByChamberId(selectedChamberId);

  const selectedFloor = floors.find((f) => f.floorNumber === selectedFloorNumber);
  const rackOptions = selectedFloor
    ? Array.from(
        { length: selectedFloor.toRack - selectedFloor.fromRack + 1 },
        (_, i) => selectedFloor.fromRack + i
      )
    : [];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Chamber</Label>
        <Select
          value={selectedChamberId}
          onValueChange={(value) => {
            const chamber = chambers.find((c) => c.id === value);
            onChamberChange(value, chamber);
          }}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select chamber" />
          </SelectTrigger>
          <SelectContent>
            {chambers.map((chamber) => (
              <SelectItem key={chamber.id} value={chamber.id}>
                {chamber.name} (Room {chamber.roomNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Floor</Label>
        <Select
          value={selectedFloorNumber?.toString()}
          onValueChange={(value) => {
            const num = parseInt(value, 10);
            const floor = floors.find((f) => f.floorNumber === num);
            onFloorChange(num, floor);
          }}
          disabled={disabled || !selectedChamberId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select floor" />
          </SelectTrigger>
          <SelectContent>
            {floors
              .sort((a, b) => a.floorNumber - b.floorNumber)
              .map((floor) => (
                <SelectItem key={floor.id} value={floor.floorNumber.toString()}>
                  {floor.floorName || `Floor ${floor.floorNumber}`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Rack</Label>
        <Select
          value={selectedRackNumber?.toString()}
          onValueChange={(value) => onRackChange(parseInt(value, 10))}
          disabled={disabled || !selectedFloorNumber}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rack" />
          </SelectTrigger>
          <SelectContent>
            {rackOptions.map((rack) => (
              <SelectItem key={rack} value={rack.toString()}>
                Rack {rack}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
