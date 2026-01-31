import { useState, useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useReceiptList,
  useNextReceiptNo,
  useCreateReceipt,
  useConfirmReceipt,
  useCancelReceipt,
} from "../../hooks";
import { getReceiptColumns } from "./receipt-columns";
import { ReceiptFormDialog } from "./receipt-form-dialog";
import type { Receipt, ReceiptFormInput } from "../../types";

type FilterTab = "all" | "draft" | "confirmed" | "cancelled";

export function ReceiptListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  // Get URL search params (for preselected party/bill)
  const search = useSearch({ strict: false }) as {
    partyId?: string;
    billId?: string;
  };

  const { data: receipts = [], isLoading } = useReceiptList(organizationId);
  const { data: nextReceiptNo = "" } = useNextReceiptNo(organizationId);
  const createMutation = useCreateReceipt();
  const confirmMutation = useConfirmReceipt();
  const cancelMutation = useCancelReceipt();

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(!!search.partyId);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "draft":
        return receipts.filter((r) => r.status === "DRAFT");
      case "confirmed":
        return receipts.filter((r) => r.status === "CONFIRMED");
      case "cancelled":
        return receipts.filter((r) => r.status === "CANCELLED");
      default:
        return receipts;
    }
  }, [receipts, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!searchText) return tabFiltered;
    const lower = searchText.toLowerCase();
    return tabFiltered.filter(
      (r) =>
        r.receiptNo.toLowerCase().includes(lower) ||
        r.partyName?.toLowerCase().includes(lower)
    );
  }, [tabFiltered, searchText]);

  // Count by status
  const counts = useMemo(() => {
    const draft = receipts.filter((r) => r.status === "DRAFT").length;
    const confirmed = receipts.filter((r) => r.status === "CONFIRMED").length;
    const cancelled = receipts.filter((r) => r.status === "CANCELLED").length;
    return { draft, confirmed, cancelled };
  }, [receipts]);

  function handleView(receipt: Receipt) {
    // Could open a detail dialog
    console.log("View receipt:", receipt);
  }

  function handlePrint(receipt: Receipt) {
    // Could open print preview
    console.log("Print receipt:", receipt);
  }

  function handleConfirm(receipt: Receipt) {
    if (!organizationId) return;
    if (confirm(`Confirm receipt ${receipt.receiptNo}? This will update bill balances.`)) {
      confirmMutation.mutate({
        organizationId,
        receiptId: receipt.id,
        confirmedBy: "current-user",
      });
    }
  }

  function handleCancel(receipt: Receipt) {
    if (!organizationId) return;
    const reason = prompt(`Cancel receipt ${receipt.receiptNo}? Enter reason:`);
    if (reason !== null) {
      cancelMutation.mutate({
        organizationId,
        receiptId: receipt.id,
        cancelledBy: "current-user",
        cancelReason: reason,
      });
    }
  }

  function handleSave(formInput: ReceiptFormInput) {
    if (!organizationId) return;

    createMutation.mutate(
      { organizationId, formInput },
      {
        onSuccess: () => {
          setDialogOpen(false);
        },
      }
    );
  }

  const columns = useMemo(
    () =>
      getReceiptColumns({
        onView: handleView,
        onPrint: handlePrint,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading receipts...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="receipt-list-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Receipts</h1>
          <p className="text-sm text-muted-foreground">
            Record and manage payment receipts
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="receipt-new-button">
          <Plus className="h-4 w-4 mr-1" />
          New Receipt
        </Button>
      </div>

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all" data-testid="receipt-tab-all">All ({receipts.length})</TabsTrigger>
          <TabsTrigger value="draft" data-testid="receipt-tab-draft">Draft ({counts.draft})</TabsTrigger>
          <TabsTrigger value="confirmed" data-testid="receipt-tab-confirmed">
            Confirmed ({counts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="cancelled" data-testid="receipt-tab-cancelled">
            Cancelled ({counts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by receipt # or party..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-9"
          data-testid="receipt-search"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} data-testid="receipt-table" />

      {/* Form Dialog */}
      {organizationId && (
        <ReceiptFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          organizationId={organizationId}
          nextReceiptNo={nextReceiptNo}
          preselectedPartyId={search.partyId}
          onSave={handleSave}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}
