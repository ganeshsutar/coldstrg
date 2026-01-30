import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHIFTING_REASONS } from "@/config/constants";
import type { ShiftingWizardState } from "../../types";
import type { Amad } from "@/features/inventory/types";

interface QuantityStepProps {
  state: ShiftingWizardState;
  onStateChange: (updates: Partial<ShiftingWizardState>) => void;
  selectedAmad: Amad | null;
}

export function QuantityStep({
  state,
  onStateChange,
  selectedAmad,
}: QuantityStepProps) {
  const totalQuantity = state.pkt1 + state.pkt2 + state.pkt3;
  const availableQuantity = selectedAmad?.totalPackets || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quantity to Shift</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedAmad && (
            <div className="p-3 bg-muted rounded-lg mb-4">
              <div className="text-sm text-muted-foreground">Available in Amad #{selectedAmad.amadNo}</div>
              <div className="font-medium">
                PKT1: {selectedAmad.pkt1 || 0} | PKT2: {selectedAmad.pkt2 || 0} | PKT3: {selectedAmad.pkt3 || 0}
              </div>
              <div className="text-sm">Total: {availableQuantity} bags</div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-4">
              <Label htmlFor="pkt1">PKT1</Label>
              <Input
                id="pkt1"
                type="number"
                min="0"
                max={selectedAmad?.pkt1 || 0}
                value={state.pkt1}
                onChange={(e) => onStateChange({ pkt1: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="pkt2">PKT2</Label>
              <Input
                id="pkt2"
                type="number"
                min="0"
                max={selectedAmad?.pkt2 || 0}
                value={state.pkt2}
                onChange={(e) => onStateChange({ pkt2: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="pkt3">PKT3</Label>
              <Input
                id="pkt3"
                type="number"
                min="0"
                max={selectedAmad?.pkt3 || 0}
                value={state.pkt3}
                onChange={(e) => onStateChange({ pkt3: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="space-y-4">
              <Label>Total</Label>
              <div className="h-10 flex items-center font-medium">
                {totalQuantity} bags
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reason for Shifting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="reason">Reason</Label>
            <Select
              value={state.reason}
              onValueChange={(value) => onStateChange({ reason: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {SHIFTING_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={state.remarks || ""}
              onChange={(e) => onStateChange({ remarks: e.target.value })}
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
