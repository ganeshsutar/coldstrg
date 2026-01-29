import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useBardanaReceiptList,
  useCreateBardanaReceipt,
  useDeleteBardanaReceipt,
  useConfirmBardanaReceipt,
  useCancelBardanaReceipt,
  useNextReceiptNo,
} from "../../hooks/use-bardana-receipt";
import { getReceiptColumns } from "./receipt-columns";
import { ReceiptFormDialog } from "./receipt-form-dialog";
import type { BardanaReceiptHeader, BardanaReceiptFormInput } from "../../types";

type FilterTab = "all" | "draft" | "confirmed" | "cancelled";

export function ReceiptListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: receipts = [], isLoading } =
    useBardanaReceiptList(organizationId);
  const { data: nextVoucherNo = 1 } = useNextReceiptNo(organizationId);
  const createMutation = useCreateBardanaReceipt();
  const deleteMutation = useDeleteBardanaReceipt(organizationId);
  const confirmMutation = useConfirmBardanaReceipt();
  const cancelMutation = useCancelBardanaReceipt(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] =
    useState<BardanaReceiptHeader | null>(null);

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
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (r) =>
        r.partyName?.toLowerCase().includes(lower) ||
        String(r.voucherNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const draft = receipts.filter((r) => r.status === "DRAFT").length;
    const confirmed = receipts.filter((r) => r.status === "CONFIRMED").length;
    const cancelled = receipts.filter((r) => r.status === "CANCELLED").length;
    return { draft, confirmed, cancelled };
  }, [receipts]);

  function handleView(receipt: BardanaReceiptHeader) {
    console.log("View receipt:", receipt);
  }

  function handleEdit(receipt: BardanaReceiptHeader) {
    setEditingReceipt(receipt);
    setDialogOpen(true);
  }

  function handleDelete(receipt: BardanaReceiptHeader) {
    if (confirm(`Delete receipt #${receipt.voucherNo}?`)) {
      deleteMutation.mutate(receipt.id);
    }
  }

  function handleConfirm(receipt: BardanaReceiptHeader) {
    if (!organizationId) return;
    if (
      confirm(
        `Confirm receipt #${receipt.voucherNo}? This will update stock balances.`
      )
    ) {
      confirmMutation.mutate({
        organizationId,
        receiptId: receipt.id,
        confirmedBy: "current-user",
      });
    }
  }

  function handleCancel(receipt: BardanaReceiptHeader) {
    if (confirm(`Cancel receipt #${receipt.voucherNo}?`)) {
      cancelMutation.mutate(receipt.id);
    }
  }

  function handleSave(formInput: BardanaReceiptFormInput) {
    if (!organizationId) return;

    createMutation.mutate(
      { organizationId, formInput },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingReceipt(null);
        },
      }
    );
  }

  const columns = useMemo(
    () =>
      getReceiptColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading receipt records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bardana Returns
          </h1>
          <p className="text-sm text-muted-foreground">
            Record bag returns from parties
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingReceipt(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Return
        </Button>
      </div>

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({receipts.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({counts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({counts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party or voucher #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <ReceiptFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingReceipt(null);
          }}
          receipt={editingReceipt}
          nextVoucherNo={nextVoucherNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}
