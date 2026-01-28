import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { getCommodityColumns } from "./commodity-columns";
import { CommodityDialog } from "./commodity-dialog";
import {
  useCommodities,
  useCreateCommodity,
  useUpdateCommodity,
  useDeleteCommodity,
} from "../../hooks/use-commodities";
import { getNextCommodityCode } from "../../api/commodities";
import type { Commodity, CreateCommodityInput } from "../../types";
import { useEffect } from "react";

interface CommoditiesTabProps {
  organizationId: string;
}

export function CommoditiesTab({ organizationId }: CommoditiesTabProps) {
  const { data: commodities = [], isLoading } = useCommodities(organizationId);
  const createMutation = useCreateCommodity();
  const updateMutation = useUpdateCommodity();
  const deleteMutation = useDeleteCommodity(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(
    null
  );
  const [nextCode, setNextCode] = useState("001");

  useEffect(() => {
    if (dialogOpen && !editingCommodity) {
      getNextCommodityCode(organizationId).then(setNextCode);
    }
  }, [dialogOpen, editingCommodity, organizationId]);

  const filtered = useMemo(() => {
    if (!search) return commodities;
    const lower = search.toLowerCase();
    return commodities.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower) ||
        c.nameHindi?.toLowerCase().includes(lower)
    );
  }, [commodities, search]);

  function handleEdit(commodity: Commodity) {
    setEditingCommodity(commodity);
    setDialogOpen(true);
  }

  function handleDelete(commodity: Commodity) {
    if (confirm(`Delete commodity "${commodity.name}"?`)) {
      deleteMutation.mutate(commodity.id);
    }
  }

  function handleSave(input: CreateCommodityInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingCommodity(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingCommodity(null);
        },
      });
    }
  }

  const columns = useMemo(
    () => getCommodityColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading commodities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commodities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditingCommodity(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Commodity
        </Button>
      </div>

      <DataTable columns={columns} data={filtered} />

      <CommodityDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingCommodity(null);
        }}
        commodity={editingCommodity}
        nextCode={nextCode}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
