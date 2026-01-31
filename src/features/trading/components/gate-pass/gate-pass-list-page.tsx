import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useGatePassList,
  useGatePassStats,
  useGatePassDetails,
  useDeleteGatePass,
  useConfirmGatePass,
  useMarkGatePassDone,
  useCancelGatePass,
} from "../../hooks";
import { getGatePassColumns } from "./gate-pass-columns";
import { GatePassFormDialog } from "./gate-pass-form-dialog";
import { GatePassPrintPreview } from "./gate-pass-print-preview";
import type { GatePass } from "../../types";
import { formatNumber } from "../../utils";

type FilterTab = "all" | "today" | "pending" | "week";

export function GatePassListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: gatePasses = [], isLoading } = useGatePassList(organizationId);
  const { data: stats } = useGatePassStats(organizationId);
  const deleteMutation = useDeleteGatePass(organizationId);
  const confirmMutation = useConfirmGatePass(organizationId);
  const markDoneMutation = useMarkGatePassDone(organizationId);
  const cancelMutation = useCancelGatePass(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [selectedGatePass, setSelectedGatePass] = useState<GatePass | null>(null);

  // Fetch details for print preview
  const { data: printDetails = [] } = useGatePassDetails(
    printPreviewOpen ? selectedGatePass?.id : undefined
  );

  // Calculate date ranges
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "today":
        return gatePasses.filter((g) => g.gpDate === today);
      case "pending":
        return gatePasses.filter((g) => g.status === "DRAFT");
      case "week":
        return gatePasses.filter((g) => g.gpDate >= weekAgo);
      default:
        return gatePasses;
    }
  }, [gatePasses, activeTab, today, weekAgo]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (g) =>
        g.sellerPartyName?.toLowerCase().includes(lower) ||
        g.buyerPartyName?.toLowerCase().includes(lower) ||
        g.vehicleNo?.toLowerCase().includes(lower) ||
        String(g.gpNo).includes(lower) ||
        String(g.saudaNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by filter
  const counts = useMemo(() => {
    const todayCount = gatePasses.filter((g) => g.gpDate === today).length;
    const pending = gatePasses.filter((g) => g.status === "DRAFT").length;
    const weekCount = gatePasses.filter((g) => g.gpDate >= weekAgo).length;
    return { today: todayCount, pending, week: weekCount };
  }, [gatePasses, today, weekAgo]);

  function handleView(gatePass: GatePass) {
    setSelectedGatePass(gatePass);
    setPrintPreviewOpen(true);
  }

  function handleEdit(gatePass: GatePass) {
    console.log("Edit gate pass:", gatePass);
  }

  function handleDelete(gatePass: GatePass) {
    if (confirm(`Delete gate pass #${gatePass.gpNo}?`)) {
      deleteMutation.mutate(gatePass.id);
    }
  }

  function handlePrint(gatePass: GatePass) {
    setSelectedGatePass(gatePass);
    setPrintPreviewOpen(true);
  }

  function handleConfirm(gatePass: GatePass) {
    confirmMutation.mutate(gatePass.id, {
      onSuccess: () => {
        setSelectedGatePass(gatePass);
        setPrintPreviewOpen(true);
      },
    });
  }

  function handleMarkDone(gatePass: GatePass) {
    if (confirm(`Mark gate pass #${gatePass.gpNo} as done?`)) {
      markDoneMutation.mutate(gatePass.id);
    }
  }

  function handleCancel(gatePass: GatePass) {
    if (confirm(`Cancel gate pass #${gatePass.gpNo}?`)) {
      cancelMutation.mutate(gatePass.id);
    }
  }

  const columns = useMemo(
    () =>
      getGatePassColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onPrint: handlePrint,
        onConfirm: handleConfirm,
        onMarkDone: handleMarkDone,
        onCancel: handleCancel,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="gate-pass-page">
        <div className="text-muted-foreground">Loading gate passes...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="gate-pass-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gate Pass</h1>
          <p className="text-sm text-muted-foreground">
            Outward gate passes for goods dispatch
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedGatePass(null);
            setDialogOpen(true);
          }}
          data-testid="new-gate-pass-button"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Gate Pass
        </Button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card data-testid="gate-pass-kpi-today">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Today</div>
              <div className="text-2xl font-bold">{stats.todayCount}</div>
              <div className="text-xs text-muted-foreground">gate passes</div>
            </CardContent>
          </Card>
          <Card data-testid="gate-pass-kpi-pending-print">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Pending Print</div>
              <div className="text-2xl font-bold">{stats.pendingPrint}</div>
              <div className="text-xs text-muted-foreground">drafts</div>
            </CardContent>
          </Card>
          <Card data-testid="gate-pass-kpi-this-week">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">This Week</div>
              <div className="text-2xl font-bold">{stats.weekCount}</div>
              <div className="text-xs text-muted-foreground">gate passes</div>
            </CardContent>
          </Card>
          <Card data-testid="gate-pass-kpi-total-bags">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Bags</div>
              <div className="text-2xl font-bold">
                {formatNumber(stats.totalBags)}
              </div>
              <div className="text-xs text-muted-foreground">dispatched</div>
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
          <TabsTrigger value="all" data-testid="gate-pass-tab-all">All ({gatePasses.length})</TabsTrigger>
          <TabsTrigger value="today" data-testid="gate-pass-tab-today">Today ({counts.today})</TabsTrigger>
          <TabsTrigger value="pending" data-testid="gate-pass-tab-pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="week" data-testid="gate-pass-tab-week">This Week ({counts.week})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party, vehicle, or GP #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="gate-pass-search-input"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <GatePassFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          organizationId={organizationId}
        />
      )}

      {/* Print Preview Dialog */}
      <GatePassPrintPreview
        open={printPreviewOpen}
        onOpenChange={setPrintPreviewOpen}
        gatePass={selectedGatePass}
        details={printDetails}
        organizationName={currentOrganization?.name}
        organizationAddress={currentOrganization?.address ?? ""}
      />
    </div>
  );
}
