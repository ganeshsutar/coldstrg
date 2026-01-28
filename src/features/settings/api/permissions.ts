import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { RolePermission, CreateRolePermissionInput, UpdateRolePermissionInput } from "../types";

const client = generateClient<Schema>();

export async function fetchRolePermissions(organizationId: string): Promise<RolePermission[]> {
  const { data, errors } =
    await client.models.RolePermission.listRolePermissionByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as RolePermission[];
}

export async function createRolePermission(input: CreateRolePermissionInput): Promise<RolePermission> {
  const { data, errors } = await client.models.RolePermission.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create role permission");
  }

  return data as unknown as RolePermission;
}

export async function updateRolePermission(input: UpdateRolePermissionInput): Promise<RolePermission> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.RolePermission.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update role permission");
  }

  return data as unknown as RolePermission;
}

export async function seedDefaultPermissions(organizationId: string): Promise<RolePermission[]> {
  const roles = ["ADMIN", "SUPERVISOR", "OPERATOR"] as const;
  const results: RolePermission[] = [];

  for (const role of roles) {
    const isAdmin = role === "ADMIN";
    const isSupervisor = role === "SUPERVISOR";

    const { data, errors } = await client.models.RolePermission.create({
      organizationId,
      role,
      // Basic permissions
      canAdd: isAdmin || isSupervisor,
      canModify: isAdmin || isSupervisor,
      canDelete: isAdmin,
      canPrint: true,
      canChangeSettings: isAdmin,
      // Module access
      accessInventory: true,
      accessAccounts: isAdmin || isSupervisor,
      accessBilling: isAdmin || isSupervisor,
      accessTrading: isAdmin || isSupervisor,
      accessBardana: isAdmin || isSupervisor,
      accessLoans: isAdmin,
      accessPayroll: isAdmin,
      accessReports: isAdmin || isSupervisor,
      accessSystem: isAdmin,
      // Special permissions
      canBackdateEntry: isAdmin,
      canApproveLoans: isAdmin,
      canYearEndClose: isAdmin,
      canManageUsers: isAdmin,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed permissions for ${role}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as RolePermission);
    }
  }

  return results;
}
