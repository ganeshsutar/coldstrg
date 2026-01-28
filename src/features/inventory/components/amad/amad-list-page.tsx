import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import { useAmadList, useCreateAmad, useUpdateAmad, useDeleteAmad } from "../../hooks/use-amad";
import { getNextAmadNo } from "../../api/amad";
import { getAmadColumns } from "./amad-columns";
import { AmadKpiCards } from "./amad-kpi-cards";
import { AmadChart } from "./amad-chart";
import { AmadTabFilters } from "./amad-tab-filters";
import { AmadFormDialog } from "./amad-form-dialog";
import type { Amad, AmadFilterTab, CreateAmadInput } from "../../types";

export function AmadListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;
  const navigate = useNavigate();

  const { data: amadList = [], isLoading } = useAmadList(organizationId);
  const createMutation = useCreateAmad();
  const updateMutation = useUpdateAmad();
  const deleteMutation = useDeleteAmad(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AmadFilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAmad, setEditingAmad] = useState<Amad | null>(null);
  const [nextAmadNo, setNextAmadNo] = useState(1);

  useEffect(() => {
    if (dialogOpen && !editingAmad && organizationId) {
      getNextAmadNo(organizationId).then(setNextAmadNo);
    }
  }, [dialogOpen, editingAmad, organizationId]);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "in-stock":
        return amadList.filter((a) => a.status === "IN_STOCK");
      case "partial":
        return amadList.filter((a) => a.status === "PARTIAL_DISPATCH");
      case "dispatched":
        return amadList.filter((a) => a.status === "DISPATCHED");
      case "pending":
        return amadList.filter((a) => a.status === "PENDING");
      default:
        return amadList;
    }
  }, [amadList, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (a) =>
        a.partyName.toLowerCase().includes(lower) ||
        a.commodityName?.toLowerCase().includes(lower) ||
        String(a.amadNo).includes(lower)
    );
  }, [tabFiltered, search]);

  function handleView(amad: Amad) {
    navigate({ to: "/inventory/amad/$amadId", params: { amadId: amad.id } });
  }

  function handleEdit(amad: Amad) {
    setEditingAmad(amad);
    setDialogOpen(true);
  }

  function handleDelete(amad: Amad) {
    if (confirm(`Delete Amad #${amad.amadNo}?`)) {
      deleteMutation.mutate(amad.id);
    }
  }

  function handleSave(input: CreateAmadInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingAmad(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingAmad(null);
        },
      });
    }
  }

  const columns = useMemo(
    () =>
      getAmadColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading amad records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Amad (Goods Receipt)
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming goods and storage records
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAmad(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Amad
        </Button>
      </div>

      {/* KPI Cards */}
      <AmadKpiCards amadList={amadList} />

      {/* Chart */}
      <AmadChart amadList={amadList} />

      {/* Tab Filters */}
      <AmadTabFilters
        amadList={amadList}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party, commodity, or amad #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <AmadFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingAmad(null);
          }}
          amad={editingAmad}
          nextAmadNo={nextAmadNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
