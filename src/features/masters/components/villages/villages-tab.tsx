import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VillageTree } from "./village-tree";
import { VillageDialog } from "./village-dialog";
import {
  useVillages,
  useCreateVillage,
  useUpdateVillage,
  useDeleteVillage,
} from "../../hooks/use-villages";
import { getNextVillageCode } from "../../api/villages";
import type { Village, CreateVillageInput } from "../../types";

interface VillagesTabProps {
  organizationId: string;
}

export function VillagesTab({ organizationId }: VillagesTabProps) {
  const { data: villages = [], isLoading } = useVillages(organizationId);
  const createMutation = useCreateVillage();
  const updateMutation = useUpdateVillage();
  const deleteMutation = useDeleteVillage(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);
  const [nextCode, setNextCode] = useState("001");

  useEffect(() => {
    if (dialogOpen && !editingVillage) {
      getNextVillageCode(organizationId).then(setNextCode);
    }
  }, [dialogOpen, editingVillage, organizationId]);

  const filtered = useMemo(() => {
    if (!search) return villages;
    const lower = search.toLowerCase();
    return villages.filter(
      (v) =>
        v.name.toLowerCase().includes(lower) ||
        v.code.toLowerCase().includes(lower) ||
        v.nameHindi?.toLowerCase().includes(lower) ||
        v.stateName.toLowerCase().includes(lower) ||
        v.districtName.toLowerCase().includes(lower)
    );
  }, [villages, search]);

  function handleEdit(village: Village) {
    setEditingVillage(village);
    setDialogOpen(true);
  }

  function handleDelete(village: Village) {
    if (confirm(`Delete village "${village.name}"?`)) {
      deleteMutation.mutate(village.id);
    }
  }

  function handleSave(input: CreateVillageInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingVillage(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingVillage(null);
        },
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading villages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search villages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditingVillage(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Village
        </Button>
      </div>

      <div className="rounded-md border p-2">
        <VillageTree
          villages={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <VillageDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingVillage(null);
        }}
        village={editingVillage}
        nextCode={nextCode}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
