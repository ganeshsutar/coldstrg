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
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import {
  usePayPostList,
  useCreatePayPost,
  useUpdatePayPost,
  useDeletePayPost,
} from "../../hooks";
import { formatCurrency } from "../../utils";
import type { PayPost } from "../../types";

export function PositionsTab() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PayPost | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  const [casualLeave, setCasualLeave] = useState(12);
  const [sickLeave, setSickLeave] = useState(6);
  const [earnedLeave, setEarnedLeave] = useState(15);

  const { data: positions = [] } = usePayPostList(organizationId);
  const createMutation = useCreatePayPost();
  const updateMutation = useUpdatePayPost();
  const deleteMutation = useDeletePayPost(organizationId);

  const filteredPositions = useMemo(() => {
    if (!searchQuery) return positions;
    const query = searchQuery.toLowerCase();
    return positions.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)
    );
  }, [positions, searchQuery]);

  const resetForm = () => {
    setName("");
    setCode("");
    setBasicSalary(0);
    setCasualLeave(12);
    setSickLeave(6);
    setEarnedLeave(15);
  };

  useEffect(() => {
    if (formDialogOpen) {
      if (selectedPosition) {
        setName(selectedPosition.name);
        setCode(selectedPosition.code);
        setBasicSalary(selectedPosition.basicSalary);
        setCasualLeave(selectedPosition.casualLeave || 12);
        setSickLeave(selectedPosition.sickLeave || 6);
        setEarnedLeave(selectedPosition.earnedLeave || 15);
      } else {
        resetForm();
      }
    }
  }, [formDialogOpen, selectedPosition]);

  const handleAdd = () => {
    setSelectedPosition(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (position: PayPost) => {
    setSelectedPosition(position);
    setFormDialogOpen(true);
  };

  const handleDelete = (position: PayPost) => {
    setSelectedPosition(position);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !name || !code) return;

    try {
      if (selectedPosition) {
        await updateMutation.mutateAsync({
          id: selectedPosition.id,
          name,
          code,
          basicSalary,
          casualLeave,
          sickLeave,
          earnedLeave,
        });
        console.log("Position updated successfully");
      } else {
        await createMutation.mutateAsync({
          organizationId,
          name,
          code,
          basicSalary,
          casualLeave,
          sickLeave,
          earnedLeave,
        });
        console.log("Position created successfully");
      }
      setFormDialogOpen(false);
      setSelectedPosition(null);
    } catch (error) {
      console.error(selectedPosition ? "Failed to update position" : "Failed to create position", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPosition) return;

    try {
      await deleteMutation.mutateAsync(selectedPosition.id);
      console.log("Position deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedPosition(null);
    } catch (error) {
      console.error("Failed to delete position", error);
    }
  };

  const columns: ColumnDef<PayPost>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Position Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "basicSalary",
      header: "Basic Salary",
      cell: ({ row }) => formatCurrency(row.getValue("basicSalary")),
    },
    {
      accessorKey: "casualLeave",
      header: "CL",
      cell: ({ row }) => row.original.casualLeave || 0,
    },
    {
      accessorKey: "sickLeave",
      header: "SL",
      cell: ({ row }) => row.original.sickLeave || 0,
    },
    {
      accessorKey: "earnedLeave",
      header: "EL",
      cell: ({ row }) => row.original.earnedLeave || 0,
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
            placeholder="Search positions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Position
        </Button>
      </div>

      <DataTable columns={columns} data={filteredPositions} />

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPosition ? "Edit Position" : "Add Position"}
            </DialogTitle>
            <DialogDescription>
              {selectedPosition
                ? "Update position details"
                : "Create a new position/designation"}
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
                  placeholder="e.g., MGR"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Position Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Manager"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary</Label>
              <Input
                id="basicSalary"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="casualLeave">Casual Leave</Label>
                <Input
                  id="casualLeave"
                  type="number"
                  value={casualLeave}
                  onChange={(e) => setCasualLeave(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sickLeave">Sick Leave</Label>
                <Input
                  id="sickLeave"
                  type="number"
                  value={sickLeave}
                  onChange={(e) => setSickLeave(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="earnedLeave">Earned Leave</Label>
                <Input
                  id="earnedLeave"
                  type="number"
                  value={earnedLeave}
                  onChange={(e) => setEarnedLeave(Number(e.target.value))}
                />
              </div>
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
                  : selectedPosition
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
            <AlertDialogTitle>Delete Position?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedPosition?.name}</strong>? This action cannot be
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
