import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/features/organizations";
import { CompanyInfoTab } from "./company-info/company-info-tab";
import { UsersTab } from "./users/users-tab";
import { PermissionsTab } from "./permissions/permissions-tab";
import { ConfigurationTab } from "./configuration/configuration-tab";
import { AuditLogTab } from "./audit-log/audit-log-tab";
import { SystemTab } from "./system/system-tab";

interface SettingsTab {
  id: string;
  label: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  { id: "company-info", label: "Company Info" },
  { id: "users", label: "Users" },
  { id: "permissions", label: "Permissions" },
  { id: "configuration", label: "Configuration" },
  { id: "audit-log", label: "Audit Log" },
  { id: "system", label: "System" },
];

export function SettingsPage() {
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;
  const [activeTab, setActiveTab] = useState("company-info");

  if (!orgId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No organization selected</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage organization settings, users, permissions, and system configuration.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left sidebar with tabs */}
        <nav className="flex flex-row gap-1 md:flex-col md:w-48 md:shrink-0">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md text-left transition-colors",
                "hover:bg-muted",
                activeTab === tab.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {activeTab === "company-info" && (
            <CompanyInfoTab
              organizationId={orgId}
              organization={currentOrganization}
              onUpdate={setCurrentOrganization}
            />
          )}
          {activeTab === "users" && (
            <UsersTab organizationId={orgId} />
          )}
          {activeTab === "permissions" && (
            <PermissionsTab organizationId={orgId} />
          )}
          {activeTab === "configuration" && (
            <ConfigurationTab organizationId={orgId} />
          )}
          {activeTab === "audit-log" && (
            <AuditLogTab organizationId={orgId} />
          )}
          {activeTab === "system" && (
            <SystemTab />
          )}
        </div>
      </div>
    </div>
  );
}
