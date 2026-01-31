import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type {
  BardanaIssueHeader,
  BardanaReceiptHeader,
  BardanaStatusValue,
  RecentBardanaTransaction,
} from "../../types";
import { formatCurrency, formatNumber } from "../../utils/calculations";

interface RecentTransactionsTableProps {
  issues: BardanaIssueHeader[];
  receipts: BardanaReceiptHeader[];
  onViewAll?: () => void;
  onNewIssue?: () => void;
}

function getStatusBadge(status: BardanaStatusValue) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        >
          Draft
        </Badge>
      );
    case "CONFIRMED":
      return <Badge variant="default">Confirmed</Badge>;
    case "CANCELLED":
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">-</Badge>;
  }
}

export function RecentTransactionsTable({
  issues,
  receipts,
  onViewAll,
  onNewIssue,
}: RecentTransactionsTableProps) {
  const recentTransactions = useMemo(() => {
    // Combine and sort by date, take last 10
    const issueTransactions: RecentBardanaTransaction[] = issues.map((i) => ({
      id: i.id,
      type: "ISSUE" as const,
      date: i.issueDate,
      voucherNo: i.voucherNo,
      partyName: i.partyName ?? "Unknown",
      bardanaTypeName: "-", // Would need items to show type
      quantity: i.totalQuantity,
      amount: i.totalAmount,
      status: i.status,
    }));

    const receiptTransactions: RecentBardanaTransaction[] = receipts.map(
      (r) => ({
        id: r.id,
        type: "RECEIPT" as const,
        date: r.receiptDate,
        voucherNo: r.voucherNo,
        partyName: r.partyName ?? "Unknown",
        bardanaTypeName: "-",
        quantity: r.totalQuantity,
        amount: r.netAmount,
        status: r.status,
      })
    );

    return [...issueTransactions, ...receiptTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [issues, receipts]);

  return (
    <Card data-testid="bardana-recent-transactions">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">
          Recent Transactions
        </CardTitle>
        <div className="flex gap-2">
          {onViewAll && (
            <Button data-testid="bardana-view-all-button" variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
          {onNewIssue && (
            <Button data-testid="bardana-new-issue-button" size="sm" onClick={onNewIssue}>
              + Issue
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table data-testid="bardana-recent-transactions-table" className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="py-2 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="py-2 text-left font-medium text-muted-foreground">
                    Party
                  </th>
                  <th className="py-2 text-right font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="py-2 text-right font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="py-2 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b last:border-0">
                    <td className="py-2">
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="py-2">
                      <Badge variant={txn.type === "ISSUE" ? "default" : "secondary"}>
                        {txn.type === "ISSUE" ? "Issue" : "Return"}
                      </Badge>
                    </td>
                    <td className="py-2 max-w-[150px] truncate">
                      {txn.partyName}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {formatNumber(txn.quantity)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="py-2">{getStatusBadge(txn.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
