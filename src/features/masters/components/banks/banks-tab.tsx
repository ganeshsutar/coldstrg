import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { getBankColumns } from "./bank-columns";
import { BankDialog } from "./bank-dialog";
import {
  useBanks,
  useCreateBank,
  useUpdateBank,
  useDeleteBank,
} from "../../hooks/use-banks";
import type { Bank, CreateBankInput } from "../../types";

interface BanksTabProps {
  organizationId: string;
}

export function BanksTab({ organizationId }: BanksTabProps) {
  const { data: banks = [], isLoading } = useBanks(organizationId);
  const createMutation = useCreateBank();
  const updateMutation = useUpdateBank();
  const deleteMutation = useDeleteBank(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  const nextCode = useMemo(() => {
    const codes = banks
      .map((b) => parseInt(b.code, 10))
      .filter((n) => !isNaN(n));
    const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
    return String(maxCode + 1).padStart(3, "0");
  }, [banks]);

  const filtered = useMemo(() => {
    if (!search) return banks;
    const lower = search.toLowerCase();
    return banks.filter(
      (b) =>
        b.name.toLowerCase().includes(lower) ||
        b.code.toLowerCase().includes(lower) ||
        b.ifscPattern?.toLowerCase().includes(lower)
    );
  }, [banks, search]);

  function handleEdit(bank: Bank) {
    setEditingBank(bank);
    setDialogOpen(true);
  }

  function handleDelete(bank: Bank) {
    if (confirm(`Delete bank "${bank.name}"?`)) {
      deleteMutation.mutate(bank.id);
    }
  }

  function handleSave(input: CreateBankInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingBank(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingBank(null);
        },
      });
    }
  }

  const columns = useMemo(
    () => getBankColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading banks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditingBank(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Bank
        </Button>
      </div>

      <DataTable columns={columns} data={filtered} />

      <BankDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingBank(null);
        }}
        bank={editingBank}
        nextCode={nextCode}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
