import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useBardanaTypeList,
  useCreateBardanaType,
  useUpdateBardanaType,
  useDeleteBardanaType,
} from "../../hooks/use-bardana-types";
import { BardanaTypeDialog } from "./bardana-type-dialog";
import { PageHeaderSkeleton, SearchSkeleton, TableSkeleton } from "@/components/loading";
import type { BardanaType, CreateBardanaTypeInput } from "../../types";
import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "../../utils/calculations";

export function BardanaTypeList() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: bardanaTypes = [], isLoading } = useBardanaTypeList(organizationId);
  const createMutation = useCreateBardanaType();
  const updateMutation = useUpdateBardanaType();
  const deleteMutation = useDeleteBardanaType(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<BardanaType | null>(null);

  const filtered = useMemo(() => {
    if (!search) return bardanaTypes;
    const lower = search.toLowerCase();
    return bardanaTypes.filter(
      (t) =>
        t.code.toLowerCase().includes(lower) ||
        t.name.toLowerCase().includes(lower) ||
        t.nameHindi?.toLowerCase().includes(lower)
    );
  }, [bardanaTypes, search]);

  function handleEdit(type: BardanaType) {
    setEditingType(type);
    setDialogOpen(true);
  }

  function handleDelete(type: BardanaType) {
    if (confirm(`Delete bardana type "${type.name}"?`)) {
      deleteMutation.mutate(type.id);
    }
  }

  function handleSave(input: CreateBardanaTypeInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingType(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingType(null);
        },
      });
    }
  }

  const columns: ColumnDef<BardanaType>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">
            {row.getValue("code")}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            {row.original.nameHindi && (
              <div className="text-xs text-muted-foreground">
                {row.original.nameHindi}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "defaultRate",
        header: "Rate",
        cell: ({ row }) => formatCurrency(row.getValue("defaultRate") ?? 0),
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => row.getValue("unit") || "bags",
      },
      {
        accessorKey: "currentStock",
        header: "Stock",
        cell: ({ row }) => formatNumber(row.original.currentStock ?? 0),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              data-testid={`bardana-types-edit-button-${row.original.id}`}
              variant="ghost"
              size="icon-xs"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              data-testid={`bardana-types-delete-button-${row.original.id}`}
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDelete(row.original)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeaderSkeleton />
        <SearchSkeleton />
        <TableSkeleton columns={6} rows={6} />
      </div>
    );
  }

  return (
    <div data-testid="bardana-types-page" className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bardana Types
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage packaging material types and rates
          </p>
        </div>
        <Button
          data-testid="bardana-types-add-button"
          onClick={() => {
            setEditingType(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Type
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          data-testid="bardana-types-search-input"
          placeholder="Search by code or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Dialog */}
      {organizationId && (
        <BardanaTypeDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingType(null);
          }}
          bardanaType={editingType}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
