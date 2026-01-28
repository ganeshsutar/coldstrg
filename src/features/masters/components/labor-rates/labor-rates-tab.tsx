import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { getLaborRateColumns } from "./labor-rate-columns";
import { LaborRateMatrix } from "./labor-rate-matrix";
import { LaborRateDialog } from "./labor-rate-dialog";
import {
  useLaborRates,
  useCreateLaborRate,
  useDeleteLaborRate,
} from "../../hooks/use-labor-rates";
import type { LaborRate, CreateLaborRateInput } from "../../types";

interface LaborRatesTabProps {
  organizationId: string;
}

export function LaborRatesTab({ organizationId }: LaborRatesTabProps) {
  const { data: laborRates = [], isLoading } = useLaborRates(organizationId);
  const createMutation = useCreateLaborRate();
  const deleteMutation = useDeleteLaborRate(organizationId);

  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDelete(rate: LaborRate) {
    if (confirm("Delete this labor rate entry?")) {
      deleteMutation.mutate(rate.id);
    }
  }

  function handleSave(input: CreateLaborRateInput) {
    createMutation.mutate(input, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  }

  const columns = useMemo(
    () => getLaborRateColumns({ onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Sort by effective date desc for history table
  const sortedRates = useMemo(
    () =>
      [...laborRates].sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      ),
    [laborRates]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading labor rates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Rate Matrix */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Current Rates
        </h3>
        <LaborRateMatrix laborRates={laborRates} />
      </div>

      {/* Rate History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Rate History
          </h3>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Rate
          </Button>
        </div>
        <DataTable columns={columns} data={sortedRates} />
      </div>

      <LaborRateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
