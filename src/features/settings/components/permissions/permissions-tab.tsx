import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRolePermissions, useUpdateRolePermission } from "../../hooks/use-permissions";
import type { RolePermission, PermissionRow } from "../../types";

interface PermissionsTabProps {
  organizationId: string;
}

const ROLES = ["ADMIN", "SUPERVISOR", "OPERATOR"] as const;

const PERMISSION_ROWS: PermissionRow[] = [
  // Basic permissions
  { key: "canAdd", label: "Add Records", section: "basic" },
  { key: "canModify", label: "Modify Records", section: "basic" },
  { key: "canDelete", label: "Delete Records", section: "basic" },
  { key: "canPrint", label: "Print", section: "basic" },
  { key: "canChangeSettings", label: "Change Settings", section: "basic" },
  // Module access
  { key: "accessInventory", label: "Inventory", section: "module" },
  { key: "accessAccounts", label: "Accounts", section: "module" },
  { key: "accessBilling", label: "Billing", section: "module" },
  { key: "accessTrading", label: "Trading", section: "module" },
  { key: "accessBardana", label: "Bardana", section: "module" },
  { key: "accessLoans", label: "Loans", section: "module" },
  { key: "accessPayroll", label: "Payroll", section: "module" },
  { key: "accessReports", label: "Reports", section: "module" },
  { key: "accessSystem", label: "System", section: "module" },
  // Special permissions
  { key: "canBackdateEntry", label: "Backdate Entry", section: "special" },
  { key: "canApproveLoans", label: "Approve Loans", section: "special" },
  { key: "canYearEndClose", label: "Year-End Close", section: "special" },
  { key: "canManageUsers", label: "Manage Users", section: "special" },
];

const SECTION_LABELS: Record<string, string> = {
  basic: "Basic Permissions",
  module: "Module Access",
  special: "Special Permissions",
};

type PermissionState = Record<string, Record<string, boolean>>;

export function PermissionsTab({ organizationId }: PermissionsTabProps) {
  const { data: permissions = [], isLoading } = useRolePermissions(organizationId);
  const updateMutation = useUpdateRolePermission();

  const [localState, setLocalState] = useState<PermissionState>({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize local state from fetched data
  useEffect(() => {
    if (permissions.length > 0) {
      const state: PermissionState = {};
      for (const perm of permissions) {
        const roleState: Record<string, boolean> = {};
        for (const row of PERMISSION_ROWS) {
          roleState[row.key] = (perm as unknown as Record<string, boolean>)[row.key] ?? false;
        }
        state[perm.role] = roleState;
      }
      setLocalState(state);
      setIsDirty(false);
    }
  }, [permissions]);

  function handleToggle(role: string, key: string) {
    setLocalState((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role]?.[key],
      },
    }));
    setIsDirty(true);
    setSuccess(false);
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      for (const perm of permissions) {
        const roleState = localState[perm.role];
        if (!roleState) continue;

        await updateMutation.mutateAsync({
          id: perm.id,
          organizationId,
          role: perm.role,
          ...roleState,
        } as RolePermission & { id: string; organizationId: string; role: typeof perm.role });
      }
      setIsDirty(false);
      setSuccess(true);
    } catch {
      // Error handled by mutation
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading permissions...</div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Setting up permissions...</div>
      </div>
    );
  }

  let currentSection = "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Permissions</CardTitle>
        <CardDescription>
          Configure permissions for each role across your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <div className="text-sm text-green-600 bg-green-500/10 p-3 rounded-md">
            Permissions saved successfully.
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Permission</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role} className="text-center w-[120px]">
                    {role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_ROWS.map((row) => {
                const showHeader = row.section !== currentSection;
                currentSection = row.section;
                return (
                  <>
                    {showHeader && (
                      <TableRow key={`section-${row.section}`}>
                        <TableCell
                          colSpan={4}
                          className="bg-muted/50 font-semibold text-sm"
                        >
                          {SECTION_LABELS[row.section]}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow key={row.key}>
                      <TableCell className="text-sm">{row.label}</TableCell>
                      {ROLES.map((role) => (
                        <TableCell key={`${role}-${row.key}`} className="text-center">
                          <Checkbox
                            checked={localState[role]?.[row.key] ?? false}
                            onCheckedChange={() => handleToggle(role, row.key)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {isDirty && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
