import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { getChamberColumns } from "./chamber-columns";
import { ChamberDialog } from "./chamber-dialog";
import { FloorConfigDialog } from "./floor-config-dialog";
import {
  useChambers,
  useCreateChamber,
  useUpdateChamber,
  useDeleteChamber,
} from "../../hooks/use-chambers";
import {
  useCreateChamberFloor,
  useUpdateChamberFloor,
  useDeleteChamberFloor,
} from "../../hooks/use-chamber-floors";
import { getNextChamberCode, getNextRoomNumber } from "../../api/chambers";
import type { Chamber, CreateChamberInput, CreateChamberFloorInput } from "../../types";

interface ChambersTabProps {
  organizationId: string;
}

export function ChambersTab({ organizationId }: ChambersTabProps) {
  const { data: chambers = [], isLoading } = useChambers(organizationId);
  const createMutation = useCreateChamber();
  const updateMutation = useUpdateChamber();
  const deleteMutation = useDeleteChamber(organizationId);
  const createFloorMutation = useCreateChamberFloor();
  const updateFloorMutation = useUpdateChamberFloor();
  const deleteFloorMutation = useDeleteChamberFloor(organizationId, undefined);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [floorDialogOpen, setFloorDialogOpen] = useState(false);
  const [editingChamber, setEditingChamber] = useState<Chamber | null>(null);
  const [configuringChamber, setConfiguringChamber] = useState<Chamber | null>(null);
  const [nextCode, setNextCode] = useState("01");
  const [nextRoomNumber, setNextRoomNumber] = useState(1);

  useEffect(() => {
    if (dialogOpen && !editingChamber) {
      Promise.all([
        getNextChamberCode(organizationId),
        getNextRoomNumber(organizationId),
      ]).then(([code, roomNum]) => {
        setNextCode(code);
        setNextRoomNumber(roomNum);
      });
    }
  }, [dialogOpen, editingChamber, organizationId]);

  const filtered = useMemo(() => {
    if (!search) return chambers;
    const lower = search.toLowerCase();
    return chambers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower) ||
        c.nameHindi?.toLowerCase().includes(lower)
    );
  }, [chambers, search]);

  function handleEdit(chamber: Chamber) {
    setEditingChamber(chamber);
    setDialogOpen(true);
  }

  function handleDelete(chamber: Chamber) {
    if (confirm(`Delete chamber "${chamber.name}"?`)) {
      deleteMutation.mutate(chamber.id);
    }
  }

  function handleConfigureFloors(chamber: Chamber) {
    setConfiguringChamber(chamber);
    setFloorDialogOpen(true);
  }

  function handleSave(input: CreateChamberInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingChamber(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingChamber(null);
        },
      });
    }
  }

  function handleSaveFloors(floors: (CreateChamberFloorInput & { id?: string })[]) {
    const promises = floors.map((floor) => {
      if (floor.id) {
        return updateFloorMutation.mutateAsync({ ...floor, id: floor.id });
      }
      return createFloorMutation.mutateAsync(floor);
    });

    Promise.all(promises).then(() => {
      setFloorDialogOpen(false);
      setConfiguringChamber(null);
    });
  }

  function handleDeleteFloor(id: string) {
    deleteFloorMutation.mutate(id);
  }

  const columns = useMemo(
    () =>
      getChamberColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onConfigureFloors: handleConfigureFloors,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading chambers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="chambers-page">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chambers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="chambers-search-input"
          />
        </div>
        <Button
          onClick={() => {
            setEditingChamber(null);
            setDialogOpen(true);
          }}
          data-testid="new-chamber-button"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Chamber
        </Button>
      </div>

      <DataTable columns={columns} data={filtered} />

      <ChamberDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingChamber(null);
        }}
        chamber={editingChamber}
        nextCode={nextCode}
        nextRoomNumber={nextRoomNumber}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <FloorConfigDialog
        open={floorDialogOpen}
        onOpenChange={(open) => {
          setFloorDialogOpen(open);
          if (!open) setConfiguringChamber(null);
        }}
        chamber={configuringChamber}
        organizationId={organizationId}
        onSave={handleSaveFloors}
        onDelete={handleDeleteFloor}
        isPending={createFloorMutation.isPending || updateFloorMutation.isPending}
      />
    </div>
  );
}
