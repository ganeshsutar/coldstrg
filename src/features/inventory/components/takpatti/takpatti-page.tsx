import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useTakpattiList,
  useCreateTakpatti,
  useDeleteTakpatti,
} from "../../hooks/use-takpatti";
import { getNextTakpattiNo } from "../../api/takpatti";
import { getTakpattiColumns } from "./takpatti-columns";
import { TakpattiFormDialog } from "./takpatti-form-dialog";
import type { CreateTakpattiInput } from "../../types";

export function TakpattiPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: takpattiList = [], isLoading } =
    useTakpattiList(organizationId);
  const createMutation = useCreateTakpatti();
  const deleteMutation = useDeleteTakpatti(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nextTakpattiNo, setNextTakpattiNo] = useState(1);

  useEffect(() => {
    if (dialogOpen && organizationId) {
      getNextTakpattiNo(organizationId).then(setNextTakpattiNo);
    }
  }, [dialogOpen, organizationId]);

  const filtered = useMemo(() => {
    if (!search) return takpattiList;
    const lower = search.toLowerCase();
    return takpattiList.filter(
      (t) =>
        String(t.takpattiNo).includes(lower) ||
        String(t.amadNo).includes(lower) ||
        t.room?.toLowerCase().includes(lower)
    );
  }, [takpattiList, search]);

  function handleDelete(takpatti: { id: string; takpattiNo: number }) {
    if (confirm(`Delete Takpatti #${takpatti.takpattiNo}?`)) {
      deleteMutation.mutate(takpatti.id);
    }
  }

  function handleSave(input: CreateTakpattiInput) {
    createMutation.mutate(input, {
      onSuccess: () => setDialogOpen(false),
    });
  }

  const columns = useMemo(
    () => getTakpattiColumns({ onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading takpatti records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Takpatti</h1>
          <p className="text-sm text-muted-foreground">
            Weighment slip records
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Takpatti
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by takpatti #, amad #, or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <TakpattiFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          nextTakpattiNo={nextTakpattiNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}
