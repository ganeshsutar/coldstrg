import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Banknote, HandCoins, Percent, AlertTriangle } from "lucide-react";
import type { Advance, LoanAmount } from "../../types";
import { formatCurrency } from "../../utils";

interface LoanKpiCardsProps {
  advances: Advance[];
  loans: LoanAmount[];
  interestAccrued?: number;
}

export function LoanKpiCards({
  advances,
  loans,
  interestAccrued = 0,
}: LoanKpiCardsProps) {
  const metrics = useMemo(() => {
    // Pending advances
    const pendingAdvances = advances.filter((a) => a.status === "PENDING");
    const totalAdvances = pendingAdvances.reduce((sum, a) => sum + a.amount, 0);
    const advancePartyCount = new Set(pendingAdvances.map((a) => a.partyId)).size;

    // Active loans
    const activeLoans = loans.filter(
      (l) => l.status === "ACTIVE" || l.status === "PARTIAL_REPAID"
    );
    const totalLoans = activeLoans.reduce(
      (sum, l) => sum + l.outstandingBalance,
      0
    );
    const loanCount = activeLoans.length;

    // Overdue
    const overdueLoans = loans.filter((l) => l.status === "OVERDUE");
    const overdueAmount = overdueLoans.reduce(
      (sum, l) => sum + l.outstandingBalance,
      0
    );
    const overdueCount = overdueLoans.length;

    return {
      totalAdvances,
      advancePartyCount,
      totalLoans,
      loanCount,
      interestAccrued,
      overdueAmount,
      overdueCount,
    };
  }, [advances, loans, interestAccrued]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Total Advances</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(metrics.totalAdvances)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Banknote className="h-4 w-4" />
            <span>{metrics.advancePartyCount} parties</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Active Loans</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(metrics.totalLoans)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HandCoins className="h-4 w-4" />
            <span>{metrics.loanCount} loans</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Interest Accrued</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(metrics.interestAccrued)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="h-4 w-4" />
            <span>This period</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-destructive/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Overdue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-destructive">
            {formatCurrency(metrics.overdueAmount)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>{metrics.overdueCount} parties</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
