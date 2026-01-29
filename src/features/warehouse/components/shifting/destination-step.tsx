import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationPicker } from "../loading/location-picker";
import type { ShiftingWizardState } from "../../types";

interface DestinationStepProps {
  organizationId: string;
  state: ShiftingWizardState;
  onStateChange: (updates: Partial<ShiftingWizardState>) => void;
}

export function DestinationStep({
  organizationId,
  state,
  onStateChange,
}: DestinationStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Destination Location</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationPicker
            organizationId={organizationId}
            selectedChamberId={state.destinationChamberId}
            selectedFloorNumber={state.destinationFloorNumber}
            selectedRackNumber={state.destinationRackNumber}
            onChamberChange={(id) => {
              onStateChange({
                destinationChamberId: id,
                destinationFloorNumber: undefined,
                destinationRackNumber: undefined,
              });
            }}
            onFloorChange={(num) => {
              onStateChange({
                destinationFloorNumber: num,
                destinationRackNumber: undefined,
              });
            }}
            onRackChange={(num) => {
              onStateChange({ destinationRackNumber: num });
            }}
          />
        </CardContent>
      </Card>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Select the destination chamber, floor, and rack where you want to move the goods.
          Make sure the destination rack has enough capacity.
        </p>
      </div>
    </div>
  );
}
