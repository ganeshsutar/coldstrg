import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { useOrganization } from "@/features/organizations";
import { useAmadDetail, useUpdateAmad } from "../../hooks/use-amad";
import { useRentList } from "../../hooks/use-rent";
import { getRentColumns } from "../rent/rent-columns";
import { AmadFormDialog } from "./amad-form-dialog";
import type { AmadStatusValue, CreateAmadInput } from "../../types";

function getStatusBadge(status: AmadStatusValue | null | undefined) {
  switch (status) {
    case "IN_STOCK":
      return <Badge variant="default">In Stock</Badge>;
    case "PARTIAL_DISPATCH":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        >
          Partial
        </Badge>
      );
    case "DISPATCHED":
      return <Badge variant="secondary">Dispatched</Badge>;
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400"
        >
          Pending
        </Badge>
      );
    default:
      return <Badge variant="secondary">-</Badge>;
  }
}

type DetailTab = "overview" | "dispatch" | "ledger";

export function AmadDetailPage() {
  const { amadId } = useParams({ from: "/_authenticated/inventory/amad/$amadId" });
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: amad, isLoading } = useAmadDetail(amadId);
  const { data: rentList = [] } = useRentList(organizationId);
  const updateMutation = useUpdateAmad();

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Filter rent records linked to this amad
  const amadRents = rentList.filter((r) => r.amadId === amadId);

  const rentColumns = getRentColumns({
    onEdit: () => {},
    onDelete: () => {},
  });

  function handleSave(input: CreateAmadInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => setEditDialogOpen(false),
        }
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading amad details...</div>
      </div>
    );
  }

  if (!amad) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Amad record not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/inventory/amad" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Amad #{amad.amadNo}
              </h1>
              {getStatusBadge(amad.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              {amad.partyName}
              {amad.villageName && ` - ${amad.villageName}`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setEditDialogOpen(true)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Party Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Party Name</span>
              <span className="font-medium">{amad.partyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Village</span>
              <span>{amad.villageName || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">District</span>
              <span>{amad.district || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Road</span>
              <span>{amad.road || "-"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Commodity Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commodity</span>
              <span className="font-medium">
                {amad.commodityName || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Variety</span>
              <span>{amad.variety || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Packets</span>
              <span className="font-medium">{amad.totalPackets ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Weight</span>
              <span className="font-medium">
                {(amad.totalWeight ?? 0).toLocaleString("en-IN")} kg
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Storage Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span>{amad.room || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Floor</span>
              <span>{amad.floor || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position</span>
              <span>{amad.position || "-"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Financial Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rent Rate</span>
              <span>
                {amad.rentRate != null ? `\u20B9${amad.rentRate}` : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Grace Days</span>
              <span>{amad.graceDays ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dala Charges</span>
              <span>
                {amad.dalaCharges != null
                  ? `\u20B9${amad.dalaCharges}`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">E-Way Bill</span>
              <span>{amad.eWayBillNo || "-"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "dispatch", label: "Dispatch History" },
            { id: "ledger", label: "Ledger" },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            className={
              activeTab === tab.id
                ? "border-b-2 border-primary rounded-none"
                : "rounded-none"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Packet Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">PKT1 (80kg)</div>
                <div className="font-medium">
                  {amad.pkt1 ?? 0} pkt / {(amad.pwt1 ?? 0).toLocaleString("en-IN")} kg
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">PKT2 (70kg)</div>
                <div className="font-medium">
                  {amad.pkt2 ?? 0} pkt / {(amad.pwt2 ?? 0).toLocaleString("en-IN")} kg
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">PKT3 (50kg)</div>
                <div className="font-medium">
                  {amad.pkt3 ?? 0} pkt / {(amad.pwt3 ?? 0).toLocaleString("en-IN")} kg
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mark 1</span>
                <span>{amad.mark1 || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mark 2</span>
                <span>{amad.mark2 || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Party Mark</span>
                <span>{amad.partyMark || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Dispatched Packets
                </span>
                <span>{amad.dispatchedPackets ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">
                  {(amad.totalPackets ?? 0) - (amad.dispatchedPackets ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "dispatch" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Dispatch History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {amadRents.length > 0 ? (
              <DataTable columns={rentColumns} data={amadRents} />
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No dispatch records found for this Amad.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "ledger" && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-sm text-muted-foreground">
              Ledger view coming soon.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {organizationId && (
        <AmadFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          amad={amad}
          nextAmadNo={amad.amadNo}
          organizationId={organizationId}
          onSave={handleSave}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}
