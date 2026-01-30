import { useState, useMemo, useEffect } from "react";
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
  usePayDeductionList,
  useCreatePayDeduction,
  useUpdatePayDeduction,
  useDeletePayDeduction,
} from "../../hooks";
import { formatCurrency } from "../../utils";
import type { PayDeduction, PayComponentTypeValue } from "../../types";

export function DeductionsTab() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<PayDeduction | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [componentType, setComponentType] = useState<PayComponentTypeValue>("FIXED");
  const [defaultValue, setDefaultValue] = useState(0);
  const [isStatutory, setIsStatutory] = useState(false);

  const { data: deductions = [] } = usePayDeductionList(organizationId);
  const createMutation = useCreatePayDeduction();
  const updateMutation = useUpdatePayDeduction();
  const deleteMutation = useDeletePayDeduction(organizationId);

  const filteredDeductions = useMemo(() => {
    if (!searchQuery) return deductions;
    const query = searchQuery.toLowerCase();
    return deductions.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query)
    );
  }, [deductions, searchQuery]);

  const resetForm = () => {
    setCode("");
    setName("");
    setComponentType("FIXED");
    setDefaultValue(0);
    setIsStatutory(false);
  };

  useEffect(() => {
    if (formDialogOpen) {
      if (selectedDeduction) {
        setCode(selectedDeduction.code);
        setName(selectedDeduction.name);
        setComponentType(selectedDeduction.componentType);
        setDefaultValue(selectedDeduction.defaultValue);
        setIsStatutory(selectedDeduction.isStatutory);
      } else {
        resetForm();
      }
    }
  }, [formDialogOpen, selectedDeduction]);

  const handleAdd = () => {
    setSelectedDeduction(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (deduction: PayDeduction) => {
    setSelectedDeduction(deduction);
    setFormDialogOpen(true);
  };

  const handleDelete = (deduction: PayDeduction) => {
    setSelectedDeduction(deduction);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !name || !code) return;

    try {
      if (selectedDeduction) {
        await updateMutation.mutateAsync({
          id: selectedDeduction.id,
          code,
          name,
          componentType,
          defaultValue,
          isStatutory,
        });
        console.log("Deduction updated successfully");
      } else {
        await createMutation.mutateAsync({
          organizationId,
          code,
          name,
          componentType,
          defaultValue,
          isStatutory,
        });
        console.log("Deduction created successfully");
      }
      setFormDialogOpen(false);
      setSelectedDeduction(null);
    } catch (error) {
      console.error(selectedDeduction ? "Failed to update deduction" : "Failed to create deduction", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeduction) return;

    try {
      await deleteMutation.mutateAsync(selectedDeduction.id);
      console.log("Deduction deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedDeduction(null);
    } catch (error) {
      console.error("Failed to delete deduction", error);
    }
  };

  const columns: ColumnDef<PayDeduction>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Deduction Name",
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
      accessorKey: "isStatutory",
      header: "Statutory",
      cell: ({ row }) => (
        <Badge variant={row.original.isStatutory ? "default" : "secondary"}>
          {row.original.isStatutory ? "Yes" : "No"}
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
            placeholder="Search deductions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deduction
        </Button>
      </div>

      <DataTable columns={columns} data={filteredDeductions} />

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDeduction ? "Edit Deduction" : "Add Deduction"}
            </DialogTitle>
            <DialogDescription>
              {selectedDeduction
                ? "Update deduction details"
                : "Create a new deduction type"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., PF"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Deduction Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Provident Fund"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
                id="isStatutory"
                checked={isStatutory}
                onCheckedChange={(checked) => setIsStatutory(checked === true)}
              />
              <Label htmlFor="isStatutory" className="text-sm font-normal">
                This is a statutory deduction (PF, ESI, etc.)
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : selectedDeduction
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deduction?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedDeduction?.name}</strong>? This action cannot be
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
