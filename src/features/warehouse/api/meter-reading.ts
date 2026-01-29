import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { MeterReading, CreateMeterReadingInput, UpdateMeterReadingInput } from "../types";

const client = generateClient<Schema>();

export async function fetchMeterReadings(organizationId: string): Promise<MeterReading[]> {
  const { data, errors } = await client.models.MeterReading.listMeterReadingByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as MeterReading[];
}

export async function fetchMeterReadingsByChamberId(chamberId: string): Promise<MeterReading[]> {
  const { data, errors } = await client.models.MeterReading.listMeterReadingByChamberId({
    chamberId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as MeterReading[];
}

export async function fetchMeterReading(id: string): Promise<MeterReading | null> {
  const { data, errors } = await client.models.MeterReading.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as MeterReading | null;
}

export async function createMeterReading(input: CreateMeterReadingInput): Promise<MeterReading> {
  const { data, errors } = await client.models.MeterReading.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create meter reading");
  }

  return data as unknown as MeterReading;
}

export async function updateMeterReading(input: UpdateMeterReadingInput): Promise<MeterReading> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.MeterReading.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update meter reading");
  }

  return data as unknown as MeterReading;
}

export async function deleteMeterReading(id: string): Promise<void> {
  const { errors } = await client.models.MeterReading.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getLatestMeterReading(
  organizationId: string,
  chamberId?: string
): Promise<MeterReading | null> {
  let readings: MeterReading[];

  if (chamberId) {
    readings = await fetchMeterReadingsByChamberId(chamberId);
  } else {
    readings = await fetchMeterReadings(organizationId);
  }

  if (readings.length === 0) return null;

  return readings.sort((a, b) => {
    const dateCompare = b.readingDate.localeCompare(a.readingDate);
    if (dateCompare !== 0) return dateCompare;
    if (a.readingTime && b.readingTime) {
      return b.readingTime.localeCompare(a.readingTime);
    }
    return 0;
  })[0];
}

export async function calculateConsumption(
  organizationId: string,
  startDate: string,
  endDate: string,
  chamberId?: string
): Promise<number> {
  let readings: MeterReading[];

  if (chamberId) {
    readings = await fetchMeterReadingsByChamberId(chamberId);
  } else {
    readings = await fetchMeterReadings(organizationId);
  }

  const filteredReadings = readings.filter(
    (r) => r.readingDate >= startDate && r.readingDate <= endDate
  );

  return filteredReadings.reduce((sum, r) => sum + (r.consumption || 0), 0);
}
