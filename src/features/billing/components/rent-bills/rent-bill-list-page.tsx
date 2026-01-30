import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import { useRentBillList, useBillingStats, useConfirmRentBill, useCancelRentBill } from "../../hooks";
import { getRentBillColumns } from "./rent-bill-columns";
import { RentBillKpiCards } from "./rent-bill-kpi-cards";
import type { RentBillHeader } from "../../types";

type FilterTab = "all" | "draft" | "pending" | "paid" | "cancelled";

export function RentBillListPage() {
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: bills = [], isLoading } = useRentBillList(organizationId);
  const { data: stats, isLoading: statsLoading } = useBillingStats(organizationId);
  const confirmMutation = useConfirmRentBill();
  const cancelMutation = useCancelRentBill();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "draft":
        return bills.filter((b) => b.status === "DRAFT");
      case "pending":
        return bills.filter(
          (b) =>
            b.status === "CONFIRMED" ||
            b.status === "PARTIAL_PAID" ||
            b.status === "OVERDUE"
        );
      case "paid":
        return bills.filter((b) => b.status === "PAID");
      case "cancelled":
        return bills.filter((b) => b.status === "CANCELLED");
      default:
        return bills;
    }
  }, [bills, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (b) =>
        b.billNo.toLowerCase().includes(lower) ||
        b.partyName?.toLowerCase().includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const draft = bills.filter((b) => b.status === "DRAFT").length;
    const pending = bills.filter(
      (b) =>
        b.status === "CONFIRMED" ||
        b.status === "PARTIAL_PAID" ||
        b.status === "OVERDUE"
    ).length;
    const paid = bills.filter((b) => b.status === "PAID").length;
    const cancelled = bills.filter((b) => b.status === "CANCELLED").length;
    return { draft, pending, paid, cancelled };
  }, [bills]);

  function handleView(bill: RentBillHeader) {
    navigate({ to: "/billing/$billId", params: { billId: bill.id } });
  }

  function handlePrint(bill: RentBillHeader) {
    // Open print preview
    navigate({ to: "/billing/$billId", params: { billId: bill.id } });
  }

  function handleConfirm(bill: RentBillHeader) {
    if (confirm(`Confirm bill ${bill.billNo}?`)) {
      confirmMutation.mutate({
        id: bill.id,
        confirmedBy: "current-user", // Would get from auth context
      });
    }
  }

  function handleCancel(bill: RentBillHeader) {
    const reason = prompt(`Cancel bill ${bill.billNo}? Enter reason:`);
    if (reason !== null) {
      cancelMutation.mutate({
        id: bill.id,
        cancelledBy: "current-user",
        cancelReason: reason,
      });
    }
  }

  function handleRecordPayment(bill: RentBillHeader) {
    navigate({
      to: "/billing/receipts",
      search: { partyId: bill.partyId, billId: bill.id },
    });
  }

  const columns = useMemo(
    () =>
      getRentBillColumns({
        onView: handleView,
        onPrint: handlePrint,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        onRecordPayment: handleRecordPayment,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading rent bills...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rent Bills</h1>
          <p className="text-sm text-muted-foreground">
            Generate and manage storage rent bills
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/billing/new-bill" })}>
          <Plus className="h-4 w-4 mr-1" />
          New Bill
        </Button>
      </div>

      {/* KPI Cards */}
      <RentBillKpiCards stats={stats} isLoading={statsLoading} />

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({bills.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({counts.paid})</TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({counts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by bill # or party..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
