import { useState, useMemo } from "react";
import { format, subMonths } from "date-fns";
import { Calculator, Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useOrganization } from "@/features/organizations";
import { useInterestChart, usePostInterest } from "../../hooks/use-loan-stats";
import { InterestDetailRow } from "./interest-detail-row";
// Types imported from hooks
import { formatCurrency } from "../../utils";

export function InterestChartPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  // Default to last month
  const defaultFromDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");
  const defaultToDate = format(new Date(), "yyyy-MM-dd");

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [interestRate, setInterestRate] = useState(2); // Default 2% per month
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const {
    data: chartData = [],
    isLoading,
    refetch,
  } = useInterestChart(
    shouldCalculate ? organizationId : undefined,
    shouldCalculate ? fromDate : undefined,
    shouldCalculate ? toDate : undefined,
    interestRate
  );

  const postInterestMutation = usePostInterest();

  // Calculate totals
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, entry) => ({
        openingBalance: acc.openingBalance + entry.openingBalance,
        disbursements: acc.disbursements + entry.disbursements,
        recoveries: acc.recoveries + entry.recoveries,
        closingBalance: acc.closingBalance + entry.closingBalance,
        interest: acc.interest + entry.interest,
      }),
      {
        openingBalance: 0,
        disbursements: 0,
        recoveries: 0,
        closingBalance: 0,
        interest: 0,
      }
    );
  }, [chartData]);

  function handleCalculate() {
    setShouldCalculate(true);
    refetch();
  }

  function handlePostInterest() {
    if (!organizationId || chartData.length === 0) return;
    if (
      confirm(
        `Post interest of ${formatCurrency(totals.interest)} for ${chartData.length} parties?`
      )
    ) {
      postInterestMutation.mutate({
        organizationId,
        entries: chartData,
        postDate: toDate,
      });
    }
  }

  function toggleRow(partyId: string) {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(partyId)) {
      newExpanded.delete(partyId);
    } else {
      newExpanded.add(partyId);
    }
    setExpandedRows(newExpanded);
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Interest Chart
          </h1>
          <p className="text-sm text-muted-foreground">
            Calculate interest on loan balances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={chartData.length === 0}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button
            onClick={handlePostInterest}
            disabled={
              chartData.length === 0 ||
              totals.interest === 0 ||
              postInterestMutation.isPending
            }
          >
            <Send className="h-4 w-4 mr-1" />
            Post Interest
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Calculation Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-4">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setShouldCalculate(false);
                }}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setShouldCalculate(false);
                }}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="interestRate">Interest Rate (% p.m.)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                min="0"
                className="w-24"
                value={interestRate}
                onChange={(e) => {
                  setInterestRate(parseFloat(e.target.value) || 0);
                  setShouldCalculate(false);
                }}
              />
            </div>
            <Button onClick={handleCalculate} disabled={isLoading}>
              <Calculator className="h-4 w-4 mr-1" />
              {isLoading ? "Calculating..." : "Calculate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {shouldCalculate && chartData.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Opening Balance</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totals.openingBalance)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Disbursements</p>
              <p className="text-xl font-semibold text-red-600">
                +{formatCurrency(totals.disbursements)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Recoveries</p>
              <p className="text-xl font-semibold text-green-600">
                -{formatCurrency(totals.recoveries)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Closing Balance</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totals.closingBalance)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-xl font-semibold text-primary">
                {formatCurrency(totals.interest)}
              </p>
              <p className="text-xs text-muted-foreground">
                {chartData.length} parties
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interest Chart Table */}
      {shouldCalculate && (
        <Card>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Calculating interest...
              </div>
            ) : chartData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No parties with outstanding loan balances
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Party Name</TableHead>
                    <TableHead className="text-right">Opening</TableHead>
                    <TableHead className="text-right">Disbursed</TableHead>
                    <TableHead className="text-right">Recovered</TableHead>
                    <TableHead className="text-right">Closing</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((entry) => {
                    const isExpanded = expandedRows.has(entry.partyId);
                    return (
                      <Collapsible
                        key={entry.partyId}
                        open={isExpanded}
                        onOpenChange={() => toggleRow(entry.partyId)}
                        asChild
                      >
                        <>
                          <CollapsibleTrigger asChild>
                            <TableRow className="cursor-pointer hover:bg-muted/50">
                              <TableCell>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {entry.partyName}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.openingBalance)}
                              </TableCell>
                              <TableCell className="text-right text-red-600">
                                {entry.disbursements > 0 &&
                                  `+${formatCurrency(entry.disbursements)}`}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                {entry.recoveries > 0 &&
                                  `-${formatCurrency(entry.recoveries)}`}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.closingBalance)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-primary">
                                {formatCurrency(entry.interest)}
                              </TableCell>
                            </TableRow>
                          </CollapsibleTrigger>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={7} className="bg-muted/30 p-4">
                                <InterestDetailRow details={entry.details} />
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    );
                  })}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell></TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.openingBalance)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      +{formatCurrency(totals.disbursements)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      -{formatCurrency(totals.recoveries)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.closingBalance)}
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {formatCurrency(totals.interest)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
