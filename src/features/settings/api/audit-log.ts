import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { AuditLogEntry, CreateAuditLogInput } from "../types";

const client = generateClient<Schema>();

export async function fetchAuditLogs(organizationId: string): Promise<AuditLogEntry[]> {
  const { data, errors } =
    await client.models.AuditLog.listAuditLogByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as AuditLogEntry[];
}

export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLogEntry> {
  const { data, errors } = await client.models.AuditLog.create({
    ...input,
    isActive: true,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create audit log");
  }

  return data as unknown as AuditLogEntry;
}
