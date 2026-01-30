import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle } from "lucide-react";
import { useOrganization } from "@/features/organizations";
import {
  useKataiList,
  useKataiStats,
  useDeleteKatai,
  useCompleteKatai,
} from "../../hooks";
import { KataiFormDialog } from "./katai-form-dialog";
import type { Katai } from "../../types";
import { formatKataiNo, formatNumber, formatCurrency } from "../../utils";

type FilterTab = "all" | "pending" | "in_progress" | "completed";

function getStatusBadge(status: Katai["status"]) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20"
        >
          Pending
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 border-blue-500/20"
        >
          In Progress
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 border-green-500/20"
        >
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function KataiEntryPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: katais = [], isLoading } = useKataiList(organizationId);
  const { data: stats } = useKataiStats(organizationId);
  const deleteMutation = useDeleteKatai(organizationId);
  const completeMutation = useCompleteKatai(organizationId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKatai, setEditingKatai] = useState<Katai | null>(null);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return katais.filter((k) => k.status === "PENDING");
      case "in_progress":
        return katais.filter((k) => k.status === "IN_PROGRESS");
      case "completed":
        return katais.filter((k) => k.status === "COMPLETED");
      default:
        return katais;
    }
  }, [katais, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return tabFiltered;
    const lower = search.toLowerCase();
    return tabFiltered.filter(
      (k) =>
        k.partyName?.toLowerCase().includes(lower) ||
        String(k.kataiNo).includes(lower) ||
        String(k.amadNo).includes(lower)
    );
  }, [tabFiltered, search]);

  // Count by status
  const counts = useMemo(() => {
    const pending = katais.filter((k) => k.status === "PENDING").length;
    const inProgress = katais.filter((k) => k.status === "IN_PROGRESS").length;
    const completed = katais.filter((k) => k.status === "COMPLETED").length;
    return { pending, inProgress, completed };
  }, [katais]);

  function handleView(katai: Katai) {
    console.log("View katai:", katai);
  }

  function handleEdit(katai: Katai) {
    setEditingKatai(katai);
    setDialogOpen(true);
  }

  function handleDelete(katai: Katai) {
    if (confirm(`Delete grading record #${katai.kataiNo}?`)) {
      deleteMutation.mutate(katai.id);
    }
  }

  function handleComplete(katai: Katai) {
    if (confirm(`Mark grading #${katai.kataiNo} as completed?`)) {
      completeMutation.mutate(katai.id);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading grading records...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grading (Katai)</h1>
          <p className="text-sm text-muted-foreground">
            Potato grading and sorting operations
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingKatai(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Grading
        </Button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Records</div>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <div className="text-xs text-muted-foreground">gradings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold">{stats.inProgressCount}</div>
              <div className="text-xs text-muted-foreground">active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold">{stats.completedCount}</div>
              <div className="text-xs text-muted-foreground">finished</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Graded</div>
              <div className="text-2xl font-bold">
                {formatNumber(stats.totalBagsGraded)}
              </div>
              <div className="text-xs text-muted-foreground">bags</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({katais.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({counts.inProgress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({counts.completed})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by party or katai #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Katai #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Amad #</TableHead>
              <TableHead className="text-right">Input</TableHead>
              <TableHead className="text-right">Mota</TableHead>
              <TableHead className="text-right">Chatta</TableHead>
              <TableHead className="text-right">Beej</TableHead>
              <TableHead className="text-right">Mix</TableHead>
              <TableHead className="text-right">Gulla</TableHead>
              <TableHead className="text-right">Charges</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No grading records found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((katai) => {
                const isActive =
                  katai.status === "PENDING" || katai.status === "IN_PROGRESS";

                return (
                  <TableRow key={katai.id}>
                    <TableCell className="font-medium">
                      {formatKataiNo(katai.kataiNo)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(katai.kataiDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{katai.partyName || "-"}</TableCell>
                    <TableCell>{katai.amadNo || "-"}</TableCell>
                    <TableCell className="text-right font-medium">
                      {katai.bagsGraded}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {katai.motaBags || 0}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {katai.chattaBags || 0}
                    </TableCell>
                    <TableCell className="text-right text-amber-600">
                      {katai.beejBags || 0}
                    </TableCell>
                    <TableCell className="text-right text-purple-600">
                      {katai.mixBags || 0}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {katai.gullaBags || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(katai.charges)}
                    </TableCell>
                    <TableCell>{getStatusBadge(katai.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(katai)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {isActive && (
                            <DropdownMenuItem onClick={() => handleEdit(katai)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {isActive && (
                            <DropdownMenuItem
                              onClick={() => handleComplete(katai)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          {isActive && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(katai)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      {organizationId && (
        <KataiFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingKatai(null);
          }}
          organizationId={organizationId}
          katai={editingKatai}
        />
      )}
    </div>
  );
}
