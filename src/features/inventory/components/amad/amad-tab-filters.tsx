import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Amad, AmadFilterTab } from "../../types";

interface AmadTabFiltersProps {
  amadList: Amad[];
  activeTab: AmadFilterTab;
  onTabChange: (tab: AmadFilterTab) => void;
}

export function AmadTabFilters({
  amadList,
  activeTab,
  onTabChange,
}: AmadTabFiltersProps) {
  const counts = useMemo(() => {
    const all = amadList.length;
    const inStock = amadList.filter((a) => a.status === "IN_STOCK").length;
    const partial = amadList.filter(
      (a) => a.status === "PARTIAL_DISPATCH"
    ).length;
    const dispatched = amadList.filter(
      (a) => a.status === "DISPATCHED"
    ).length;
    const pending = amadList.filter((a) => a.status === "PENDING").length;
    return { all, inStock, partial, dispatched, pending };
  }, [amadList]);

  const tabs: { id: AmadFilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "in-stock", label: "In Stock", count: counts.inStock },
    { id: "partial", label: "Partial", count: counts.partial },
    { id: "dispatched", label: "Dispatched", count: counts.dispatched },
    { id: "pending", label: "Pending", count: counts.pending },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className="whitespace-nowrap"
        >
          {tab.label}
          <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
            {tab.count}
          </span>
        </Button>
      ))}
    </div>
  );
}
