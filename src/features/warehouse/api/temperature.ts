import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { TemperatureLog, CreateTemperatureLogInput, UpdateTemperatureLogInput } from "../types";

const client = generateClient<Schema>();

export async function fetchTemperatureLogs(organizationId: string): Promise<TemperatureLog[]> {
  const { data, errors } = await client.models.TemperatureLog.listTemperatureLogByOrganizationId({
    organizationId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as TemperatureLog[];
}

export async function fetchTemperatureLogsByChamberId(chamberId: string): Promise<TemperatureLog[]> {
  const { data, errors } = await client.models.TemperatureLog.listTemperatureLogByChamberId({
    chamberId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as TemperatureLog[];
}

export async function fetchTemperatureLog(id: string): Promise<TemperatureLog | null> {
  const { data, errors } = await client.models.TemperatureLog.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return data as unknown as TemperatureLog | null;
}

export async function createTemperatureLog(input: CreateTemperatureLogInput): Promise<TemperatureLog> {
  const { data, errors } = await client.models.TemperatureLog.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create temperature log");
  }

  return data as unknown as TemperatureLog;
}

export async function updateTemperatureLog(input: UpdateTemperatureLogInput): Promise<TemperatureLog> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.TemperatureLog.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update temperature log");
  }

  return data as unknown as TemperatureLog;
}

export async function deleteTemperatureLog(id: string): Promise<void> {
  const { errors } = await client.models.TemperatureLog.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function fetchRecentTemperatureLogs(
  organizationId: string,
  days: number = 7
): Promise<TemperatureLog[]> {
  const logs = await fetchTemperatureLogs(organizationId);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];

  return logs
    .filter((log) => log.date >= cutoffStr)
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
}

export async function getLatestTemperatureByChamberId(
  chamberId: string
): Promise<TemperatureLog | null> {
  const logs = await fetchTemperatureLogsByChamberId(chamberId);
  if (logs.length === 0) return null;

  return logs.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  })[0];
}
