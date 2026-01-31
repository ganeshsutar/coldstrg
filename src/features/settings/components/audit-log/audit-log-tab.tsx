import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { getAuditLogColumns } from "./audit-log-columns";
import { useAuditLogs } from "../../hooks/use-audit-log";
import { AUDIT_ACTIONS } from "@/config/constants";
import { SearchSkeleton, TableSkeleton } from "@/components/loading";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogEntry } from "../../types";

interface AuditLogTabProps {
  organizationId: string;
}

export function AuditLogTab({ organizationId }: AuditLogTabProps) {
  const { data: logs = [], isLoading } = useAuditLogs(organizationId);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    logs.forEach((log) => {
      if (log.userName) users.add(log.userName);
    });
    return Array.from(users);
  }, [logs]);

  const [userFilter, setUserFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let result = logs;

    // Action filter
    if (actionFilter !== "ALL") {
      result = result.filter((l) => l.action === actionFilter);
    }

    // User filter
    if (userFilter !== "ALL") {
      result = result.filter((l) => l.userName === userFilter);
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((l) => new Date(l.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((l) => new Date(l.createdAt) <= to);
    }

    // Text search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.userName || "").toLowerCase().includes(lower) ||
          (l.module || "").toLowerCase().includes(lower) ||
          (l.details || "").toLowerCase().includes(lower) ||
          (l.entityType || "").toLowerCase().includes(lower)
      );
    }

    // Sort newest first
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [logs, actionFilter, userFilter, dateFrom, dateTo, search]);

  function handleExport() {
    const headers = ["Date/Time", "User", "Action", "Module", "Details", "Entity Type", "Entity ID"];
    const rows = filtered.map((l: AuditLogEntry) => [
      new Date(l.createdAt).toLocaleString(),
      l.userName || "",
      l.action,
      l.module || "",
      l.details || "",
      l.entityType || "",
      l.entityId || "",
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns = useMemo(() => getAuditLogColumns(), []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Filter bar skeleton */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchSkeleton />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[150px]" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-9 w-[150px]" />
          </div>
          <Skeleton className="h-9 w-[130px]" />
          <Skeleton className="h-9 w-[130px]" />
          <Skeleton className="h-8 w-24" />
        </div>
        <TableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[150px]"
            placeholder="From"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[150px]"
            placeholder="To"
          />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            {AUDIT_ACTIONS.map((a) => (
              <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="User" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Users</SelectItem>
            {uniqueUsers.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
