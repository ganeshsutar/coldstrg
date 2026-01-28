import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LABOR_RATE_TYPES } from "@/config/constants";
import type { LaborRate, LaborRateTypeValue } from "../../types";

interface LaborRateMatrixProps {
  laborRates: LaborRate[];
}

export function LaborRateMatrix({ laborRates }: LaborRateMatrixProps) {
  // Get latest rate for each type
  const currentRates = useMemo(() => {
    const rateMap = new Map<LaborRateTypeValue, LaborRate>();

    for (const rate of laborRates) {
      if (rate.isActive === false) continue;
      const existing = rateMap.get(rate.rateType);
      if (
        !existing ||
        new Date(rate.effectiveDate) > new Date(existing.effectiveDate)
      ) {
        rateMap.set(rate.rateType, rate);
      }
    }

    return rateMap;
  }, [laborRates]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LABOR_RATE_TYPES.map((type) => {
        const rate = currentRates.get(type.value as LaborRateTypeValue);
        return (
          <Card key={type.value}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {type.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rate ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {"\u20B9"}{rate.ratePKT1}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {rate.ratePKT2 != null && (
                      <span>PKT2: {"\u20B9"}{rate.ratePKT2}</span>
                    )}
                    {rate.ratePKT3 != null && (
                      <span>PKT3: {"\u20B9"}{rate.ratePKT3}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Since {new Date(rate.effectiveDate).toLocaleDateString("en-IN")}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Not set</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
