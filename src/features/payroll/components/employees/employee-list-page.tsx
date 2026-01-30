import { useState, useMemo } from "react";
import { useOrganization } from "@/features/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search } from "lucide-react";
import { getEmployeeColumns } from "./employee-columns";
import { EmployeeFormDialog } from "./employee-form-dialog";
import { EmployeeDetailSheet } from "./employee-detail-sheet";
import {
  useEmployeeList,
  usePayPostList,
  useNextEmployeeCode,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../../hooks";
import type { Employee, EmployeeFormInput } from "../../types";

export function EmployeeListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data: employees = [] } = useEmployeeList(organizationId);
  const { data: posts = [] } = usePayPostList(organizationId);
  const { data: nextCode } = useNextEmployeeCode(organizationId);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee(organizationId);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        e.code.toLowerCase().includes(query) ||
        e.firstName.toLowerCase().includes(query) ||
        e.lastName?.toLowerCase().includes(query) ||
        e.phone?.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailSheetOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: EmployeeFormInput) => {
    if (!organizationId) return;

    try {
      if (selectedEmployee) {
        await updateMutation.mutateAsync({
          id: selectedEmployee.id,
          ...data,
        });
        console.log("Employee updated successfully");
      } else {
        await createMutation.mutateAsync({
          organizationId,
          formInput: data,
        });
        console.log("Employee created successfully");
      }
      setFormDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error(
        selectedEmployee
          ? "Failed to update employee"
          : "Failed to create employee",
        error
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteMutation.mutateAsync(selectedEmployee.id);
      console.log("Employee deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const columns = useMemo(
    () =>
      getEmployeeColumns({
        onView: handleView,
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
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">Manage employee records</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable columns={columns} data={filteredEmployees} />

      <EmployeeFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        employee={selectedEmployee}
        posts={posts}
        nextCode={nextCode}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <EmployeeDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        employee={selectedEmployee}
        onEdit={() => {
          setDetailSheetOpen(false);
          setFormDialogOpen(true);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </strong>
              ? This action cannot be undone.
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
