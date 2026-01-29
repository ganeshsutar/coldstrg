import type { RackOccupancy, ChamberFloor, RackStatusValue } from "../types";

export function calculateRackPosition(
  rackNumber: number,
  racksPerRow: number
): { row: number; col: number } {
  const row = Math.ceil(rackNumber / racksPerRow);
  const col = ((rackNumber - 1) % racksPerRow) + 1;
  return { row, col };
}

export function getRackNumberFromPosition(
  row: number,
  col: number,
  racksPerRow: number
): number {
  return (row - 1) * racksPerRow + col;
}

export function getFloorForRack(
  rackNumber: number,
  floors: ChamberFloor[]
): ChamberFloor | undefined {
  return floors.find(
    (floor) =>
      floor.isActive !== false &&
      rackNumber >= floor.fromRack &&
      rackNumber <= floor.toRack
  );
}

export function getRacksInFloor(floor: ChamberFloor): number[] {
  const racks: number[] = [];
  for (let i = floor.fromRack; i <= floor.toRack; i++) {
    racks.push(i);
  }
  return racks;
}

export function getRowsInFloor(floor: ChamberFloor): number {
  const totalRacks = floor.toRack - floor.fromRack + 1;
  const racksPerRow = floor.racksPerRow || 10;
  return Math.ceil(totalRacks / racksPerRow);
}

export function getRackStatus(
  quantity: number,
  capacity: number = 100
): RackStatusValue {
  if (quantity <= 0) return "EMPTY";
  if (quantity >= capacity) return "FULL";
  return "PARTIAL";
}

export function getOccupancyPercentage(
  occupiedRacks: number,
  totalRacks: number
): number {
  if (totalRacks === 0) return 0;
  return Math.round((occupiedRacks / totalRacks) * 100);
}

export function groupRacksByFloor(
  occupancies: RackOccupancy[]
): Map<number, RackOccupancy[]> {
  const grouped = new Map<number, RackOccupancy[]>();
  for (const occ of occupancies) {
    const existing = grouped.get(occ.floorNumber) || [];
    existing.push(occ);
    grouped.set(occ.floorNumber, existing);
  }
  return grouped;
}

export function findAvailableRacks(
  occupancies: RackOccupancy[],
  requiredQuantity: number,
  rackCapacity: number = 100
): RackOccupancy[] {
  return occupancies.filter((occ) => {
    if (occ.status === "MAINTENANCE" || occ.status === "RESERVED") return false;
    const availableSpace = rackCapacity - occ.totalQuantity;
    return availableSpace >= requiredQuantity;
  });
}

export function findEmptyRacks(occupancies: RackOccupancy[]): RackOccupancy[] {
  return occupancies.filter((occ) => occ.status === "EMPTY");
}

export function calculateTotalCapacity(
  floors: ChamberFloor[],
  rackCapacity: number = 100
): number {
  let totalRacks = 0;
  for (const floor of floors) {
    if (floor.isActive !== false) {
      totalRacks += floor.toRack - floor.fromRack + 1;
    }
  }
  return totalRacks * rackCapacity;
}

export function calculateUsedCapacity(occupancies: RackOccupancy[]): number {
  return occupancies.reduce((sum, occ) => sum + occ.totalQuantity, 0);
}

export function formatRackLocation(
  floorNumber: number,
  rackNumber: number
): string {
  return `F${floorNumber}-R${rackNumber}`;
}

export function parseRackLocation(location: string): {
  floorNumber: number;
  rackNumber: number;
} | null {
  const match = location.match(/F(\d+)-R(\d+)/);
  if (!match) return null;
  return {
    floorNumber: parseInt(match[1], 10),
    rackNumber: parseInt(match[2], 10),
  };
}
