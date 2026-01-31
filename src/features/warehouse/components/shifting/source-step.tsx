import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationPicker } from "../loading/location-picker";
import { AmadSelector } from "../loading/amad-selector";
import type { ShiftingWizardState } from "../../types";
import type { Amad } from "@/features/inventory/types";

interface SourceStepProps {
  organizationId: string;
  state: ShiftingWizardState;
  onStateChange: (updates: Partial<ShiftingWizardState>) => void;
  selectedAmad: Amad | null;
  onAmadSelect: (amad: Amad) => void;
}

export function SourceStep({
  organizationId,
  state,
  onStateChange,
  selectedAmad,
  onAmadSelect,
}: SourceStepProps) {
  return (
    <div className="space-y-6" data-testid="shifting-source-step">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Source Location</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationPicker
            organizationId={organizationId}
            selectedChamberId={state.sourceChamberId}
            selectedFloorNumber={state.sourceFloorNumber}
            selectedRackNumber={state.sourceRackNumber}
            onChamberChange={(id) => {
              onStateChange({
                sourceChamberId: id,
                sourceFloorNumber: undefined,
                sourceRackNumber: undefined,
              });
            }}
            onFloorChange={(num) => {
              onStateChange({
                sourceFloorNumber: num,
                sourceRackNumber: undefined,
              });
            }}
            onRackChange={(num) => {
              onStateChange({ sourceRackNumber: num });
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Amad to Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <AmadSelector
            organizationId={organizationId}
            selectedAmadId={selectedAmad?.id}
            onSelect={(amad) => {
              onAmadSelect(amad);
              onStateChange({ amadId: amad.id });
            }}
            filterStatus={["IN_STOCK", "PARTIAL_DISPATCH"]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
