import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { SourceStep } from "./source-step";
import { DestinationStep } from "./destination-step";
import { QuantityStep } from "./quantity-step";
import { ConfirmStep } from "./confirm-step";
import { useChambers } from "../../hooks/use-chambers";
import { useCreateShiftingHeader, useCreateShifting } from "../../hooks/use-shifting";
import { getNextShiftNo } from "../../api/shifting";
import type { ShiftingWizardState, Chamber, RackOccupancy } from "../../types";
import type { Amad } from "@/features/inventory/types";

interface ShiftingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  preselectedRack?: RackOccupancy;
  preselectedChamber?: Chamber;
}

const STEPS = [
  { id: 1, title: "Source", description: "Select source location" },
  { id: 2, title: "Destination", description: "Select destination" },
  { id: 3, title: "Quantity", description: "Enter quantity to shift" },
  { id: 4, title: "Confirm", description: "Review and confirm" },
];

export function ShiftingWizard({
  open,
  onOpenChange,
  organizationId,
  preselectedRack,
  preselectedChamber,
}: ShiftingWizardProps) {
  const { data: chambers = [] } = useChambers(organizationId);
  const createHeaderMutation = useCreateShiftingHeader();
  const createShiftingMutation = useCreateShifting();

  const [state, setState] = useState<ShiftingWizardState>({
    step: 1,
    sourceChamberId: preselectedChamber?.id,
    sourceFloorNumber: preselectedRack?.floorNumber,
    sourceRackNumber: preselectedRack?.rackNumber,
    pkt1: 0,
    pkt2: 0,
    pkt3: 0,
  });

  const [selectedAmad, setSelectedAmad] = useState<Amad | null>(null);

  const sourceChamber = useMemo(
    () => chambers.find((c) => c.id === state.sourceChamberId),
    [chambers, state.sourceChamberId]
  );

  const destinationChamber = useMemo(
    () => chambers.find((c) => c.id === state.destinationChamberId),
    [chambers, state.destinationChamberId]
  );

  function updateState(updates: Partial<ShiftingWizardState>) {
    setState((prev) => ({ ...prev, ...updates }));
  }

  function handleNext() {
    if (state.step < 4) {
      updateState({ step: (state.step + 1) as 1 | 2 | 3 | 4 });
    }
  }

  function handleBack() {
    if (state.step > 1) {
      updateState({ step: (state.step - 1) as 1 | 2 | 3 | 4 });
    }
  }

  async function handleSubmit() {
    if (!selectedAmad || !state.sourceChamberId || !state.destinationChamberId) return;

    const shiftNo = await getNextShiftNo(organizationId);
    const totalQuantity = state.pkt1 + state.pkt2 + state.pkt3;

    // Create header
    const header = await createHeaderMutation.mutateAsync({
      organizationId,
      shiftNo,
      shiftDate: new Date().toISOString().split("T")[0],
      fromChamberId: state.sourceChamberId,
      fromChamberName: sourceChamber?.name,
      toChamberId: state.destinationChamberId,
      toChamberName: destinationChamber?.name,
      totalItems: 1,
      totalQuantity,
      status: "COMPLETED",
      reason: state.reason,
      remarks: state.remarks,
      completedAt: new Date().toISOString(),
      isActive: true,
    });

    // Create detail line
    await createShiftingMutation.mutateAsync({
      organizationId,
      shiftingHeaderId: header.id,
      amadId: selectedAmad.id,
      amadNo: selectedAmad.amadNo,
      partyName: selectedAmad.partyName,
      commodityName: selectedAmad.commodityName || undefined,
      fromChamberId: state.sourceChamberId,
      fromFloorNumber: state.sourceFloorNumber!,
      fromRackNumber: state.sourceRackNumber!,
      toChamberId: state.destinationChamberId,
      toFloorNumber: state.destinationFloorNumber!,
      toRackNumber: state.destinationRackNumber!,
      pkt1: state.pkt1,
      pkt2: state.pkt2,
      pkt3: state.pkt3,
      totalQuantity,
      remarks: state.remarks,
      isActive: true,
    });

    onOpenChange(false);
    // Reset state
    setState({
      step: 1,
      pkt1: 0,
      pkt2: 0,
      pkt3: 0,
    });
    setSelectedAmad(null);
  }

  const canProceed = () => {
    switch (state.step) {
      case 1:
        return state.sourceChamberId && state.sourceFloorNumber && state.sourceRackNumber && selectedAmad;
      case 2:
        return state.destinationChamberId && state.destinationFloorNumber && state.destinationRackNumber;
      case 3:
        return state.pkt1 + state.pkt2 + state.pkt3 > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const progress = (state.step / 4) * 100;
  const isPending = createHeaderMutation.isPending || createShiftingMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shift Goods Between Racks</DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className={state.step >= step.id ? "text-primary font-medium" : ""}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="py-4">
          {state.step === 1 && (
            <SourceStep
              organizationId={organizationId}
              state={state}
              onStateChange={updateState}
              selectedAmad={selectedAmad}
              onAmadSelect={setSelectedAmad}
            />
          )}
          {state.step === 2 && (
            <DestinationStep
              organizationId={organizationId}
              state={state}
              onStateChange={updateState}
            />
          )}
          {state.step === 3 && (
            <QuantityStep
              state={state}
              onStateChange={updateState}
              selectedAmad={selectedAmad}
            />
          )}
          {state.step === 4 && (
            <ConfirmStep
              state={state}
              selectedAmad={selectedAmad}
              sourceChamber={sourceChamber}
              destinationChamber={destinationChamber}
            />
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={state.step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {state.step < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isPending}>
                <Check className="h-4 w-4 mr-1" />
                {isPending ? "Processing..." : "Confirm Shift"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
