import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useBardanaIssueList,
  useCreateBardanaIssue,
  useDeleteBardanaIssue,
  useConfirmBardanaIssue,
  useCancelBardanaIssue,
  useNextIssueNo,
} from "../../hooks/use-bardana-issue";
import { getIssueColumns } from "./issue-columns";
import { IssueFormDialog } from "./issue-form-dialog";
import type { BardanaIssueHeader, BardanaIssueFormInput } from "../../types";

type FilterTab = "all" | "draft" | "confirmed" | "cancelled";

export function IssueListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: issues = [], isLoading } = useBardanaIssueList(organizationId);
  const { data: nextVoucherNo = 1 } = useNextIssueNo(organizationId);
  const createMutation = useCreateBardanaIssue();
  const deleteMutation = useDeleteBardanaIssue(organizationId);
  const confirmMutation = useConfirmBardanaIssue();
  const cancelMutation = useCancelBardanaIssue(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<BardanaIssueHeader | null>(
    null
  );

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "draft":
        return issues.filter((i) => i.status === "DRAFT");
      case "confirmed":
        return issues.filter((i) => i.status === "CONFIRMED");
      case "cancelled":
        return issues.filter((i) => i.status === "CANCELLED");
      default:
        return issues;
    }
  }, [issues, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (i) =>
        i.partyName?.toLowerCase().includes(lower) ||
        String(i.voucherNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const draft = issues.filter((i) => i.status === "DRAFT").length;
    const confirmed = issues.filter((i) => i.status === "CONFIRMED").length;
    const cancelled = issues.filter((i) => i.status === "CANCELLED").length;
    return { draft, confirmed, cancelled };
  }, [issues]);

  function handleView(issue: BardanaIssueHeader) {
    // Could open a detail dialog or navigate
    console.log("View issue:", issue);
  }

  function handleEdit(issue: BardanaIssueHeader) {
    setEditingIssue(issue);
    setDialogOpen(true);
  }

  function handleDelete(issue: BardanaIssueHeader) {
    if (confirm(`Delete issue #${issue.voucherNo}?`)) {
      deleteMutation.mutate(issue.id);
    }
  }

  function handleConfirm(issue: BardanaIssueHeader) {
    if (!organizationId) return;
    if (confirm(`Confirm issue #${issue.voucherNo}? This will update stock balances.`)) {
      confirmMutation.mutate({
        organizationId,
        issueId: issue.id,
        confirmedBy: "current-user", // Would get from auth context
      });
    }
  }

  function handleCancel(issue: BardanaIssueHeader) {
    if (confirm(`Cancel issue #${issue.voucherNo}?`)) {
      cancelMutation.mutate(issue.id);
    }
  }

  function handleSave(formInput: BardanaIssueFormInput) {
    if (!organizationId) return;

    createMutation.mutate(
      { organizationId, formInput },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingIssue(null);
        },
      }
    );
  }

  const columns = useMemo(
    () =>
      getIssueColumns({
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
        <div className="text-muted-foreground">Loading issue records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bardana Issues
          </h1>
          <p className="text-sm text-muted-foreground">
            Issue packaging material to parties
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingIssue(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Issue
        </Button>
      </div>

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({issues.length})</TabsTrigger>
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
        <IssueFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingIssue(null);
          }}
          issue={editingIssue}
          nextVoucherNo={nextVoucherNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}
