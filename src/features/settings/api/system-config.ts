import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { SystemConfig, UpdateSystemConfigInput } from "../types";
import { DEFAULT_SYSTEM_CONFIG } from "@/config/constants";

const client = generateClient<Schema>();

export async function fetchSystemConfig(organizationId: string): Promise<SystemConfig | null> {
  const { data, errors } =
    await client.models.SystemConfig.listSystemConfigByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const configs = (data || []) as unknown as SystemConfig[];
  return configs.length > 0 ? configs[0] : null;
}

export async function createSystemConfig(organizationId: string): Promise<SystemConfig> {
  const { data, errors } = await client.models.SystemConfig.create({
    organizationId,
    ...DEFAULT_SYSTEM_CONFIG,
    isActive: true,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create system config");
  }

  return data as unknown as SystemConfig;
}

export async function updateSystemConfig(input: UpdateSystemConfigInput): Promise<SystemConfig> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.SystemConfig.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update system config");
  }

  return data as unknown as SystemConfig;
}

export type ProgressCallback = (completed: number, currentItem: string, skipped?: number) => void;

export async function createSystemConfigWithProgress(
  organizationId: string,
  onProgress?: ProgressCallback
): Promise<{ config: SystemConfig; skipped: number }> {
  onProgress?.(0, "Checking existing configuration...");

  // Check if config already exists
  const existing = await fetchSystemConfig(organizationId);
  if (existing) {
    onProgress?.(1, "System Configuration (already exists)", 1);
    return { config: existing, skipped: 1 };
  }

  onProgress?.(0, "System Configuration");

  const { data, errors } = await client.models.SystemConfig.create({
    organizationId,
    ...DEFAULT_SYSTEM_CONFIG,
    isActive: true,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create system config");
  }

  onProgress?.(1, "System Configuration", 0);
  return { config: data as unknown as SystemConfig, skipped: 0 };
}
