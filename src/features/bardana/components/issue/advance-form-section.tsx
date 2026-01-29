import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateEstimatedInterest, formatCurrency } from "../../utils/calculations";

interface AdvanceFormSectionProps {
  interestRatePm: number;
  expectedArrivalDate: string;
  expectedBags: number;
  referenceNo: string;
  totalAmount: number;
  onInterestRateChange: (value: number) => void;
  onExpectedArrivalDateChange: (value: string) => void;
  onExpectedBagsChange: (value: number) => void;
  onReferenceNoChange: (value: string) => void;
}

export function AdvanceFormSection({
  interestRatePm,
  expectedArrivalDate,
  expectedBags,
  referenceNo,
  totalAmount,
  onInterestRateChange,
  onExpectedArrivalDateChange,
  onExpectedBagsChange,
  onReferenceNoChange,
}: AdvanceFormSectionProps) {
  // Calculate interest preview
  const interestPreview = calculateEstimatedInterest(
    totalAmount,
    interestRatePm,
    expectedArrivalDate ? new Date(expectedArrivalDate) : null
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Advance/Interest Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interestRatePm">Interest Rate (% per month)</Label>
            <Input
              id="interestRatePm"
              type="number"
              step="0.1"
              min="0"
              value={interestRatePm}
              onChange={(e) => onInterestRateChange(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedArrivalDate">Expected Arrival Date</Label>
            <Input
              id="expectedArrivalDate"
              type="date"
              value={expectedArrivalDate}
              onChange={(e) => onExpectedArrivalDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expectedBags">Expected Bags</Label>
            <Input
              id="expectedBags"
              type="number"
              min="0"
              value={expectedBags || ""}
              onChange={(e) => onExpectedBagsChange(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNo">Reference Number (Agreement)</Label>
            <Input
              id="referenceNo"
              placeholder="e.g., AGR-2024-001"
              value={referenceNo}
              onChange={(e) => onReferenceNoChange(e.target.value)}
            />
          </div>
        </div>

        {/* Interest Preview */}
        {interestPreview && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h4 className="text-sm font-medium">Interest Preview</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Principal Amount:</div>
              <div>{formatCurrency(totalAmount)}</div>

              <div className="text-muted-foreground">Interest Rate:</div>
              <div>{interestRatePm}% per month</div>

              <div className="text-muted-foreground">Expected Days:</div>
              <div>{interestPreview.days} days</div>

              <div className="text-muted-foreground font-medium">
                Estimated Interest:
              </div>
              <div className="font-medium">
                {formatCurrency(interestPreview.interest)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Interest will accrue until goods arrive or settlement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
