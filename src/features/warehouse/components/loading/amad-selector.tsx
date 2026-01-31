import { useState, useMemo } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAmadList } from "@/features/inventory/hooks/use-amad";
import type { Amad } from "@/features/inventory/types";

interface AmadSelectorProps {
  organizationId: string;
  selectedAmadId?: string;
  onSelect: (amad: Amad) => void;
  filterStatus?: string[];
  disabled?: boolean;
}

export function AmadSelector({
  organizationId,
  selectedAmadId,
  onSelect,
  filterStatus = ["IN_STOCK", "PARTIAL_DISPATCH"],
  disabled,
}: AmadSelectorProps) {
  const { data: allAmads = [] } = useAmadList(organizationId);
  const [search, setSearch] = useState("");

  const filteredAmads = useMemo(() => {
    let amads = allAmads.filter(
      (a) => a.isActive !== false && filterStatus.includes(a.status || "")
    );

    if (search) {
      const lower = search.toLowerCase();
      amads = amads.filter(
        (a) =>
          a.amadNo.toString().includes(lower) ||
          a.partyName.toLowerCase().includes(lower) ||
          a.commodityName?.toLowerCase().includes(lower)
      );
    }

    return amads.slice(0, 20); // Limit to 20 results
  }, [allAmads, search, filterStatus]);

  const selectedAmad = allAmads.find((a) => a.id === selectedAmadId);

  return (
    <div className="space-y-3" data-testid="amad-selector">
      <Label>Select Amad</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Amad #, party name, or commodity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          disabled={disabled}
          data-testid="amad-selector-search-input"
        />
      </div>

      {selectedAmad && (
        <div className="p-3 border rounded-lg bg-primary/5 border-primary" data-testid="amad-selector-selected">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Amad #{selectedAmad.amadNo}</div>
              <div className="text-sm text-muted-foreground">
                {selectedAmad.partyName}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedAmad.commodityName} - {selectedAmad.totalPackets} pkts
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-h-48 overflow-y-auto border rounded-lg divide-y" data-testid="amad-selector-list">
        {filteredAmads.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No amads found
          </div>
        ) : (
          filteredAmads.map((amad) => (
            <button
              key={amad.id}
              type="button"
              onClick={() => onSelect(amad)}
              disabled={disabled}
              className={cn(
                "w-full p-3 text-left hover:bg-muted transition-colors",
                selectedAmadId === amad.id && "bg-primary/10"
              )}
              data-testid={`amad-selector-item-${amad.id}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Amad #{amad.amadNo}</div>
                  <div className="text-sm text-muted-foreground">
                    {amad.partyName}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>{amad.commodityName}</div>
                  <div className="text-muted-foreground">
                    {amad.totalPackets} pkts
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
