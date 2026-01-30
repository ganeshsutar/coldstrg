import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useLoanList,
  useCloseLoan,
  useRecordRepayment,
} from "../../hooks/use-loan-amounts";
import { getLagColumns } from "./lag-columns";
import { LagFormDialog } from "./lag-form-dialog";
import { RepaymentDialog } from "./repayment-dialog";
import type { LoanAmount } from "../../types";

type FilterTab = "all" | "active" | "partial" | "overdue" | "closed";

export function LagListPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: loans = [], isLoading } = useLoanList(organizationId);
  const closeMutation = useCloseLoan(organizationId);
  const repaymentMutation = useRecordRepayment();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanAmount | null>(null);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "active":
        return loans.filter((l) => l.status === "ACTIVE");
      case "partial":
        return loans.filter((l) => l.status === "PARTIAL_REPAID");
      case "overdue":
        return loans.filter((l) => l.status === "OVERDUE");
      case "closed":
        return loans.filter((l) => l.status === "CLOSED");
      default:
        return loans;
    }
  }, [loans, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (l) =>
        l.partyName?.toLowerCase().includes(lower) ||
        String(l.loanNo).includes(lower) ||
        String(l.amadNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const active = loans.filter((l) => l.status === "ACTIVE").length;
    const partial = loans.filter((l) => l.status === "PARTIAL_REPAID").length;
    const overdue = loans.filter((l) => l.status === "OVERDUE").length;
    const closed = loans.filter((l) => l.status === "CLOSED").length;
    return { active, partial, overdue, closed };
  }, [loans]);

  function handleView(loan: LoanAmount) {
    console.log("View loan:", loan);
  }

  function handleRecordPayment(loan: LoanAmount) {
    setSelectedLoan(loan);
    setRepaymentDialogOpen(true);
  }

  function handleClose(loan: LoanAmount) {
    if (
      confirm(
        `Close loan #${loan.loanNo}? Outstanding balance: ${loan.outstandingBalance}`
      )
    ) {
      closeMutation.mutate(loan.id);
    }
  }

  function handleRepayment(loanId: string, amount: number) {
    if (!organizationId) return;
    repaymentMutation.mutate(
      { organizationId, loanId, amount },
      {
        onSuccess: () => {
          setRepaymentDialogOpen(false);
          setSelectedLoan(null);
        },
      }
    );
  }

  const columns = useMemo(
    () =>
      getLagColumns({
        onView: handleView,
        onRecordPayment: handleRecordPayment,
        onClose: handleClose,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [organizationId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading loans...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Loans Against Goods
          </h1>
          <p className="text-sm text-muted-foreground">
            Loans secured by stored commodities
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Loan
        </Button>
      </div>

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({loans.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
          <TabsTrigger value="partial">Partial ({counts.partial})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({counts.overdue})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party, loan # or amad #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Form Dialog */}
      {organizationId && (
        <LagFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          organizationId={organizationId}
        />
      )}

      {/* Repayment Dialog */}
      {selectedLoan && (
        <RepaymentDialog
          open={repaymentDialogOpen}
          onOpenChange={(open) => {
            setRepaymentDialogOpen(open);
            if (!open) setSelectedLoan(null);
          }}
          loan={selectedLoan}
          onSubmit={handleRepayment}
          isPending={repaymentMutation.isPending}
        />
      )}
    </div>
  );
}
