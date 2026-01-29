import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, ChevronDown, ChevronRight, Send, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useOrganization } from "@/features/organizations";
import { useBardanaStockList } from "../../hooks/use-bardana-stock";
import { useBardanaTypeList } from "../../hooks/use-bardana-types";
import type { PartyOutstanding } from "../../types";
import { formatCurrency, formatNumber } from "../../utils/calculations";

export function PartyOutstandingPage() {
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: stockRecords = [], isLoading: stockLoading } =
    useBardanaStockList(organizationId);
  const { data: bardanaTypes = [] } = useBardanaTypeList(organizationId);

  const [search, setSearch] = useState("");
  const [expandedParties, setExpandedParties] = useState<Set<string>>(
    new Set()
  );

  // Aggregate stock records by party
  const partyOutstandings = useMemo(() => {
    const partyMap = new Map<string, PartyOutstanding>();

    stockRecords.forEach((stock) => {
      if (stock.balance <= 0) return;

      const existing = partyMap.get(stock.partyId);
      const type = bardanaTypes.find((t) => t.id === stock.bardanaTypeId);

      const typeEntry = {
        bardanaTypeId: stock.bardanaTypeId,
        bardanaTypeName: stock.bardanaTypeName ?? type?.name ?? "Unknown",
        issued: stock.totalIssued,
        returned: stock.totalReturned,
        balance: stock.balance,
        rate: type?.defaultRate ?? 0,
        value: stock.totalValue,
      };

      if (existing) {
        existing.totalIssued += stock.totalIssued;
        existing.totalReturned += stock.totalReturned;
        existing.balance += stock.balance;
        existing.totalValue += stock.totalValue;
        existing.byType.push(typeEntry);
      } else {
        partyMap.set(stock.partyId, {
          partyId: stock.partyId,
          partyName: stock.partyName ?? "Unknown",
          partyVillage: stock.partyVillage ?? undefined,
          totalIssued: stock.totalIssued,
          totalReturned: stock.totalReturned,
          balance: stock.balance,
          totalValue: stock.totalValue,
          byType: [typeEntry],
        });
      }
    });

    return Array.from(partyMap.values()).sort((a, b) =>
      a.partyName.localeCompare(b.partyName)
    );
  }, [stockRecords, bardanaTypes]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return partyOutstandings;
    const lower = search.toLowerCase();
    return partyOutstandings.filter(
      (p) =>
        p.partyName.toLowerCase().includes(lower) ||
        p.partyVillage?.toLowerCase().includes(lower)
    );
  }, [partyOutstandings, search]);

  // Total outstanding
  const totals = useMemo(() => {
    return partyOutstandings.reduce(
      (acc, p) => ({
        totalBags: acc.totalBags + p.balance,
        totalValue: acc.totalValue + p.totalValue,
      }),
      { totalBags: 0, totalValue: 0 }
    );
  }, [partyOutstandings]);

  function toggleParty(partyId: string) {
    const newExpanded = new Set(expandedParties);
    if (newExpanded.has(partyId)) {
      newExpanded.delete(partyId);
    } else {
      newExpanded.add(partyId);
    }
    setExpandedParties(newExpanded);
  }

  function handleRecordReturn() {
    navigate({ to: "/bardana/receipts" });
  }

  function handleIssueMore() {
    navigate({ to: "/bardana/issues" });
  }

  if (stockLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading outstanding data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Party Outstanding
          </h1>
          <p className="text-sm text-muted-foreground">
            Track bardana balances by party
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-sm text-muted-foreground">
                Total Outstanding
              </div>
              <div className="text-2xl font-semibold">
                {formatNumber(totals.totalBags)} bags
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-semibold">
                {formatCurrency(totals.totalValue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parties</div>
              <div className="text-2xl font-semibold">
                {partyOutstandings.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Party List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No outstanding bardana found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((party) => (
            <Collapsible
              key={party.partyId}
              open={expandedParties.has(party.partyId)}
              onOpenChange={() => toggleParty(party.partyId)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedParties.has(party.partyId) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div>
                          <CardTitle className="text-base font-medium">
                            {party.partyName}
                          </CardTitle>
                          {party.partyVillage && (
                            <p className="text-xs text-muted-foreground">
                              {party.partyVillage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatNumber(party.balance)} bags
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(party.totalValue)}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-orange-500/50 bg-orange-500/10 text-orange-600"
                        >
                          Due
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4 space-y-4">
                    {/* Breakdown by Type */}
                    <div className="rounded-lg border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-2 px-3 text-left font-medium">
                              Type
                            </th>
                            <th className="py-2 px-3 text-right font-medium">
                              Issued
                            </th>
                            <th className="py-2 px-3 text-right font-medium">
                              Returned
                            </th>
                            <th className="py-2 px-3 text-right font-medium">
                              Balance
                            </th>
                            <th className="py-2 px-3 text-right font-medium">
                              Rate
                            </th>
                            <th className="py-2 px-3 text-right font-medium">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {party.byType.map((type) => (
                            <tr
                              key={type.bardanaTypeId}
                              className="border-b last:border-0"
                            >
                              <td className="py-2 px-3">
                                {type.bardanaTypeName}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums">
                                {formatNumber(type.issued)}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums">
                                {formatNumber(type.returned)}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums font-medium">
                                {formatNumber(type.balance)}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums">
                                {formatCurrency(type.rate)}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums">
                                {formatCurrency(type.value)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-muted/30 font-medium">
                            <td className="py-2 px-3">Total</td>
                            <td className="py-2 px-3 text-right tabular-nums">
                              {formatNumber(party.totalIssued)}
                            </td>
                            <td className="py-2 px-3 text-right tabular-nums">
                              {formatNumber(party.totalReturned)}
                            </td>
                            <td className="py-2 px-3 text-right tabular-nums">
                              {formatNumber(party.balance)}
                            </td>
                            <td className="py-2 px-3"></td>
                            <td className="py-2 px-3 text-right tabular-nums">
                              {formatCurrency(party.totalValue)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRecordReturn}
                      >
                        <Undo2 className="h-4 w-4 mr-1" />
                        Record Return
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleIssueMore}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Issue More
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
