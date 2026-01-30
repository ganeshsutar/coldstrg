import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle } from "lucide-react";
import { formatCurrency, calculateAdvanceLimit, calculateLimitUsage } from "../../utils";

interface LimitCheckCardProps {
  expectedBags: number;
  advancePerBag: number;
  existingAdvance: number;
  requestedAmount: number;
}

export function LimitCheckCard({
  expectedBags,
  advancePerBag,
  existingAdvance,
  requestedAmount,
}: LimitCheckCardProps) {
  const { maxAdvance, available } = calculateAdvanceLimit(
    expectedBags,
    advancePerBag,
    existingAdvance
  );

  const totalRequested = existingAdvance + requestedAmount;
  const usagePercent = calculateLimitUsage(totalRequested, maxAdvance);
  const isOverLimit = requestedAmount > available;

  return (
    <Card className={isOverLimit ? "border-destructive" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isOverLimit ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          Advance Limit Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Expected Bags: {expectedBags}
            </span>
            <span className="text-muted-foreground">
              Rate: {formatCurrency(advancePerBag)}/bag
            </span>
          </div>

          <Progress
            value={usagePercent}
            className={`h-2 ${isOverLimit ? "[&>div]:bg-destructive" : ""}`}
          />

          <div className="flex justify-between text-sm">
            <span>Used: {usagePercent}%</span>
            <span>Max: {formatCurrency(maxAdvance)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Existing Advance</p>
            <p className="font-medium">{formatCurrency(existingAdvance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className={`font-medium ${available < 0 ? "text-destructive" : "text-green-600"}`}>
              {formatCurrency(available)}
            </p>
          </div>
        </div>

        {isOverLimit && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            Requested amount exceeds available limit by{" "}
            {formatCurrency(requestedAmount - available)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
