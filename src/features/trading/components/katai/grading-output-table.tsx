import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { calculateGradingTotals } from "../../utils";

interface GradingOutputTableProps {
  bagsGraded: number;
  motaBags: number;
  chattaBags: number;
  beejBags: number;
  mixBags: number;
  gullaBags: number;
  onChange: (field: string, value: number) => void;
  readOnly?: boolean;
}

interface GradeRow {
  id: string;
  label: string;
  labelHindi: string;
  description: string;
  field: string;
  value: number;
  color: string;
}

export function GradingOutputTable({
  bagsGraded,
  motaBags,
  chattaBags,
  beejBags,
  mixBags,
  gullaBags,
  onChange,
  readOnly = false,
}: GradingOutputTableProps) {
  const grades: GradeRow[] = [
    {
      id: "mota",
      label: "Mota",
      labelHindi: "मोटा",
      description: "Large (>55mm)",
      field: "motaBags",
      value: motaBags,
      color: "bg-green-500",
    },
    {
      id: "chatta",
      label: "Chatta",
      labelHindi: "छट्टा",
      description: "Medium (45-55mm)",
      field: "chattaBags",
      value: chattaBags,
      color: "bg-blue-500",
    },
    {
      id: "beej",
      label: "Beej",
      labelHindi: "बीज",
      description: "Seed (<45mm)",
      field: "beejBags",
      value: beejBags,
      color: "bg-amber-500",
    },
    {
      id: "mix",
      label: "Mix",
      labelHindi: "मिक्स",
      description: "Mixed",
      field: "mixBags",
      value: mixBags,
      color: "bg-purple-500",
    },
    {
      id: "gulla",
      label: "Gulla",
      labelHindi: "गुल्ला",
      description: "Damaged/Reject",
      field: "gullaBags",
      value: gullaBags,
      color: "bg-red-500",
    },
  ];

  const { total, percentages } = calculateGradingTotals({
    motaBags,
    chattaBags,
    beejBags,
    mixBags,
    gullaBags,
  });

  const isBalanced = total === bagsGraded;
  const difference = bagsGraded - total;

  return (
    <div className="space-y-4">
      {/* Grade Inputs */}
      <div className="grid grid-cols-5 gap-4">
        {grades.map((grade) => {
          const percentage =
            percentages[grade.id as keyof typeof percentages] || 0;

          return (
            <div key={grade.id} className="space-y-2">
              <Label htmlFor={grade.field} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${grade.color}`}
                />
                {grade.label}
              </Label>
              <Input
                id={grade.field}
                type="number"
                min="0"
                max={bagsGraded}
                value={grade.value || ""}
                onChange={(e) =>
                  onChange(grade.field, parseInt(e.target.value) || 0)
                }
                disabled={readOnly}
                className="text-center"
                data-testid={`katai-form-${grade.id}-bags-input`}
              />
              <div className="text-xs text-muted-foreground text-center">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Breakdown */}
      <div className="space-y-4">
        <div className="flex h-4 rounded-full overflow-hidden bg-muted">
          {grades.map((grade) => {
            const percentage =
              percentages[grade.id as keyof typeof percentages] || 0;
            if (percentage <= 0) return null;
            return (
              <div
                key={grade.id}
                className={`${grade.color} transition-all`}
                style={{ width: `${percentage}%` }}
                title={`${grade.label}: ${grade.value} bags (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          {grades.map((grade) => {
            const pct =
              percentages[grade.id as keyof typeof percentages] || 0;
            return (
              <div key={grade.id} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${grade.color}`} />
                <span>
                  {grade.labelHindi} ({grade.value} - {pct.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Balance Check */}
      <div
        className={`p-3 rounded-lg ${
          isBalanced
            ? "bg-green-50 border border-green-200"
            : "bg-amber-50 border border-amber-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium" data-testid="katai-form-output-total">
              Input: {bagsGraded} bags | Output: {total} bags
            </div>
            {!isBalanced && (
              <div className="text-sm text-amber-600">
                {difference > 0
                  ? `${difference} bags remaining to grade`
                  : `${Math.abs(difference)} bags over-graded`}
              </div>
            )}
          </div>
          <div
            className={`text-lg font-bold ${
              isBalanced ? "text-green-600" : "text-amber-600"
            }`}
            data-testid="katai-form-balance-indicator"
          >
            {isBalanced ? "✓ Balanced" : "⚠ Unbalanced"}
          </div>
        </div>

        {/* Progress to balance */}
        {bagsGraded > 0 && (
          <Progress
            value={Math.min(100, (total / bagsGraded) * 100)}
            className="mt-2 h-2"
          />
        )}
      </div>
    </div>
  );
}
