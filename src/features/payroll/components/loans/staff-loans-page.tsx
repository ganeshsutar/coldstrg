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
import { Plus, Search } from "lucide-react";
import { getLoanColumns } from "./loan-columns";
import { LoanFormDialog } from "./loan-form-dialog";
import {
  useActiveEmployees,
  usePayLoanList,
  usePayLoanStats,
  useCreatePayLoan,
  useCancelPayLoan,
} from "../../hooks";
import { formatCurrency } from "../../utils";
import type { PayLoan, PayLoanFormInput } from "../../types";

export function StaffLoansPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<PayLoan | null>(null);

  const { data: employees = [] } = useActiveEmployees(organizationId);
  const { data: loans = [] } = usePayLoanList(organizationId);
  const { data: stats } = usePayLoanStats(organizationId);

  const createMutation = useCreatePayLoan();
  const cancelMutation = useCancelPayLoan();

  const filteredLoans = useMemo(() => {
    if (!searchQuery) return loans;
    const query = searchQuery.toLowerCase();
    return loans.filter(
      (l) =>
        l.employeeName?.toLowerCase().includes(query) ||
        l.employeeCode?.toLowerCase().includes(query) ||
        String(l.loanNo).includes(query)
    );
  }, [loans, searchQuery]);

  const handleView = (loan: PayLoan) => {
    // Could open a detail sheet
    console.log("View loan:", loan);
  };

  const handleCancel = (loan: PayLoan) => {
    setSelectedLoan(loan);
    setCancelDialogOpen(true);
  };

  const handleFormSubmit = async (data: PayLoanFormInput) => {
    if (!organizationId) return;

    try {
      await createMutation.mutateAsync({
        organizationId,
        formInput: data,
      });
      console.log("Loan created successfully");
      setFormDialogOpen(false);
    } catch (error) {
      console.error("Failed to create loan", error);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedLoan || !organizationId) return;

    try {
      await cancelMutation.mutateAsync({
        organizationId,
        loanId: selectedLoan.id,
      });
      console.log("Loan cancelled");
      setCancelDialogOpen(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error("Failed to cancel loan", error);
    }
  };

  const columns = useMemo(
    () =>
      getLoanColumns({
        onView: handleView,
        onCancel: handleCancel,
      }),
    []
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff Loans</h1>
          <p className="text-sm text-muted-foreground">Manage employee loans and EMIs</p>
        </div>
        <Button onClick={() => setFormDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Loan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Disbursed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalDisbursed || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(stats?.totalOutstanding || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeLoans || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.completedLoans || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search loans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable columns={columns} data={filteredLoans} />

      <LoanFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        employees={employees}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending}
      />

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Loan?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel loan{" "}
              <strong>LN-{selectedLoan?.loanNo}</strong> for{" "}
              <strong>{selectedLoan?.employeeName}</strong>? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, cancel loan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
