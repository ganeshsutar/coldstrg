import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Banknote, Building2, TrendingUp, TrendingDown } from "lucide-react";
import type { Daybook } from "../../types";

interface DaybookSummaryCardsProps {
  daybook: Daybook | null;
}

export function DaybookSummaryCards({ daybook }: DaybookSummaryCardsProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return "0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cashOpening = (daybook?.cashOpenDr ?? 0) - (daybook?.cashOpenCr ?? 0);
  const cashTransactions = (daybook?.cashDr ?? 0) - (daybook?.cashCr ?? 0);
  const cashClosing = (daybook?.cashCloseDr ?? 0) - (daybook?.cashCloseCr ?? 0);

  const bankOpening = (daybook?.bankOpenDr ?? 0) - (daybook?.bankOpenCr ?? 0);
  const bankTransactions = (daybook?.bankDr ?? 0) - (daybook?.bankCr ?? 0);
  const bankClosing = (daybook?.bankCloseDr ?? 0) - (daybook?.bankCloseCr ?? 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-testid="daybook-summary-cards">
      {/* Cash Opening */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="daybook-cash-opening">
        <CardHeader className="relative">
          <CardDescription>Cash Opening</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums" data-testid="daybook-cash-opening-value">
            {formatCurrency(cashOpening)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Banknote className="h-4 w-4" />
            <span>Opening cash balance</span>
          </div>
        </CardFooter>
      </Card>

      {/* Cash Closing */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="daybook-cash-closing">
        <CardHeader className="relative">
          <CardDescription>Cash Closing</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums ${
              cashClosing >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
            data-testid="daybook-cash-closing-value"
          >
            {formatCurrency(cashClosing)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {cashTransactions >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span>
              {cashTransactions >= 0 ? "+" : ""}
              {formatCurrency(cashTransactions)} today
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Bank Opening */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="daybook-bank-opening">
        <CardHeader className="relative">
          <CardDescription>Bank Opening</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums" data-testid="daybook-bank-opening-value">
            {formatCurrency(bankOpening)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Opening bank balance</span>
          </div>
        </CardFooter>
      </Card>

      {/* Bank Closing */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="daybook-bank-closing">
        <CardHeader className="relative">
          <CardDescription>Bank Closing</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums ${
              bankClosing >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
            data-testid="daybook-bank-closing-value"
          >
            {formatCurrency(bankClosing)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {bankTransactions >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span>
              {bankTransactions >= 0 ? "+" : ""}
              {formatCurrency(bankTransactions)} today
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
