import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrganization } from "@/features/organizations";
import { useDaybookByDate } from "../../hooks/use-daybook";
import { useVouchersByDate } from "../../hooks/use-vouchers";
import { DaybookSummaryCards } from "./daybook-summary-cards";
import { DateNavigator } from "./date-navigator";
import { VOUCHER_TYPE_COLORS } from "@/config/constants";
import type { VoucherTypeValue } from "../../types";

const VOUCHER_TYPE_LABELS: Record<VoucherTypeValue, string> = {
  CR: "Receipt",
  DR: "Payment",
  JV: "Journal",
  CV: "Contra",
  BH: "Bank",
};

export function DaybookTab() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { data: daybook, isLoading: isDaybookLoading } = useDaybookByDate(
    organizationId,
    selectedDate
  );

  const { data: vouchers = [], isLoading: isVouchersLoading } =
    useVouchersByDate(organizationId, selectedDate);

  // Calculate daily totals from vouchers
  const dailyTotals = useMemo(() => {
    const receipts = vouchers
      .filter((v) => v.voucherType === "CR")
      .reduce((sum, v) => sum + (v.amount || 0), 0);

    const payments = vouchers
      .filter((v) => v.voucherType === "DR")
      .reduce((sum, v) => sum + (v.amount || 0), 0);

    const bankIn = vouchers
      .filter((v) => v.voucherType === "BH" && v.crAccountName?.toLowerCase().includes("bank"))
      .reduce((sum, v) => sum + (v.amount || 0), 0);

    const bankOut = vouchers
      .filter((v) => v.voucherType === "BH" && v.drAccountName?.toLowerCase().includes("bank"))
      .reduce((sum, v) => sum + (v.amount || 0), 0);

    return {
      receipts,
      payments,
      bankIn,
      bankOut,
      netCash: receipts - payments,
      netBank: bankIn - bankOut,
    };
  }, [vouchers]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isLoading = isDaybookLoading || isVouchersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading daybook...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" data-testid="daybook-page">
      {/* Header with date navigator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Daybook</h2>
          <p className="text-sm text-muted-foreground">
            Daily transaction summary
          </p>
        </div>
        <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Summary Cards */}
      <DaybookSummaryCards daybook={daybook ?? null} />

      {/* Daily Summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Cash Summary */}
        <Card data-testid="daybook-cash-summary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cash Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Receipts (CR)</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                + {formatCurrency(dailyTotals.receipts)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Payments (DR)</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                - {formatCurrency(dailyTotals.payments)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 font-medium">
              <span>Net Cash Flow</span>
              <span
                className={
                  dailyTotals.netCash >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {dailyTotals.netCash >= 0 ? "+" : ""}
                {formatCurrency(dailyTotals.netCash)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bank Summary */}
        <Card data-testid="daybook-bank-summary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bank Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Bank Deposits</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                + {formatCurrency(dailyTotals.bankIn)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Bank Withdrawals</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                - {formatCurrency(dailyTotals.bankOut)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 font-medium">
              <span>Net Bank Flow</span>
              <span
                className={
                  dailyTotals.netBank >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {dailyTotals.netBank >= 0 ? "+" : ""}
                {formatCurrency(dailyTotals.netBank)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card data-testid="daybook-transactions">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Transactions ({vouchers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vouchers.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground" data-testid="daybook-empty-state">
              <p>No transactions for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`daybook-transaction-${voucher.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={VOUCHER_TYPE_COLORS[voucher.voucherType] || ""}
                    >
                      {voucher.voucherType}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">
                        #{voucher.voucherNo} -{" "}
                        {VOUCHER_TYPE_LABELS[voucher.voucherType]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {voucher.drAccountName} → {voucher.crAccountName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium tabular-nums">
                      {formatCurrency(voucher.amount)}
                    </div>
                    {voucher.narration && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {voucher.narration}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
