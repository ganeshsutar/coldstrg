import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { WizardFormData } from "./wizard-types";

interface SystemConfigStepProps {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
}

export function SystemConfigStep({ data, onChange }: SystemConfigStepProps) {
  return (
    <div className="space-y-6" data-testid="wizard-step-3">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">System Settings</h2>
        <p className="text-muted-foreground mt-1">
          Step 3 of 4 - Configure how your cold storage operates
        </p>
      </div>

      {/* Operation Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Operation Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Software Mode */}
          <div className="space-y-2">
            <Label>Software Mode</Label>
            <ToggleGroup
              type="single"
              value={data.softwareMode}
              onValueChange={(value) =>
                value && onChange({ softwareMode: value as "STANDARD" | "ADVANCED" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="STANDARD" data-testid="wizard-mode-standard">
                Standard
              </ToggleGroupItem>
              <ToggleGroupItem value="ADVANCED" data-testid="wizard-mode-advanced">
                Advanced
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              Advanced mode enables additional features for complex operations
            </p>
          </div>

          {/* Rent Processing */}
          <div className="space-y-2">
            <Label>Rent Processing</Label>
            <ToggleGroup
              type="single"
              value={data.rentProcessingMode}
              onValueChange={(value) =>
                value && onChange({ rentProcessingMode: value as "LEDGER" | "BILL" })
              }
              className="justify-start"
            >
              <ToggleGroupItem value="LEDGER" data-testid="wizard-rent-ledger">
                Ledger Based
              </ToggleGroupItem>
              <ToggleGroupItem value="BILL" data-testid="wizard-rent-bill">
                Bill Based
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              Choose how rent is tracked and processed
            </p>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiChamber"
                checked={data.multiChamber}
                onCheckedChange={(checked) =>
                  onChange({ multiChamber: checked === true })
                }
                data-testid="wizard-multi-chamber"
              />
              <Label htmlFor="multiChamber" className="cursor-pointer">
                Enable Multi-Chamber Support
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="partialLot"
                checked={data.partialLot}
                onCheckedChange={(checked) =>
                  onChange({ partialLot: checked === true })
                }
                data-testid="wizard-partial-lot"
              />
              <Label htmlFor="partialLot" className="cursor-pointer">
                Enable Partial Lot Dispatch
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mapRequired"
                checked={data.mapRequired}
                onCheckedChange={(checked) =>
                  onChange({ mapRequired: checked === true })
                }
                data-testid="wizard-map-required"
              />
              <Label htmlFor="mapRequired" className="cursor-pointer">
                Require MAP for Dispatch
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packet Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Packet Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
              <div>Packet Type</div>
              <div>Name</div>
              <div>Weight (kg)</div>
            </div>

            {/* PKT1 */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm font-medium">PKT1</div>
              <Input
                value={data.pkt1Name}
                onChange={(e) => onChange({ pkt1Name: e.target.value })}
                placeholder="PKT1"
                data-testid="wizard-pkt1-name"
              />
              <Input
                type="number"
                value={data.pkt1Weight}
                onChange={(e) =>
                  onChange({ pkt1Weight: parseFloat(e.target.value) || 0 })
                }
                placeholder="50"
                data-testid="wizard-pkt1-weight"
              />
            </div>

            {/* PKT2 */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm font-medium">PKT2</div>
              <Input
                value={data.pkt2Name}
                onChange={(e) => onChange({ pkt2Name: e.target.value })}
                placeholder="PKT2"
                data-testid="wizard-pkt2-name"
              />
              <Input
                type="number"
                value={data.pkt2Weight}
                onChange={(e) =>
                  onChange({ pkt2Weight: parseFloat(e.target.value) || 0 })
                }
                placeholder="60"
                data-testid="wizard-pkt2-weight"
              />
            </div>

            {/* PKT3 */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm font-medium">PKT3</div>
              <Input
                value={data.pkt3Name}
                onChange={(e) => onChange({ pkt3Name: e.target.value })}
                placeholder="PKT3"
                data-testid="wizard-pkt3-name"
              />
              <Input
                type="number"
                value={data.pkt3Weight}
                onChange={(e) =>
                  onChange({ pkt3Weight: parseFloat(e.target.value) || 0 })
                }
                placeholder="100"
                data-testid="wizard-pkt3-weight"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
