import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import {
  useAccountList,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "../../hooks/use-accounts";
import { getNextAccountCode } from "../../api/accounts";
import { PartyKpiCards } from "./party-kpi-cards";
import { getPartyColumns } from "./party-columns";
import { PartyFormDialog } from "./party-form-dialog";
import type { Account, PartyFilterTab, CreateAccountInput } from "../../types";

export function PartyLedgerPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: accounts = [], isLoading } = useAccountList(organizationId);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<PartyFilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [nextCode, setNextCode] = useState("P0001");

  // Get only party accounts (accounts with partyType set, not system accounts)
  const partyAccounts = useMemo(() => {
    return accounts.filter(
      (a) => a.accountType === "ACCOUNT" && a.partyType && a.isActive !== false
    );
  }, [accounts]);

  useEffect(() => {
    if (dialogOpen && !editingAccount && organizationId) {
      getNextAccountCode(organizationId, "P").then(setNextCode);
    }
  }, [dialogOpen, editingAccount, organizationId]);

  // Filter by tab (debtors/creditors)
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "debtors":
        return partyAccounts.filter((a) => (a.balance ?? 0) > 0);
      case "creditors":
        return partyAccounts.filter((a) => (a.balance ?? 0) < 0);
      default:
        return partyAccounts;
    }
  }, [partyAccounts, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (a) =>
        a.name.toLowerCase().includes(lower) ||
        a.nameHindi?.toLowerCase().includes(lower) ||
        a.code.toLowerCase().includes(lower) ||
        a.phone?.includes(lower) ||
        a.city?.toLowerCase().includes(lower)
    );
  }, [tabFiltered, search]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: partyAccounts.length,
      debtors: partyAccounts.filter((a) => (a.balance ?? 0) > 0).length,
      creditors: partyAccounts.filter((a) => (a.balance ?? 0) < 0).length,
    };
  }, [partyAccounts]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleView(_account: Account) {
    // Row expansion is handled by DataTable's built-in expansion feature
  }

  function handleEdit(account: Account) {
    setEditingAccount(account);
    setDialogOpen(true);
  }

  function handleDelete(account: Account) {
    if (confirm(`Delete party "${account.name}"?`)) {
      deleteMutation.mutate(account.id);
    }
  }

  function handleSave(input: CreateAccountInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingAccount(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingAccount(null);
        },
      });
    }
  }

  const columns = useMemo(
    () =>
      getPartyColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading party records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="party-ledger-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Party Ledger</h1>
          <p className="text-sm text-muted-foreground">
            {partyAccounts.length} parties registered
          </p>
        </div>
        <Button
          data-testid="add-party-button"
          onClick={() => {
            setEditingAccount(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Party
        </Button>
      </div>

      {/* KPI Cards */}
      <PartyKpiCards accounts={partyAccounts} />

      {/* Tab Filters */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PartyFilterTab)}>
        <TabsList>
          <TabsTrigger value="all" data-testid="party-tab-all">
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="debtors" data-testid="party-tab-debtors">
            Debtors ({tabCounts.debtors})
          </TabsTrigger>
          <TabsTrigger value="creditors" data-testid="party-tab-creditors">
            Creditors ({tabCounts.creditors})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          data-testid="party-search-input"
          placeholder="Search by name, code, phone, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} data-testid="party-data-table" />

      {/* Form Dialog */}
      {organizationId && (
        <PartyFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingAccount(null);
          }}
          account={editingAccount}
          nextCode={nextCode}
          organizationId={organizationId}
          accounts={accounts}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
