import { useState, useMemo } from "react";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRentList } from "@/features/inventory/hooks/use-rent";
import type { Rent } from "@/features/inventory/types";

interface RentSelectorProps {
  organizationId: string;
  selectedRentId?: string;
  onSelect: (rent: Rent) => void;
  disabled?: boolean;
}

export function RentSelector({
  organizationId,
  selectedRentId,
  onSelect,
  disabled,
}: RentSelectorProps) {
  const { data: allRents = [] } = useRentList(organizationId);
  const [search, setSearch] = useState("");

  const filteredRents = useMemo(() => {
    let rents = allRents.filter((r) => r.isActive !== false);

    if (search) {
      const lower = search.toLowerCase();
      rents = rents.filter(
        (r) =>
          r.serialNo.toString().includes(lower) ||
          r.partyName.toLowerCase().includes(lower) ||
          r.amadNo?.toString().includes(lower)
      );
    }

    return rents.slice(0, 20);
  }, [allRents, search]);

  const selectedRent = allRents.find((r) => r.id === selectedRentId);

  return (
    <div className="space-y-3">
      <Label>Select Dispatch (Rent/Nikasi)</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by serial #, party name, or Amad #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          disabled={disabled}
        />
      </div>

      {selectedRent && (
        <div className="p-3 border rounded-lg bg-primary/5 border-primary">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Dispatch #{selectedRent.serialNo}</div>
              <div className="text-sm text-muted-foreground">
                {selectedRent.partyName}
              </div>
              <div className="text-sm text-muted-foreground">
                Amad #{selectedRent.amadNo} - {selectedRent.totalPackets} pkts
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
        {filteredRents.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No dispatches found
          </div>
        ) : (
          filteredRents.map((rent) => (
            <button
              key={rent.id}
              type="button"
              onClick={() => onSelect(rent)}
              disabled={disabled}
              className={cn(
                "w-full p-3 text-left hover:bg-muted transition-colors",
                selectedRentId === rent.id && "bg-primary/10"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Dispatch #{rent.serialNo}</div>
                  <div className="text-sm text-muted-foreground">
                    {rent.partyName}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>Amad #{rent.amadNo}</div>
                  <div className="text-muted-foreground">
                    {rent.totalPackets} pkts
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
