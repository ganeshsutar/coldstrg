import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useSaudaList,
  useSaudaStats,
  useDeleteSauda,
  useCancelSauda,
  useCompleteSauda,
} from "../../hooks";
import { getSaudaColumns } from "./sauda-columns";
import { SaudaFormDialog } from "./sauda-form-dialog";
import { PageHeaderSkeleton, MetricCardSkeleton, SearchSkeleton, TableSkeleton } from "@/components/loading";
import { Skeleton } from "@/components/ui/skeleton";
import type { Sauda } from "../../types";
import { formatCurrency, formatNumber } from "../../utils";

type FilterTab = "all" | "open" | "partial" | "completed";

export function SaudaListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: saudas = [], isLoading } = useSaudaList(organizationId);
  const { data: stats } = useSaudaStats(organizationId);
  const deleteMutation = useDeleteSauda(organizationId);
  const cancelMutation = useCancelSauda(organizationId);
  const completeMutation = useCompleteSauda(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSauda, setEditingSauda] = useState<Sauda | null>(null);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "open":
        return saudas.filter((s) => s.status === "OPEN");
      case "partial":
        return saudas.filter((s) => s.status === "PARTIAL");
      case "completed":
        return saudas.filter(
          (s) => s.status === "COMPLETED" || s.status === "DISPATCHED"
        );
      default:
        return saudas;
    }
  }, [saudas, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (s) =>
        s.sellerPartyName?.toLowerCase().includes(lower) ||
        s.buyerPartyName?.toLowerCase().includes(lower) ||
        s.commodityName?.toLowerCase().includes(lower) ||
        String(s.saudaNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const open = saudas.filter((s) => s.status === "OPEN").length;
    const partial = saudas.filter((s) => s.status === "PARTIAL").length;
    const completed = saudas.filter(
      (s) => s.status === "COMPLETED" || s.status === "DISPATCHED"
    ).length;
    return { open, partial, completed };
  }, [saudas]);

  function handleView(sauda: Sauda) {
    console.log("View sauda:", sauda);
  }

  function handleEdit(sauda: Sauda) {
    setEditingSauda(sauda);
    setDialogOpen(true);
  }

  function handleDelete(sauda: Sauda) {
    if (confirm(`Delete deal #${sauda.saudaNo}?`)) {
      deleteMutation.mutate(sauda.id);
    }
  }

  function handleCreateGatePass(sauda: Sauda) {
    // Navigate to gate pass creation with sauda pre-filled
    console.log("Create gate pass for sauda:", sauda);
  }

  function handleCancel(sauda: Sauda) {
    if (confirm(`Cancel deal #${sauda.saudaNo}?`)) {
      cancelMutation.mutate(sauda.id);
    }
  }

  function handleComplete(sauda: Sauda) {
    if (confirm(`Mark deal #${sauda.saudaNo} as complete?`)) {
      completeMutation.mutate(sauda.id);
    }
  }

  const columns = useMemo(
    () =>
      getSaudaColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onCreateGatePass: handleCreateGatePass,
        onCancel: handleCancel,
        onComplete: handleComplete,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
        <SearchSkeleton />
        <TableSkeleton columns={7} rows={8} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="sauda-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deals (Sauda)</h1>
          <p className="text-sm text-muted-foreground">
            Trading deals and contracts
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingSauda(null);
            setDialogOpen(true);
          }}
          data-testid="new-deal-button"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Deal
        </Button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card data-testid="sauda-kpi-open-deals">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Open Deals</div>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.pendingValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.openDeals} deals
              </div>
            </CardContent>
          </Card>
          <Card data-testid="sauda-kpi-partial-dispatch">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Partial Dispatch</div>
              <div className="text-2xl font-bold">{stats.partialDeals}</div>
              <div className="text-xs text-muted-foreground">
                deals in progress
              </div>
            </CardContent>
          </Card>
          <Card data-testid="sauda-kpi-total-value">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatNumber(stats.totalDeals)} deals
              </div>
            </CardContent>
          </Card>
          <Card data-testid="sauda-kpi-dispatched">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Dispatched</div>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.dispatchedValue)}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.completedDeals} completed
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all" data-testid="sauda-tab-all">All ({saudas.length})</TabsTrigger>
          <TabsTrigger value="open" data-testid="sauda-tab-open">Open ({counts.open})</TabsTrigger>
          <TabsTrigger value="partial" data-testid="sauda-tab-partial">Partial ({counts.partial})</TabsTrigger>
          <TabsTrigger value="completed" data-testid="sauda-tab-completed">Completed ({counts.completed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party, commodity, or deal #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="sauda-search-input"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <SaudaFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingSauda(null);
          }}
          organizationId={organizationId}
          sauda={editingSauda}
        />
      )}
    </div>
  );
}
