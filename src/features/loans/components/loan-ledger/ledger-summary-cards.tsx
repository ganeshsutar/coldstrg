import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Percent, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils";

interface LedgerSummaryCardsProps {
  totalDisbursed: number;
  totalRepaid: number;
  totalInterest: number;
  currentBalance: number;
}

export function LedgerSummaryCards({
  totalDisbursed,
  totalRepaid,
  totalInterest,
  currentBalance,
}: LedgerSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">
              Total Disbursed
            </span>
          </div>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(totalDisbursed)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Total Repaid</span>
          </div>
          <p className="text-2xl font-semibold mt-1 text-green-600">
            {formatCurrency(totalRepaid)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              Interest Charged
            </span>
          </div>
          <p className="text-2xl font-semibold mt-1 text-blue-600">
            {formatCurrency(totalInterest)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Current Balance
            </span>
          </div>
          <p className="text-2xl font-semibold mt-1 text-primary">
            {formatCurrency(currentBalance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
