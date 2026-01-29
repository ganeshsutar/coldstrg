import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Send, AlertCircle, Undo2 } from "lucide-react";
import type { BardanaType, BardanaStock, BardanaIssueHeader, BardanaReceiptHeader } from "../../types";
import { formatCurrency, formatNumber } from "../../utils/calculations";

interface StockKpiCardsProps {
  bardanaTypes: BardanaType[];
  stockRecords: BardanaStock[];
  issues: BardanaIssueHeader[];
  receipts: BardanaReceiptHeader[];
}

export function StockKpiCards({
  bardanaTypes,
  stockRecords,
  issues,
  receipts,
}: StockKpiCardsProps) {
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    // Total stock across all types
    const totalStock = bardanaTypes.reduce(
      (sum, t) => sum + (t.currentStock ?? 0),
      0
    );

    // Count of types
    const typeCount = bardanaTypes.length;

    // Issued today
    const issuedToday = issues.filter((i) => i.issueDate === today);
    const issuedTodayQty = issuedToday.reduce(
      (sum, i) => sum + i.totalQuantity,
      0
    );
    const issuedTodayParties = new Set(issuedToday.map((i) => i.partyId)).size;

    // Outstanding (total balance from stock records)
    const outstandingQty = stockRecords.reduce(
      (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
      0
    );
    const outstandingValue = stockRecords.reduce(
      (sum, s) => sum + (s.balance > 0 ? s.totalValue : 0),
      0
    );

    // Returns pending (receipts in draft status)
    const returnsPending = receipts.filter((r) => r.status === "DRAFT");
    const returnsPendingQty = returnsPending.reduce(
      (sum, r) => sum + r.totalQuantity,
      0
    );
    const returnsPendingParties = new Set(
      returnsPending.map((r) => r.partyId)
    ).size;

    return {
      totalStock,
      typeCount,
      issuedTodayQty,
      issuedTodayParties,
      outstandingQty,
      outstandingValue,
      returnsPendingQty,
      returnsPendingParties,
    };
  }, [bardanaTypes, stockRecords, issues, receipts]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Total Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatNumber(metrics.totalStock)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{metrics.typeCount} types</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Issued Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatNumber(metrics.issuedTodayQty)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Send className="h-4 w-4" />
            <span>{metrics.issuedTodayParties} parties</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Outstanding</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatNumber(metrics.outstandingQty)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>{formatCurrency(metrics.outstandingValue)}</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Returns Pending</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatNumber(metrics.returnsPendingQty)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Undo2 className="h-4 w-4" />
            <span>{metrics.returnsPendingParties} parties</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
