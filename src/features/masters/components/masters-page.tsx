import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/features/organizations";
import { CommoditiesTab } from "./commodities/commodities-tab";
import { VillagesTab } from "./villages/villages-tab";
import { BanksTab } from "./banks/banks-tab";
import { GstRatesTab } from "./gst-rates/gst-rates-tab";
import { LaborRatesTab } from "./labor-rates/labor-rates-tab";

interface MastersTab {
  id: string;
  label: string;
}

const MASTERS_TABS: MastersTab[] = [
  { id: "commodities", label: "Commodities" },
  { id: "villages", label: "Villages" },
  { id: "banks", label: "Banks" },
  { id: "gst-rates", label: "GST Rates" },
  { id: "labor-rates", label: "Labor Rates" },
];

export function MastersPage() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;
  const [activeTab, setActiveTab] = useState("commodities");

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
        <h1 className="text-2xl font-semibold tracking-tight">Masters</h1>
        <p className="text-sm text-muted-foreground">
          Manage commodities, villages, banks, GST rates, and labor rates.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left sidebar with tabs */}
        <nav className="flex flex-row gap-1 md:flex-col md:w-48 md:shrink-0">
          {MASTERS_TABS.map((tab) => (
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
          {activeTab === "commodities" && (
            <CommoditiesTab organizationId={orgId} />
          )}
          {activeTab === "villages" && (
            <VillagesTab organizationId={orgId} />
          )}
          {activeTab === "banks" && (
            <BanksTab organizationId={orgId} />
          )}
          {activeTab === "gst-rates" && (
            <GstRatesTab organizationId={orgId} />
          )}
          {activeTab === "labor-rates" && (
            <LaborRatesTab organizationId={orgId} />
          )}
        </div>
      </div>
    </div>
  );
}
