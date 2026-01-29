import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import type { BardanaIssueHeader, BardanaStatusValue, BardanaIssueTypeValue } from "../../types";
import { formatCurrency, formatNumber } from "../../utils/calculations";
import { formatIssueVoucherNo, formatAdvanceVoucherNo } from "../../utils/voucher-number";

interface IssueColumnsOptions {
  onView: (issue: BardanaIssueHeader) => void;
  onEdit: (issue: BardanaIssueHeader) => void;
  onDelete: (issue: BardanaIssueHeader) => void;
  onConfirm: (issue: BardanaIssueHeader) => void;
  onCancel: (issue: BardanaIssueHeader) => void;
}

function getStatusBadge(status: BardanaStatusValue) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        >
          Draft
        </Badge>
      );
    case "CONFIRMED":
      return <Badge variant="default">Confirmed</Badge>;
    case "CANCELLED":
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">-</Badge>;
  }
}

function getIssueTypeBadge(issueType: BardanaIssueTypeValue) {
  switch (issueType) {
    case "ADVANCE":
      return (
        <Badge
          variant="outline"
          className="border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400"
        >
          Advance
        </Badge>
      );
    case "REGULAR":
    default:
      return <Badge variant="secondary">Regular</Badge>;
  }
}

export function getIssueColumns({
  onView,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
}: IssueColumnsOptions): ColumnDef<BardanaIssueHeader>[] {
  return [
    {
      accessorKey: "voucherNo",
      header: "Voucher #",
      cell: ({ row }) => {
        const issueType = row.original.issueType;
        const voucherNo = row.getValue("voucherNo") as number;
        return (
          <span className="font-mono text-sm font-medium">
            {issueType === "ADVANCE"
              ? formatAdvanceVoucherNo(voucherNo)
              : formatIssueVoucherNo(voucherNo)}
          </span>
        );
      },
    },
    {
      accessorKey: "issueDate",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("issueDate") as string;
        return date
          ? new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";
      },
    },
    {
      accessorKey: "partyName",
      header: "Party",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.partyName || "-"}</div>
          {row.original.partyVillage && (
            <div className="text-xs text-muted-foreground">
              {row.original.partyVillage}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "issueType",
      header: "Type",
      cell: ({ row }) => getIssueTypeBadge(row.getValue("issueType")),
    },
    {
      accessorKey: "totalQuantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatNumber(row.getValue("totalQuantity") ?? 0)}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatCurrency(row.getValue("totalAmount") ?? 0)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const issue = row.original;
        const isDraft = issue.status === "DRAFT";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onView(issue)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {isDraft && (
              <>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onEdit(issue)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onConfirm(issue)}
                  title="Confirm"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onCancel(issue)}
                  title="Cancel"
                >
                  <XCircle className="h-3.5 w-3.5 text-orange-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(issue)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
