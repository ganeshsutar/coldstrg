import { useMemo } from "react";
import { RackCell } from "./rack-cell";
import type { RackOccupancy, ChamberFloor } from "../../types";

interface FloorGridProps {
  floor: ChamberFloor;
  occupancies: RackOccupancy[];
  selectedRack?: RackOccupancy | null;
  onRackClick?: (rack: RackOccupancy) => void;
  onRackHover?: (rack: RackOccupancy | null) => void;
}

export function FloorGrid({
  floor,
  occupancies,
  selectedRack,
  onRackClick,
  onRackHover,
}: FloorGridProps) {
  const { rows } = useMemo(() => {
    const floorOccupancies = occupancies.filter(
      (o) => o.floorNumber === floor.floorNumber
    );
    const racksPerRow = floor.racksPerRow || 10;
    const totalRacks = floor.toRack - floor.fromRack + 1;
    const numRows = Math.ceil(totalRacks / racksPerRow);

    const rows: RackOccupancy[][] = [];
    for (let row = 0; row < numRows; row++) {
      const rowRacks: RackOccupancy[] = [];
      for (let col = 0; col < racksPerRow; col++) {
        const rackNumber = floor.fromRack + row * racksPerRow + col;
        if (rackNumber > floor.toRack) break;

        const occ = floorOccupancies.find((o) => o.rackNumber === rackNumber);
        if (occ) {
          rowRacks.push(occ);
        } else {
          rowRacks.push({
            chamberId: floor.chamberId,
            floorNumber: floor.floorNumber,
            rackNumber,
            status: "EMPTY",
            totalQuantity: 0,
          });
        }
      }
      rows.push(rowRacks);
    }

    return { rows, racksPerRow };
  }, [floor, occupancies]);

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-3 font-medium text-sm">
        {floor.floorName || `Floor ${floor.floorNumber}`}
        <span className="text-muted-foreground ml-2">
          (Racks {floor.fromRack} - {floor.toRack})
        </span>
      </div>
      <div className="space-y-1">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((rack) => (
              <RackCell
                key={rack.rackNumber}
                rack={rack}
                onClick={onRackClick}
                onHover={onRackHover}
                isSelected={
                  selectedRack?.rackNumber === rack.rackNumber &&
                  selectedRack?.floorNumber === rack.floorNumber
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
