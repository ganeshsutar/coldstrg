import { useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Package, Warehouse } from "lucide-react";
import type { CollateralOption } from "../../types";
import { formatCurrency, formatNumber, calculateLimitUsage } from "../../utils";
import { Progress } from "@/components/ui/progress";

interface Amad {
  id: string;
  amadNo: number;
  date: string;
  partyName?: string | null;
  commodityName?: string | null;
  totalPackets: number;
  room?: string | null;
  status?: string | null;
}

interface CollateralSelectorProps {
  amads: Amad[];
  selectedAmadId: string | null;
  onSelect: (amadId: string | null) => void;
  loanLimitPerBag: number;
  existingLoans?: Map<string, number>; // amadId -> existing loan amount
}

export function CollateralSelector({
  amads,
  selectedAmadId,
  onSelect,
  loanLimitPerBag,
  existingLoans = new Map(),
}: CollateralSelectorProps) {
  const collateralOptions = useMemo((): CollateralOption[] => {
    return amads
      .filter((a) => a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH")
      .map((amad) => {
        const maxLoan = amad.totalPackets * loanLimitPerBag;
        const existingLoan = existingLoans.get(amad.id) ?? 0;
        const availableLoan = Math.max(0, maxLoan - existingLoan);

        return {
          amadId: amad.id,
          amadNo: amad.amadNo,
          date: amad.date,
          commodity: amad.commodityName ?? "Unknown",
          bags: amad.totalPackets,
          maxLoan,
          existingLoan,
          availableLoan,
        };
      })
      .filter((c) => c.availableLoan > 0); // Only show if has available loan capacity
  }, [amads, loanLimitPerBag, existingLoans]);

  const selectedOption = collateralOptions.find(
    (c) => c.amadId === selectedAmadId
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          Select Collateral (Amad)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {collateralOptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No eligible goods found for this party
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {collateralOptions.map((option) => {
              const isSelected = option.amadId === selectedAmadId;
              const usagePercent = calculateLimitUsage(
                option.existingLoan,
                option.maxLoan
              );

              return (
                <div
                  key={option.amadId}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    onSelect(isSelected ? null : option.amadId)
                  }
                >
                  <Checkbox checked={isSelected} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        Amad #{option.amadNo}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {option.commodity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>
                        {format(new Date(option.date), "dd/MM/yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {formatNumber(option.bags)} bags
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Loan: {formatCurrency(option.existingLoan)}</span>
                        <span>Max: {formatCurrency(option.maxLoan)}</span>
                      </div>
                      <Progress value={usagePercent} className="h-1" />
                      <div className="text-xs text-green-600">
                        Available: {formatCurrency(option.availableLoan)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Summary */}
        {selectedOption && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium">Selected Collateral</div>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-xs text-muted-foreground">Amad #</p>
                <p className="font-medium">{selectedOption.amadNo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bags</p>
                <p className="font-medium">{formatNumber(selectedOption.bags)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(selectedOption.availableLoan)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
