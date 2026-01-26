import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FinancialSummary } from "../types";

interface FinancialCardProps {
  summary: FinancialSummary;
}

export function FinancialCard({ summary }: FinancialCardProps) {
  const icons = {
    receivable: ArrowDownRight,
    payable: ArrowUpRight,
    pending: Clock,
  };
  const Icon = icons[summary.type];

  const colors = {
    receivable: "text-green-600 dark:text-green-400",
    payable: "text-red-600 dark:text-red-400",
    pending: "text-yellow-600 dark:text-yellow-400",
  };

  const progressColors = {
    receivable: "[&>div]:bg-green-500",
    payable: "[&>div]:bg-red-500",
    pending: "[&>div]:bg-yellow-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {summary.label}
        </CardTitle>
        <Icon className={cn("h-4 w-4", colors[summary.type])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {summary.type !== "pending" && "\u20B9"}
          {summary.amount}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{summary.details}</p>
        {summary.progress !== undefined && (
          <Progress
            value={summary.progress}
            className={cn("mt-3 h-2", progressColors[summary.type])}
          />
        )}
      </CardContent>
    </Card>
  );
}
