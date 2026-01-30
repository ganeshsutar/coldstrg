import { useState, useMemo } from "react";
import { useOrganization } from "@/features/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  usePayAllowanceList,
  useCreatePayAllowance,
  useUpdatePayAllowance,
  useDeletePayAllowance,
} from "../../hooks";
import { formatCurrency } from "../../utils";
import type { PayAllowance, PayComponentTypeValue } from "../../types";

interface AllowanceFormProps {
  allowance: PayAllowance | null;
  onSubmit: (data: { code: string; name: string; componentType: PayComponentTypeValue; defaultValue: number; isTaxable: boolean }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function AllowanceForm({ allowance, onSubmit, onCancel, isPending }: AllowanceFormProps) {
  const [code, setCode] = useState(allowance?.code ?? "");
  const [name, setName] = useState(allowance?.name ?? "");
  const [componentType, setComponentType] = useState<PayComponentTypeValue>(allowance?.componentType ?? "FIXED");
  const [defaultValue, setDefaultValue] = useState(allowance?.defaultValue ?? 0);
  const [isTaxable, setIsTaxable] = useState(allowance?.isTaxable ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    onSubmit({ code, name, componentType, defaultValue, isTaxable });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g., HRA"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Allowance Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., House Rent Allowance"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="componentType">Type</Label>
          <Select
            value={componentType}
            onValueChange={(value) => setComponentType(value as PayComponentTypeValue)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">Fixed Amount</SelectItem>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="defaultValue">
            Default {componentType === "PERCENTAGE" ? "%" : "Amount"}
          </Label>
          <Input
            id="defaultValue"
            type="number"
            value={defaultValue}
            onChange={(e) => setDefaultValue(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isTaxable"
          checked={isTaxable}
          onCheckedChange={(checked) => setIsTaxable(checked === true)}
        />
        <Label htmlFor="isTaxable" className="text-sm font-normal">
          This allowance is taxable
        </Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : allowance ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AllowancesTab() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAllowance, setSelectedAllowance] = useState<PayAllowance | null>(null);

  const { data: allowances = [] } = usePayAllowanceList(organizationId);
  const createMutation = useCreatePayAllowance();
  const updateMutation = useUpdatePayAllowance();
  const deleteMutation = useDeletePayAllowance(organizationId);

  const filteredAllowances = useMemo(() => {
    if (!searchQuery) return allowances;
    const query = searchQuery.toLowerCase();
    return allowances.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query)
    );
  }, [allowances, searchQuery]);

  const handleAdd = () => {
    setSelectedAllowance(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (allowance: PayAllowance) => {
    setSelectedAllowance(allowance);
    setFormDialogOpen(true);
  };

  const handleDelete = (allowance: PayAllowance) => {
    setSelectedAllowance(allowance);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: { code: string; name: string; componentType: PayComponentTypeValue; defaultValue: number; isTaxable: boolean }) => {
    if (!organizationId) return;

    try {
      if (selectedAllowance) {
        await updateMutation.mutateAsync({
          id: selectedAllowance.id,
          ...data,
        });
        console.log("Allowance updated successfully");
      } else {
        await createMutation.mutateAsync({
          organizationId,
          ...data,
        });
        console.log("Allowance created successfully");
      }
      setFormDialogOpen(false);
      setSelectedAllowance(null);
    } catch (error) {
      console.error(selectedAllowance ? "Failed to update allowance" : "Failed to create allowance", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAllowance) return;

    try {
      await deleteMutation.mutateAsync(selectedAllowance.id);
      console.log("Allowance deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedAllowance(null);
    } catch (error) {
      console.error("Failed to delete allowance", error);
    }
  };

  const columns: ColumnDef<PayAllowance>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Allowance Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "componentType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.componentType === "FIXED" ? "default" : "secondary"}>
          {row.original.componentType}
        </Badge>
      ),
    },
    {
      accessorKey: "defaultValue",
      header: "Default Value",
      cell: ({ row }) =>
        row.original.componentType === "PERCENTAGE"
          ? `${row.original.defaultValue}%`
          : formatCurrency(row.original.defaultValue),
    },
    {
      accessorKey: "isTaxable",
      header: "Taxable",
      cell: ({ row }) => (
        <Badge variant={row.original.isTaxable ? "outline" : "secondary"}>
          {row.original.isTaxable ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search allowances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Allowance
        </Button>
      </div>

      <DataTable columns={columns} data={filteredAllowances} />

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAllowance ? "Edit Allowance" : "Add Allowance"}
            </DialogTitle>
            <DialogDescription>
              {selectedAllowance
                ? "Update allowance details"
                : "Create a new allowance type"}
            </DialogDescription>
          </DialogHeader>

          {formDialogOpen && (
            <AllowanceForm
              allowance={selectedAllowance}
              onSubmit={handleFormSubmit}
              onCancel={() => setFormDialogOpen(false)}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Allowance?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedAllowance?.name}</strong>? This action cannot be
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
