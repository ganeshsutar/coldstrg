import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, MapPin } from "lucide-react";
import { SHIFTING_REASONS } from "@/config/constants";
import type { ShiftingWizardState, Chamber } from "../../types";
import type { Amad } from "@/features/inventory/types";

interface ConfirmStepProps {
  state: ShiftingWizardState;
  selectedAmad: Amad | null;
  sourceChamber: Chamber | undefined;
  destinationChamber: Chamber | undefined;
}

export function ConfirmStep({
  state,
  selectedAmad,
  sourceChamber,
  destinationChamber,
}: ConfirmStepProps) {
  const totalQuantity = state.pkt1 + state.pkt2 + state.pkt3;
  const reasonLabel = SHIFTING_REASONS.find((r) => r.value === state.reason)?.label;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Shifting Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amad Info */}
          {selectedAmad && (
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Package className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium">Amad #{selectedAmad.amadNo}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedAmad.partyName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedAmad.commodityName}
                </div>
              </div>
            </div>
          )}

          {/* Location Transfer */}
          <div className="flex items-center gap-4">
            <div className="flex-1 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">From</span>
              </div>
              <div className="text-lg font-medium">{sourceChamber?.name || "Unknown"}</div>
              <div className="text-sm text-muted-foreground">
                Floor {state.sourceFloorNumber} - Rack {state.sourceRackNumber}
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-muted-foreground" />

            <div className="flex-1 p-4 border rounded-lg border-primary">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">To</span>
              </div>
              <div className="text-lg font-medium">{destinationChamber?.name || "Unknown"}</div>
              <div className="text-sm text-muted-foreground">
                Floor {state.destinationFloorNumber} - Rack {state.destinationRackNumber}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">PKT1</div>
              <div className="text-lg font-medium">{state.pkt1}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">PKT2</div>
              <div className="text-lg font-medium">{state.pkt2}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">PKT3</div>
              <div className="text-lg font-medium">{state.pkt3}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-lg font-bold">{totalQuantity} bags</div>
            </div>
          </div>

          {/* Reason & Remarks */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Reason:</span>
              <Badge variant="secondary">{reasonLabel || state.reason || "Not specified"}</Badge>
            </div>
            {state.remarks && (
              <div>
                <span className="text-sm text-muted-foreground">Remarks:</span>
                <p className="text-sm mt-1">{state.remarks}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Please review all details carefully before confirming. This action will update
          the rack occupancy in both source and destination locations.
        </p>
      </div>
    </div>
  );
}
