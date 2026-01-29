import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useStockTransferList,
  useCreateStockTransfer,
  useDeleteStockTransfer,
} from "../../hooks/use-stock-transfer";
import { getNextTransferNo } from "../../api/stock-transfer";
import { getTransferColumns } from "./transfer-columns";
import { StockTransferWizard } from "./stock-transfer-wizard";
import type { StockTransfer, CreateStockTransferInput } from "../../types";

export function StockTransferPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: transferList = [], isLoading } =
    useStockTransferList(organizationId);
  const createMutation = useCreateStockTransfer();
  const deleteMutation = useDeleteStockTransfer(organizationId);

  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [nextTransferNo, setNextTransferNo] = useState(1);

  useEffect(() => {
    if (wizardOpen && organizationId) {
      getNextTransferNo(organizationId).then(setNextTransferNo);
    }
  }, [wizardOpen, organizationId]);

  const filtered = useMemo(() => {
    if (!search) return transferList;
    const lower = search.toLowerCase();
    return transferList.filter(
      (t) =>
        String(t.transferNo).includes(lower) ||
        t.fromPartyName?.toLowerCase().includes(lower) ||
        t.toPartyName?.toLowerCase().includes(lower)
    );
  }, [transferList, search]);

  function handleDelete(transfer: StockTransfer) {
    if (confirm(`Delete Transfer #${transfer.transferNo}?`)) {
      deleteMutation.mutate(transfer.id);
    }
  }

  function handleSave(input: CreateStockTransferInput) {
    createMutation.mutate(input, {
      onSuccess: () => setWizardOpen(false),
    });
  }

  const columns = useMemo(
    () => getTransferColumns({ onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          Loading transfer records...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Stock Transfer
          </h1>
          <p className="text-sm text-muted-foreground">
            Transfer stock between rooms and parties
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Transfer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by transfer #, party..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Wizard Dialog */}
      {organizationId && (
        <StockTransferWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          nextTransferNo={nextTransferNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}
