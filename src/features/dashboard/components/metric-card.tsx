/* eslint-disable react-hooks/static-components */
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import type { DashboardMetric } from "../types";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = getIcon(metric.icon);

  return (
    <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
      <CardHeader className="relative">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {metric.value}
        </CardTitle>
        {metric.change && (
          <div className="absolute right-4 top-4">
            <Badge
              variant={metric.change.type === "increase" ? "outline" : "outline"}
              className={
                metric.change.type === "increase"
                  ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                  : "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
              }
            >
              {metric.change.type === "increase" ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {metric.change.type === "increase" ? "+" : "-"}
              {metric.change.value}%
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          {metric.subValue && <span>{metric.subValue}</span>}
        </div>
      </CardFooter>
    </Card>
  );
}
