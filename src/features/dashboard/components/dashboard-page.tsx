import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "./metric-card";
import { ChartSection } from "./chart-section";
import { DataTable } from "@/components/shared/data-table";
import { transactionColumns } from "./transaction-columns";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { MetricCardSkeleton, CardSkeleton, TableSkeleton } from "@/components/loading";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Metric cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        {/* Chart skeleton */}
        <CardSkeleton contentLines={6} />
        {/* Table skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TableSkeleton columns={4} rows={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Row 1: Key Metrics - 4 column grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Row 2: Chart Section */}
      <ChartSection data={data.chartData} />

      {/* Row 3: Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest Amad, Nikasi, and Voucher activities across all rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={transactionColumns} data={data.transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
