import { useState, useEffect } from "react";
import { Plus, FolderPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useOrganization } from "@/features/organizations";
import {
  useAccountList,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "../../hooks/use-accounts";
import { getNextAccountCode } from "../../api/accounts";
import { AccountTree } from "./account-tree";
import { AccountFormDialog } from "./account-form-dialog";
import type { Account, CreateAccountInput } from "../../types";

export function ChartOfAccountsPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: accounts = [], isLoading } = useAccountList(organizationId);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount(organizationId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [parentAccount, setParentAccount] = useState<Account | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [nextCode, setNextCode] = useState("1000");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (dialogOpen && !editingAccount && organizationId) {
      getNextAccountCode(organizationId, "").then(setNextCode);
    }
  }, [dialogOpen, editingAccount, organizationId]);

  // Filter by search - include parent chain for matched accounts
  const filteredAccounts = (() => {
    if (!search) return accounts;

    // Find accounts matching the search term
    const matchedIds = new Set<string>();
    accounts.forEach((a) => {
      if (
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.code.includes(search) ||
        a.nameHindi?.toLowerCase().includes(search.toLowerCase())
      ) {
        matchedIds.add(a.id);
      }
    });

    // Build a map for quick parent lookup
    const accountMap = new Map(accounts.map((a) => [a.id, a]));

    // Add all ancestors of matched accounts
    const includeIds = new Set<string>(matchedIds);
    matchedIds.forEach((id) => {
      let current = accountMap.get(id);
      while (current?.parentId) {
        includeIds.add(current.parentId);
        current = accountMap.get(current.parentId);
      }
    });

    return accounts.filter((a) => includeIds.has(a.id));
  })();

  function handleAddAccount() {
    setEditingAccount(null);
    setParentAccount(null);
    setDialogOpen(true);
  }

  function handleAddUnder() {
    if (!selectedAccount) return;
    setEditingAccount(null);
    setParentAccount(selectedAccount);
    setDialogOpen(true);
  }

  function handleEdit() {
    if (!selectedAccount) return;
    setEditingAccount(selectedAccount);
    setParentAccount(null);
    setDialogOpen(true);
  }

  function handleDelete() {
    if (!selectedAccount) return;
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (!selectedAccount) return;
    deleteMutation.mutate(selectedAccount.id);
    setSelectedAccount(null);
    setDeleteDialogOpen(false);
  }

  function handleSave(input: CreateAccountInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingAccount(null);
            setParentAccount(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingAccount(null);
          setParentAccount(null);
        },
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading chart of accounts...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-testid="chart-of-accounts-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chart of Accounts</h1>
          <p className="text-sm text-muted-foreground">
            {accounts.length} accounts in hierarchy
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddUnder} disabled={!selectedAccount}>
            <FolderPlus className="h-4 w-4 mr-1" />
            Add Under
          </Button>
          <Button onClick={handleAddAccount}>
            <Plus className="h-4 w-4 mr-1" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Tree View */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Account Hierarchy</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="chart-search-input"
                  placeholder="Search accounts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            <AccountTree
              accounts={filteredAccounts}
              onSelect={setSelectedAccount}
              selectedId={selectedAccount?.id}
            />
          </CardContent>
        </Card>

        {/* Selected Account Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAccount ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-mono">{selectedAccount.code}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedAccount.name}</p>
                  {selectedAccount.nameHindi && (
                    <p className="text-sm text-muted-foreground">
                      {selectedAccount.nameHindi}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p>{selectedAccount.accountType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nature</p>
                    <p>{selectedAccount.nature}</p>
                  </div>
                </div>
                {selectedAccount.under && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Under</p>
                    <p>{selectedAccount.under}</p>
                  </div>
                )}
                {selectedAccount.accountType === "ACCOUNT" && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p
                      className={`text-lg font-semibold ${
                        (selectedAccount.balance ?? 0) > 0
                          ? "text-green-600 dark:text-green-400"
                          : (selectedAccount.balance ?? 0) < 0
                            ? "text-red-600 dark:text-red-400"
                            : ""
                      }`}
                    >
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(Math.abs(selectedAccount.balance ?? 0))}
                      {selectedAccount.balance !== 0 && (
                        <span className="text-sm ml-1">
                          {(selectedAccount.balance ?? 0) > 0 ? "(DR)" : "(CR)"}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p className="text-sm">Select an account to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      {organizationId && (
        <AccountFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingAccount(null);
              setParentAccount(null);
            }
          }}
          account={editingAccount}
          parentAccount={parentAccount}
          accounts={accounts}
          nextCode={nextCode}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAccount?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
