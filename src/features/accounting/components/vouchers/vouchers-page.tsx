import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useVoucherList,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
} from "../../hooks/use-vouchers";
import { useAccountList } from "../../hooks/use-accounts";
import { getNextVoucherNo } from "../../api/vouchers";
import { getVoucherColumns } from "./voucher-columns";
import { VoucherFormDialog } from "./voucher-form-dialog";
import type { Voucher, VoucherTypeValue, CreateVoucherInput } from "../../types";

type VoucherFilterTab = "all" | VoucherTypeValue;

export function VouchersPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: vouchers = [], isLoading } = useVoucherList(organizationId);
  const { data: accounts = [] } = useAccountList(organizationId);
  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();
  const deleteMutation = useDeleteVoucher(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<VoucherFilterTab>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [nextVoucherNo, setNextVoucherNo] = useState(1);

  useEffect(() => {
    if (dialogOpen && !editingVoucher && organizationId) {
      getNextVoucherNo(organizationId).then(setNextVoucherNo);
    }
  }, [dialogOpen, editingVoucher, organizationId]);

  // Filter by tab (voucher type)
  const tabFiltered = useMemo(() => {
    if (activeTab === "all") return vouchers;
    return vouchers.filter((v) => v.voucherType === activeTab);
  }, [vouchers, activeTab]);

  // Filter by date
  const dateFiltered = useMemo(() => {
    if (!dateFilter) return tabFiltered;
    return tabFiltered.filter((v) => v.date === dateFilter);
  }, [tabFiltered, dateFilter]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return dateFiltered;
    const lower = search.toLowerCase();
    return dateFiltered.filter(
      (v) =>
        v.drAccountName?.toLowerCase().includes(lower) ||
        v.crAccountName?.toLowerCase().includes(lower) ||
        v.narration?.toLowerCase().includes(lower) ||
        String(v.voucherNo).includes(lower)
    );
  }, [dateFiltered, search]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: vouchers.length,
      CR: vouchers.filter((v) => v.voucherType === "CR").length,
      DR: vouchers.filter((v) => v.voucherType === "DR").length,
      JV: vouchers.filter((v) => v.voucherType === "JV").length,
      CV: vouchers.filter((v) => v.voucherType === "CV").length,
      BH: vouchers.filter((v) => v.voucherType === "BH").length,
    };
  }, [vouchers]);

  // Calculate totals
  const totals = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayVouchers = vouchers.filter((v) => v.date === today);
    const totalToday = todayVouchers.reduce((sum, v) => sum + (v.amount || 0), 0);
    const totalAll = vouchers.reduce((sum, v) => sum + (v.amount || 0), 0);

    return {
      todayCount: todayVouchers.length,
      totalToday,
      totalAll,
    };
  }, [vouchers]);

  function handleView(voucher: Voucher) {
    setEditingVoucher(voucher);
    setDialogOpen(true);
  }

  function handleEdit(voucher: Voucher) {
    setEditingVoucher(voucher);
    setDialogOpen(true);
  }

  function handleDelete(voucher: Voucher) {
    if (confirm(`Delete voucher #${voucher.voucherNo}?`)) {
      deleteMutation.mutate(voucher.id);
    }
  }

  function handleSave(input: CreateVoucherInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingVoucher(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingVoucher(null);
        },
      });
    }
  }

  const columns = useMemo(
    () =>
      getVoucherColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading vouchers...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="vouchers-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vouchers</h1>
          <p className="text-sm text-muted-foreground" data-testid="voucher-today-summary">
            {totals.todayCount} vouchers today · Total: {formatCurrency(totals.totalToday)}
          </p>
        </div>
        <Button
          data-testid="new-voucher-button"
          onClick={() => {
            setEditingVoucher(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Voucher
        </Button>
      </div>

      {/* Tab Filters */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as VoucherFilterTab)}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all" data-testid="voucher-tab-all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="CR" data-testid="voucher-tab-cr">Receipt ({tabCounts.CR})</TabsTrigger>
          <TabsTrigger value="DR" data-testid="voucher-tab-dr">Payment ({tabCounts.DR})</TabsTrigger>
          <TabsTrigger value="JV" data-testid="voucher-tab-jv">Journal ({tabCounts.JV})</TabsTrigger>
          <TabsTrigger value="CV" data-testid="voucher-tab-cv">Contra ({tabCounts.CV})</TabsTrigger>
          <TabsTrigger value="BH" data-testid="voucher-tab-bh">Bank ({tabCounts.BH})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Date Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="voucher-search-input"
            placeholder="Search by account or narration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="voucher-date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-9 w-44"
          />
        </div>
        {dateFilter && (
          <Button variant="ghost" size="sm" onClick={() => setDateFilter("")} data-testid="voucher-clear-date-button">
            Clear Date
          </Button>
        )}
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} data-testid="voucher-data-table" />

      {/* Form Dialog */}
      {organizationId && (
        <VoucherFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingVoucher(null);
          }}
          voucher={editingVoucher}
          accounts={accounts}
          nextVoucherNo={nextVoucherNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
