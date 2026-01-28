import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import { useRentList, useCreateRent, useUpdateRent, useDeleteRent } from "../../hooks/use-rent";
import { getNextRentSerialNo } from "../../api/rent";
import { getRentColumns } from "./rent-columns";
import { RentFormDialog } from "./rent-form-dialog";
import { PackageOpen, IndianRupee } from "lucide-react";
import type { Rent, CreateRentInput } from "../../types";

export function RentListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: rentList = [], isLoading } = useRentList(organizationId);
  const createMutation = useCreateRent();
  const updateMutation = useUpdateRent();
  const deleteMutation = useDeleteRent(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRent, setEditingRent] = useState<Rent | null>(null);
  const [nextSerialNo, setNextSerialNo] = useState(1);

  useEffect(() => {
    if (dialogOpen && !editingRent && organizationId) {
      getNextRentSerialNo(organizationId).then(setNextSerialNo);
    }
  }, [dialogOpen, editingRent, organizationId]);

  const filtered = useMemo(() => {
    if (!search) return rentList;
    const lower = search.toLowerCase();
    return rentList.filter(
      (r) =>
        r.partyName.toLowerCase().includes(lower) ||
        r.receiverName?.toLowerCase().includes(lower) ||
        String(r.serialNo).includes(lower)
    );
  }, [rentList, search]);

  // KPI metrics
  const kpi = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayDispatches = rentList.filter((r) => r.date === today).length;
    const thisMonthRevenue = rentList
      .filter((r) => {
        if (!r.date) return false;
        const d = new Date(r.date);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, r) => sum + (r.billAmount ?? 0), 0);
    return { todayDispatches, thisMonthRevenue };
  }, [rentList]);

  function handleEdit(rent: Rent) {
    setEditingRent(rent);
    setDialogOpen(true);
  }

  function handleDelete(rent: Rent) {
    if (confirm(`Delete dispatch #${rent.serialNo}?`)) {
      deleteMutation.mutate(rent.id);
    }
  }

  function handleSave(input: CreateRentInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingRent(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingRent(null);
        },
      });
    }
  }

  const columns = useMemo(
    () => getRentColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dispatch records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Nikasi (Dispatch)
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage goods dispatch and rent billing
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRent(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Dispatch
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
          <CardHeader className="relative">
            <CardDescription>Today's Dispatch</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {kpi.todayDispatches}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PackageOpen className="h-4 w-4" />
              <span>Dispatches today</span>
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
          <CardHeader className="relative">
            <CardDescription>This Month Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {`\u20B9${kpi.thisMonthRevenue.toLocaleString("en-IN")}`}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              <span>Billing revenue</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party, receiver, or serial #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <RentFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingRent(null);
          }}
          rent={editingRent}
          nextSerialNo={nextSerialNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
