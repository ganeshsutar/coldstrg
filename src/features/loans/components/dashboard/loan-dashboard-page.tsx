import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/features/organizations";
import { useAdvanceList } from "../../hooks/use-advances";
import { useLoanList } from "../../hooks/use-loan-amounts";
import { LoanKpiCards } from "./loan-kpi-cards";
import { LoanListTable } from "./loan-list-table";
import { AdvanceFormDialog } from "../advance/advance-form-dialog";
import { LagFormDialog } from "../loan-against-goods/lag-form-dialog";
import { PageHeaderSkeleton, MetricCardSkeleton, TableSkeleton } from "@/components/loading";
import type { Advance, LoanAmount } from "../../types";

export function LoanDashboardPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: advances = [], isLoading: advancesLoading } =
    useAdvanceList(organizationId);
  const { data: loans = [], isLoading: loansLoading } =
    useLoanList(organizationId);

  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [, setSelectedAdvance] = useState<Advance | null>(null);
  const [, setSelectedLoan] = useState<LoanAmount | null>(null);

  const isLoading = advancesLoading || loansLoading;

  function handleViewAdvance(advance: Advance) {
    setSelectedAdvance(advance);
    // Could open a detail view
    console.log("View advance:", advance);
  }

  function handleViewLoan(loan: LoanAmount) {
    setSelectedLoan(loan);
    // Could open a detail view
    console.log("View loan:", loan);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeaderSkeleton />
        {/* KPI Cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <TableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Loans & Advances
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage pre-season advances and loans against stored goods
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAdvanceDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Advance
          </Button>
          <Button onClick={() => setLoanDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Loan
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <LoanKpiCards advances={advances} loans={loans} interestAccrued={0} />

      {/* Combined List */}
      <LoanListTable
        advances={advances}
        loans={loans}
        onViewAdvance={handleViewAdvance}
        onViewLoan={handleViewLoan}
      />

      {/* Advance Form Dialog */}
      {organizationId && (
        <AdvanceFormDialog
          open={advanceDialogOpen}
          onOpenChange={setAdvanceDialogOpen}
          organizationId={organizationId}
        />
      )}

      {/* Loan Form Dialog */}
      {organizationId && (
        <LagFormDialog
          open={loanDialogOpen}
          onOpenChange={setLoanDialogOpen}
          organizationId={organizationId}
        />
      )}
    </div>
  );
}
