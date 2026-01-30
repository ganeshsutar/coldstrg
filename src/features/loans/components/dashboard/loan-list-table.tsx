/* eslint-disable react-hooks/incompatible-library */
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Advance, LoanAmount, AdvanceStatusValue, LoanStatusValue } from "../../types";
import { formatCurrency, formatAdvanceNo, formatLoanNo, calculateLimitUsage } from "../../utils";

type TabValue = "advances" | "loans" | "overdue";

interface LoanListTableProps {
  advances: Advance[];
  loans: LoanAmount[];
  onViewAdvance?: (advance: Advance) => void;
  onViewLoan?: (loan: LoanAmount) => void;
}

interface CombinedRow {
  id: string;
  type: "ADVANCE" | "LOAN";
  voucherNo: string;
  date: string;
  partyName: string;
  principal: number;
  balance: number;
  status: AdvanceStatusValue | LoanStatusValue;
  usagePercent: number;
  original: Advance | LoanAmount;
}

function getStatusBadge(status: AdvanceStatusValue | LoanStatusValue) {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline">Pending</Badge>;
    case "CONVERTED":
      return <Badge variant="secondary">Converted</Badge>;
    case "ADJUSTED":
      return <Badge variant="secondary">Adjusted</Badge>;
    case "ACTIVE":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
    case "PARTIAL_REPAID":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Partial</Badge>;
    case "OVERDUE":
      return <Badge variant="destructive">Overdue</Badge>;
    case "CLOSED":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function LoanListTable({
  advances,
  loans,
  onViewAdvance,
  onViewLoan,
}: LoanListTableProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("advances");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo((): CombinedRow[] => {
    const rows: CombinedRow[] = [];

    if (activeTab === "advances") {
      for (const adv of advances.filter((a) => a.status === "PENDING")) {
        rows.push({
          id: adv.id,
          type: "ADVANCE",
          voucherNo: formatAdvanceNo(adv.advanceNo),
          date: adv.date,
          partyName: adv.partyName ?? "Unknown",
          principal: adv.amount,
          balance: adv.amount,
          status: adv.status,
          usagePercent: 100,
          original: adv,
        });
      }
    } else if (activeTab === "loans") {
      for (const loan of loans.filter(
        (l) => l.status === "ACTIVE" || l.status === "PARTIAL_REPAID"
      )) {
        rows.push({
          id: loan.id,
          type: "LOAN",
          voucherNo: formatLoanNo(loan.loanNo),
          date: loan.date,
          partyName: loan.partyName ?? "Unknown",
          principal: loan.disbursedAmount,
          balance: loan.outstandingBalance,
          status: loan.status,
          usagePercent: calculateLimitUsage(
            loan.outstandingBalance,
            loan.disbursedAmount
          ),
          original: loan,
        });
      }
    } else if (activeTab === "overdue") {
      for (const loan of loans.filter((l) => l.status === "OVERDUE")) {
        rows.push({
          id: loan.id,
          type: "LOAN",
          voucherNo: formatLoanNo(loan.loanNo),
          date: loan.date,
          partyName: loan.partyName ?? "Unknown",
          principal: loan.disbursedAmount,
          balance: loan.outstandingBalance,
          status: loan.status,
          usagePercent: 100,
          original: loan,
        });
      }
    }

    return rows.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [advances, loans, activeTab]);

  const columns: ColumnDef<CombinedRow>[] = useMemo(
    () => [
      {
        accessorKey: "voucherNo",
        header: "Voucher #",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("voucherNo")}</span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.getValue("date")), "dd/MM/yyyy"),
      },
      {
        accessorKey: "partyName",
        header: "Party",
      },
      {
        accessorKey: "principal",
        header: "Principal",
        cell: ({ row }) => formatCurrency(row.getValue("principal")),
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-medium">
              {formatCurrency(row.getValue("balance"))}
            </span>
            <Progress value={row.original.usagePercent} className="h-1" />
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.getValue("status")),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const counts = useMemo(() => {
    const advanceCount = advances.filter((a) => a.status === "PENDING").length;
    const loanCount = loans.filter(
      (l) => l.status === "ACTIVE" || l.status === "PARTIAL_REPAID"
    ).length;
    const overdueCount = loans.filter((l) => l.status === "OVERDUE").length;
    return { advanceCount, loanCount, overdueCount };
  }, [advances, loans]);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="advances">
            Advances ({counts.advanceCount})
          </TabsTrigger>
          <TabsTrigger value="loans">Loans ({counts.loanCount})</TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({counts.overdueCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    if (row.original.type === "ADVANCE" && onViewAdvance) {
                      onViewAdvance(row.original.original as Advance);
                    } else if (row.original.type === "LOAN" && onViewLoan) {
                      onViewLoan(row.original.original as LoanAmount);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
