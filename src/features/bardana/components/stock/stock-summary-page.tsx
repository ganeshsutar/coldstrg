import { useNavigate } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/features/organizations";
import { useBardanaTypeList } from "../../hooks/use-bardana-types";
import { useBardanaStockList } from "../../hooks/use-bardana-stock";
import { useBardanaIssueList } from "../../hooks/use-bardana-issue";
import { useBardanaReceiptList } from "../../hooks/use-bardana-receipt";
import { StockKpiCards } from "./stock-kpi-cards";
import { StockByTypeCards } from "./stock-by-type-cards";
import { RecentTransactionsTable } from "./recent-transactions-table";
import { PageHeaderSkeleton, MetricCardSkeleton, CardSkeleton, TableSkeleton } from "@/components/loading";
import { Skeleton } from "@/components/ui/skeleton";

export function StockSummaryPage() {
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: bardanaTypes = [], isLoading: typesLoading } =
    useBardanaTypeList(organizationId);
  const { data: stockRecords = [], isLoading: stockLoading } =
    useBardanaStockList(organizationId);
  const { data: issues = [], isLoading: issuesLoading } =
    useBardanaIssueList(organizationId);
  const { data: receipts = [], isLoading: receiptsLoading } =
    useBardanaReceiptList(organizationId);

  const isLoading =
    typesLoading || stockLoading || issuesLoading || receiptsLoading;

  function handleNavigateToIssues() {
    navigate({ to: "/bardana/issues" });
  }

  function handleNavigateToReceipts() {
    navigate({ to: "/bardana/receipts" });
  }

  function handleIssueForType() {
    // Navigate to issues page - could pre-select type in future
    navigate({ to: "/bardana/issues" });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeaderSkeleton />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28" />
          ))}
        </div>
        <div>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton contentLines={3} />
            <CardSkeleton contentLines={3} />
            <CardSkeleton contentLines={3} />
          </div>
        </div>
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div data-testid="bardana-stock-page" className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bardana (Packaging)
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage bag inventory, issues, and returns
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <StockKpiCards
        bardanaTypes={bardanaTypes}
        stockRecords={stockRecords}
        issues={issues}
        receipts={receipts}
      />

      {/* Navigation Tabs */}
      <Tabs defaultValue="stock" className="w-full">
        <TabsList>
          <TabsTrigger data-testid="bardana-stock-tab-summary" value="stock">Stock Summary</TabsTrigger>
          <TabsTrigger data-testid="bardana-stock-tab-issues" value="issues" onClick={handleNavigateToIssues}>
            Issues ({issues.length})
          </TabsTrigger>
          <TabsTrigger data-testid="bardana-stock-tab-receipts" value="receipts" onClick={handleNavigateToReceipts}>
            Returns ({receipts.length})
          </TabsTrigger>
          <TabsTrigger
            data-testid="bardana-stock-tab-outstanding"
            value="outstanding"
            onClick={() => navigate({ to: "/bardana/outstanding" })}
          >
            Outstanding
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stock by Type Cards */}
      <div>
        <h2 className="text-lg font-medium mb-4">Stock by Type</h2>
        <StockByTypeCards
          bardanaTypes={bardanaTypes}
          stockRecords={stockRecords}
          onIssue={handleIssueForType}
        />
      </div>

      {/* Recent Transactions */}
      <RecentTransactionsTable
        issues={issues}
        receipts={receipts}
        onViewAll={handleNavigateToIssues}
        onNewIssue={handleNavigateToIssues}
      />
    </div>
  );
}
