import { useState, useMemo } from "react";
import { useOrganization } from "@/features/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Calendar } from "lucide-react";
import { getDailyWageColumns } from "./daily-wage-columns";
import { DailyWageFormDialog } from "./daily-wage-form-dialog";
import {
  useDWageList,
  useCreateDWage,
  useUpdateDWage,
  useDeleteDWage,
} from "../../hooks";
import { formatCurrency } from "../../utils";
import type { DWage, DWageFormInput } from "../../types";

export function DailyWagesPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWage, setSelectedWage] = useState<DWage | null>(null);

  const { data: wages = [] } = useDWageList(organizationId);
  const createMutation = useCreateDWage();
  const updateMutation = useUpdateDWage();
  const deleteMutation = useDeleteDWage(organizationId);

  // Filter by month
  const monthFilteredWages = useMemo(() => {
    if (!selectedMonth) return wages;
    return wages.filter((w) => w.date.startsWith(selectedMonth));
  }, [wages, selectedMonth]);

  const filteredWages = useMemo(() => {
    if (!searchQuery) return monthFilteredWages;
    const query = searchQuery.toLowerCase();
    return monthFilteredWages.filter(
      (w) =>
        w.workerName.toLowerCase().includes(query) ||
        w.workType?.toLowerCase().includes(query)
    );
  }, [monthFilteredWages, searchQuery]);

  const stats = useMemo(() => {
    const total = monthFilteredWages.reduce((sum, w) => sum + (w.netAmount || 0), 0);
    const paid = monthFilteredWages
      .filter((w) => w.isPaid)
      .reduce((sum, w) => sum + (w.netAmount || 0), 0);
    const pending = total - paid;
    const workers = new Set(monthFilteredWages.map((w) => w.workerName)).size;

    return { total, paid, pending, workers, entries: monthFilteredWages.length };
  }, [monthFilteredWages]);

  const handleAdd = () => {
    setSelectedWage(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (wage: DWage) => {
    setSelectedWage(wage);
    setFormDialogOpen(true);
  };

  const handleDelete = (wage: DWage) => {
    setSelectedWage(wage);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: DWageFormInput) => {
    if (!organizationId) return;

    try {
      if (selectedWage) {
        await updateMutation.mutateAsync({
          id: selectedWage.id,
          ...data,
        });
        console.log("Daily wage updated successfully");
      } else {
        await createMutation.mutateAsync({
          organizationId,
          formInput: data,
        });
        console.log("Daily wage created successfully");
      }
      setFormDialogOpen(false);
      setSelectedWage(null);
    } catch (error) {
      console.error(
        selectedWage ? "Failed to update daily wage" : "Failed to create daily wage",
        error
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedWage || !organizationId) return;

    try {
      await deleteMutation.mutateAsync(selectedWage.id);
      console.log("Daily wage deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedWage(null);
    } catch (error) {
      console.error("Failed to delete daily wage", error);
    }
  };

  const columns = useMemo(
    () =>
      getDailyWageColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Wages</h1>
          <p className="text-sm text-muted-foreground">
            Record and manage daily wage payments
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paid)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(stats.pending)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.entries}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by worker name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <DataTable columns={columns} data={filteredWages} />

      <DailyWageFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        wage={selectedWage}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the daily wage entry for{" "}
              <strong>{selectedWage?.workerName}</strong> on{" "}
              <strong>{selectedWage?.date}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
