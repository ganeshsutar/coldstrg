import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { getGstRateColumns } from "./gst-rate-columns";
import { GstRateDialog } from "./gst-rate-dialog";
import {
  useGstRates,
  useCreateGstRate,
  useUpdateGstRate,
  useDeleteGstRate,
} from "../../hooks/use-gst-rates";
import type { GstRate, CreateGstRateInput } from "../../types";

interface GstRatesTabProps {
  organizationId: string;
}

export function GstRatesTab({ organizationId }: GstRatesTabProps) {
  const { data: gstRates = [], isLoading } = useGstRates(organizationId);
  const createMutation = useCreateGstRate();
  const updateMutation = useUpdateGstRate();
  const deleteMutation = useDeleteGstRate(organizationId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<GstRate | null>(null);

  // Get latest active rates for summary cards
  const latestRates = useMemo(() => {
    const active = gstRates.filter((r) => r.isActive !== false);
    const sorted = [...active].sort(
      (a, b) =>
        new Date(b.effectiveDate).getTime() -
        new Date(a.effectiveDate).getTime()
    );
    return sorted[0];
  }, [gstRates]);

  function handleEdit(rate: GstRate) {
    setEditingRate(rate);
    setDialogOpen(true);
  }

  function handleDelete(rate: GstRate) {
    if (confirm("Delete this GST rate?")) {
      deleteMutation.mutate(rate.id);
    }
  }

  function handleSave(input: CreateGstRateInput & { id?: string }) {
    if (input.id) {
      updateMutation.mutate(
        { ...input, id: input.id },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingRate(null);
          },
        }
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingRate(null);
        },
      });
    }
  }

  const columns = useMemo(
    () => getGstRateColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Sort by effective date desc
  const sortedRates = useMemo(
    () =>
      [...gstRates].sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      ),
    [gstRates]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading GST rates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current CGST
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRates ? `${latestRates.cgstRate}%` : "-"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current SGST
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRates ? `${latestRates.sgstRate}%` : "-"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current IGST
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRates ? `${latestRates.igstRate}%` : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setEditingRate(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add GST Rate
        </Button>
      </div>

      <DataTable columns={columns} data={sortedRates} />

      <GstRateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingRate(null);
        }}
        gstRate={editingRate}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
