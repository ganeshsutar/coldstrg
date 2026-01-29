import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { ChamberFloor, CreateChamberFloorInput, UpdateChamberFloorInput } from "../types";

const client = generateClient<Schema>();

export async function fetchChamberFloors(organizationId: string): Promise<ChamberFloor[]> {
  const { data, errors } = await client.models.ChamberFloor.listChamberFloorByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as ChamberFloor[];
}

export async function fetchChamberFloorsByChamberId(chamberId: string): Promise<ChamberFloor[]> {
  const { data, errors } = await client.models.ChamberFloor.listChamberFloorByChamberId({
    chamberId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as ChamberFloor[];
}

export async function fetchChamberFloor(id: string): Promise<ChamberFloor | null> {
  const { data, errors } = await client.models.ChamberFloor.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as ChamberFloor | null;
}

export async function createChamberFloor(input: CreateChamberFloorInput): Promise<ChamberFloor> {
  const { data, errors } = await client.models.ChamberFloor.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create chamber floor");
  }

  return data as unknown as ChamberFloor;
}

export async function updateChamberFloor(input: UpdateChamberFloorInput): Promise<ChamberFloor> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.ChamberFloor.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update chamber floor");
  }

  return data as unknown as ChamberFloor;
}

export async function deleteChamberFloor(id: string): Promise<void> {
  const { errors } = await client.models.ChamberFloor.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function createFloorsForChamber(
  organizationId: string,
  chamberId: string,
  totalFloors: number,
  totalRacks: number,
  racksPerRow: number
): Promise<ChamberFloor[]> {
  const racksPerFloor = Math.ceil(totalRacks / totalFloors);
  const results: ChamberFloor[] = [];

  for (let floor = 1; floor <= totalFloors; floor++) {
    const fromRack = (floor - 1) * racksPerFloor + 1;
    const toRack = Math.min(floor * racksPerFloor, totalRacks);

    const input: CreateChamberFloorInput = {
      organizationId,
      chamberId,
      floorNumber: floor,
      floorName: `Floor ${floor}`,
      fromRack,
      toRack,
      racksPerRow,
      isActive: true,
    };

    const created = await createChamberFloor(input);
    results.push(created);
  }

  return results;
}
