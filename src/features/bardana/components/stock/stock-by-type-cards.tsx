import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { BardanaType, BardanaStock } from "../../types";
import {
  formatCurrency,
  formatNumber,
  calculateStockAvailability,
} from "../../utils/calculations";

interface StockByTypeCardsProps {
  bardanaTypes: BardanaType[];
  stockRecords: BardanaStock[];
  onIssue?: (typeId: string) => void;
}

export function StockByTypeCards({
  bardanaTypes,
  stockRecords,
  onIssue,
}: StockByTypeCardsProps) {
  // Calculate totals per type from stock records
  function getTypeStats(typeId: string) {
    const typeRecords = stockRecords.filter((s) => s.bardanaTypeId === typeId);
    const totalIssued = typeRecords.reduce((sum, s) => sum + s.totalIssued, 0);
    const totalReturned = typeRecords.reduce(
      (sum, s) => sum + s.totalReturned,
      0
    );
    return { totalIssued, totalReturned };
  }

  if (bardanaTypes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No bardana types configured. Add types from the Types page.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {bardanaTypes.map((type) => {
        const stats = getTypeStats(type.id);
        const availability = calculateStockAvailability(
          type.currentStock ?? 0,
          stats.totalIssued - stats.totalReturned
        );

        return (
          <Card key={type.id} className="@container/card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {type.name}
                {type.nameHindi && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({type.nameHindi})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Stock</span>
                <span className="font-medium">
                  {formatNumber(type.currentStock ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>{formatCurrency(type.defaultRate ?? 0)}</span>
              </div>

              <div className="space-y-1.5">
                <Progress value={availability} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{availability}% available</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="text-muted-foreground">Issued</div>
                  <div className="font-medium">{formatNumber(stats.totalIssued)}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-muted-foreground">Returned</div>
                  <div className="font-medium">{formatNumber(stats.totalReturned)}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onIssue?.(type.id)}
              >
                Issue
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
