import { useState } from "react";
import { ChevronRight, ChevronDown, FolderTree, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Account } from "../../types";

interface AccountTreeProps {
  accounts: Account[];
  onSelect?: (account: Account) => void;
  selectedId?: string;
}

interface AccountNodeProps {
  account: Account;
  accounts: Account[];
  level: number;
  onSelect?: (account: Account) => void;
  selectedId?: string;
}

function AccountNode({
  account,
  accounts,
  level,
  onSelect,
  selectedId,
}: AccountNodeProps) {
  const [expanded, setExpanded] = useState(level < 2);

  const children = accounts.filter((a) => a.parentId === account.id);
  const hasChildren = children.length > 0;
  const isGroup = account.accountType === "GROUP";
  const isSelected = selectedId === account.id;

  const balance = account.balance ?? 0;

  const formatCurrency = (value: number) => {
    if (value === 0) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50",
          isSelected && "bg-primary/10"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect?.(account)}
        data-testid={`account-node-${account.code}`}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        ) : (
          <div className="w-6" />
        )}

        {/* Icon */}
        {isGroup ? (
          <FolderTree className="h-4 w-4 text-muted-foreground" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}

        {/* Badge */}
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1 py-0",
            isGroup
              ? "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
          )}
        >
          {isGroup ? "G" : "A"}
        </Badge>

        {/* Code */}
        <span className="font-mono text-xs text-muted-foreground w-16">
          {account.code}
        </span>

        {/* Name */}
        <span className={cn("flex-1", isGroup && "font-medium")}>
          {account.name}
        </span>

        {/* Balance */}
        {!isGroup && balance !== 0 && (
          <span
            className={cn(
              "text-sm tabular-nums",
              balance > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {formatCurrency(balance)}
            <span className="text-xs ml-0.5">
              {balance > 0 ? "DR" : "CR"}
            </span>
          </span>
        )}

        {/* Nature indicator */}
        <Badge variant="secondary" className="text-[10px] px-1">
          {account.nature}
        </Badge>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {children
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((child) => (
              <AccountNode
                key={child.id}
                account={child}
                accounts={accounts}
                level={level + 1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function AccountTree({ accounts, onSelect, selectedId }: AccountTreeProps) {
  // Get root accounts (no parent)
  const rootAccounts = accounts
    .filter((a) => !a.parentId)
    .sort((a, b) => a.code.localeCompare(b.code));

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <FolderTree className="h-8 w-8 mb-2" />
        <p>No accounts found</p>
        <p className="text-sm">Add your first account to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" data-testid="account-tree">
      {rootAccounts.map((account) => (
        <AccountNode
          key={account.id}
          account={account}
          accounts={accounts}
          level={0}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}
