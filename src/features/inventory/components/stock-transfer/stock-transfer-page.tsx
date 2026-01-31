import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { PageHeaderSkeleton, SearchSkeleton, TableSkeleton } from "@/components/loading";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState<StockTransfer | null>(null);

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
    setTransferToDelete(transfer);
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (transferToDelete) {
      deleteMutation.mutate(transferToDelete.id);
      setDeleteDialogOpen(false);
      setTransferToDelete(null);
    }
  }

  function handleSave(input: CreateStockTransferInput) {
    createMutation.mutate(input, {
      onSuccess: () => setWizardOpen(false),
    });
  }

  const columns = useMemo(
    () => getTransferColumns({ onDelete: handleDelete }),
     
    []
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeaderSkeleton />
        <SearchSkeleton />
        <TableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="transfer-page">
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
        <Button onClick={() => setWizardOpen(true)} data-testid="new-transfer-button">
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
          data-testid="transfer-search-input"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Transfer #{transferToDelete?.transferNo}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
