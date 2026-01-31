import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Percent } from "lucide-react";
import type { Account } from "../../types";

interface PartyKpiCardsProps {
  accounts: Account[];
}

export function PartyKpiCards({ accounts }: PartyKpiCardsProps) {
  const metrics = useMemo(() => {
    // Filter to only party accounts (not groups)
    const partyAccounts = accounts.filter((a) => a.accountType === "ACCOUNT");

    // Calculate total debtors (DR balance)
    const debtors = partyAccounts.filter((a) => (a.balance ?? 0) > 0);
    const totalDebit = debtors.reduce((sum, a) => sum + (a.balance ?? 0), 0);

    // Calculate total creditors (CR balance)
    const creditors = partyAccounts.filter((a) => (a.balance ?? 0) < 0);
    const totalCredit = Math.abs(
      creditors.reduce((sum, a) => sum + (a.balance ?? 0), 0)
    );

    // Calculate pending interest
    const pendingInterest = partyAccounts.reduce(
      (sum, a) => sum + ((a.intrstDr ?? 0) - (a.intrstCr ?? 0)),
      0
    );

    // Calculate pending rent
    const pendingRent = partyAccounts.reduce(
      (sum, a) => sum + ((a.rentDr ?? 0) - (a.rentCr ?? 0)),
      0
    );

    return {
      totalParties: partyAccounts.length,
      debtorCount: debtors.length,
      creditorCount: creditors.length,
      totalDebit,
      totalCredit,
      pendingInterest,
      pendingRent,
    };
  }, [accounts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-testid="party-kpi-cards">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="kpi-total-debtors">
        <CardHeader className="relative">
          <CardDescription>Total Debtors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums" data-testid="kpi-total-debtors-value">
            {formatCurrency(metrics.totalDebit)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span data-testid="kpi-total-debtors-count">{metrics.debtorCount} parties owe you</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="kpi-total-creditors">
        <CardHeader className="relative">
          <CardDescription>Total Creditors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums" data-testid="kpi-total-creditors-value">
            {formatCurrency(metrics.totalCredit)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span data-testid="kpi-total-creditors-count">{metrics.creditorCount} parties to pay</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="kpi-pending-rent">
        <CardHeader className="relative">
          <CardDescription>Pending Rent</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums" data-testid="kpi-pending-rent-value">
            {formatCurrency(metrics.pendingRent)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Rent receivable</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card" data-testid="kpi-pending-interest">
        <CardHeader className="relative">
          <CardDescription>Pending Interest</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums" data-testid="kpi-pending-interest-value">
            {formatCurrency(metrics.pendingInterest)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="h-4 w-4" />
            <span>Interest receivable</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
