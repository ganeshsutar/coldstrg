import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useOrganization } from "@/features/organizations";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import { useLoanLedger, useLedgerSummary } from "../../hooks/use-loan-ledger";
import { LedgerSummaryCards } from "./ledger-summary-cards";
import type { LoanTransactionTypeValue } from "../../types";
import { formatCurrency } from "../../utils";

function getTransactionBadge(type: LoanTransactionTypeValue) {
  switch (type) {
    case "DISBURSEMENT":
      return <Badge variant="destructive">Disbursement</Badge>;
    case "REPAYMENT":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Repayment</Badge>;
    case "INTEREST":
      return <Badge variant="secondary">Interest</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
}

export function LoanLedgerPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: accounts = [] } = useAccountList(organizationId);
  const [selectedPartyId, setSelectedPartyId] = useState<string>("");
  const [search, setSearch] = useState("");

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  const { data: ledger = [], isLoading } = useLoanLedger(
    organizationId,
    selectedPartyId || undefined
  );

  const { data: summary } = useLedgerSummary(
    organizationId,
    selectedPartyId || undefined
  );

  // Filter ledger by search
  const filteredLedger = useMemo(() => {
    if (!search) return ledger;
    const lower = search.toLowerCase();
    return ledger.filter(
      (l) =>
        l.narration?.toLowerCase().includes(lower) ||
        String(l.serialNo).includes(lower)
    );
  }, [ledger, search]);

  // Get selected party name
  const selectedParty = partyAccounts.find((a) => a.id === selectedPartyId);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Loan Ledger</h1>
          <p className="text-sm text-muted-foreground">
            Transaction history for loans and advances
          </p>
        </div>
        <Button
          variant="outline"
          disabled={ledger.length === 0}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Party Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Party</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 min-w-[300px]">
              <Label>Party</Label>
              <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a party" />
                </SelectTrigger>
                <SelectContent>
                  {partyAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPartyId && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {selectedPartyId && summary && (
        <LedgerSummaryCards
          totalDisbursed={summary.totalDisbursed}
          totalRepaid={summary.totalRepaid}
          totalInterest={summary.totalInterest}
          currentBalance={summary.currentBalance}
        />
      )}

      {/* Ledger Table */}
      {selectedPartyId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Transaction History
              {selectedParty && (
                <span className="text-muted-foreground font-normal ml-2">
                  - {selectedParty.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading transactions...
              </div>
            ) : filteredLedger.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Sr#</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Narration</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLedger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.serialNo}
                      </TableCell>
                      <TableCell>
                        {format(new Date(entry.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {getTransactionBadge(entry.transactionType)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {entry.narration || "-"}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {entry.debitAmount > 0
                          ? formatCurrency(entry.debitAmount)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {entry.creditAmount > 0
                          ? formatCurrency(entry.creditAmount)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(entry.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Party Selected */}
      {!selectedPartyId && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              Select a party to view their loan ledger
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
