import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useAdvanceList,
  useDeleteAdvance,
  useCloseAdvance,
} from "../../hooks/use-advances";
import { getAdvanceColumns } from "./advance-columns";
import { AdvanceFormDialog } from "./advance-form-dialog";
import { PageHeaderSkeleton, SearchSkeleton, TableSkeleton } from "@/components/loading";
import { Skeleton } from "@/components/ui/skeleton";
import type { Advance } from "../../types";

type FilterTab = "all" | "pending" | "converted" | "closed";

export function AdvanceListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: advances = [], isLoading } = useAdvanceList(organizationId);
  const deleteMutation = useDeleteAdvance(organizationId);
  const closeMutation = useCloseAdvance(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return advances.filter((a) => a.status === "PENDING");
      case "converted":
        return advances.filter(
          (a) => a.status === "CONVERTED" || a.status === "ADJUSTED"
        );
      case "closed":
        return advances.filter((a) => a.status === "CLOSED");
      default:
        return advances;
    }
  }, [advances, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (a) =>
        a.partyName?.toLowerCase().includes(lower) ||
        String(a.advanceNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const pending = advances.filter((a) => a.status === "PENDING").length;
    const converted = advances.filter(
      (a) => a.status === "CONVERTED" || a.status === "ADJUSTED"
    ).length;
    const closed = advances.filter((a) => a.status === "CLOSED").length;
    return { pending, converted, closed };
  }, [advances]);

  function handleView(advance: Advance) {
    console.log("View advance:", advance);
  }

  function handleEdit(advance: Advance) {
    setEditingAdvance(advance);
    setDialogOpen(true);
  }

  function handleDelete(advance: Advance) {
    if (confirm(`Delete advance #${advance.advanceNo}?`)) {
      deleteMutation.mutate(advance.id);
    }
  }

  function handleConvert(advance: Advance) {
    // Would open conversion dialog with Amad selection
    console.log("Convert advance:", advance);
  }

  function handleClose(advance: Advance) {
    if (confirm(`Close advance #${advance.advanceNo}?`)) {
      closeMutation.mutate(advance.id);
    }
  }

  const columns = useMemo(
    () =>
      getAdvanceColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onConvert: handleConvert,
        onClose: handleClose,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeaderSkeleton />
        {/* Tabs skeleton */}
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
        <SearchSkeleton />
        <TableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Advances</h1>
          <p className="text-sm text-muted-foreground">
            Pre-season advances to farmers
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAdvance(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Advance
        </Button>
      </div>

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({advances.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="converted">
            Converted ({counts.converted})
          </TabsTrigger>
          <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party or advance #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <AdvanceFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingAdvance(null);
          }}
          organizationId={organizationId}
          advance={editingAdvance}
        />
      )}
    </div>
  );
}
