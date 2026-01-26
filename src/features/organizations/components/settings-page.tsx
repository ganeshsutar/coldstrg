import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOrganization } from "../hooks/use-organization";
import { GeneralSettingsForm } from "./general-settings-form";
import type { Organization } from "../types";

interface SettingsTab {
  id: string;
  label: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  { id: "general", label: "Organization" },
];

export function SettingsPage() {
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState("general");

  function handleOrganizationUpdate(updatedOrg: Organization) {
    setCurrentOrganization(updatedOrg);
  }

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">No organization found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences.
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
          {activeTab === "general" && (
            <GeneralSettingsForm
              organization={currentOrganization}
              onUpdate={handleOrganizationUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
