import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WizardFormData } from "./wizard-types";
import { MONTHS } from "./wizard-types";

interface BusinessRegistrationStepProps {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export function BusinessRegistrationStep({
  data,
  onChange,
  errors,
}: BusinessRegistrationStepProps) {
  return (
    <div className="space-y-6" data-testid="wizard-step-2">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">Business Registration</h2>
        <p className="text-muted-foreground mt-1">
          Step 2 of 4 - Tax and banking information (optional)
        </p>
      </div>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {/* GST Number */}
          <div className="space-y-2">
            <Label htmlFor="gstNo">GST Number</Label>
            <Input
              id="gstNo"
              value={data.gstNo}
              onChange={(e) => onChange({ gstNo: e.target.value.toUpperCase() })}
              placeholder="e.g., 09AAAAA0000A1Z5"
              maxLength={15}
              data-testid="wizard-gst-no"
            />
            {errors.gstNo && (
              <p className="text-sm text-destructive">{errors.gstNo}</p>
            )}
          </div>

          {/* PAN Number */}
          <div className="space-y-2">
            <Label htmlFor="panNo">PAN Number</Label>
            <Input
              id="panNo"
              value={data.panNo}
              onChange={(e) => onChange({ panNo: e.target.value.toUpperCase() })}
              placeholder="e.g., AAAAA0000A"
              maxLength={10}
              data-testid="wizard-pan-no"
            />
            {errors.panNo && (
              <p className="text-sm text-destructive">{errors.panNo}</p>
            )}
          </div>

          {/* Financial Year Start */}
          <div className="space-y-2">
            <Label htmlFor="financialYearStart">Financial Year Start</Label>
            <Select
              value={String(data.financialYearStart)}
              onValueChange={(value) =>
                onChange({ financialYearStart: parseInt(value, 10) })
              }
            >
              <SelectTrigger id="financialYearStart" data-testid="wizard-fy-start">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month.value} value={String(month.value)}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              (ends in {MONTHS.find((m) => m.value === (data.financialYearStart === 1 ? 12 : data.financialYearStart - 1))?.label || "March"})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Banking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Banking Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={data.bankName}
              onChange={(e) => onChange({ bankName: e.target.value })}
              placeholder="e.g., State Bank of India"
              data-testid="wizard-bank-name"
            />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="bankAccountNo">Account Number</Label>
            <Input
              id="bankAccountNo"
              value={data.bankAccountNo}
              onChange={(e) => onChange({ bankAccountNo: e.target.value.replace(/\D/g, '') })}
              placeholder="e.g., 1234567890"
              data-testid="wizard-bank-account"
            />
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label htmlFor="bankIfsc">IFSC Code</Label>
            <Input
              id="bankIfsc"
              value={data.bankIfsc}
              onChange={(e) => onChange({ bankIfsc: e.target.value.toUpperCase() })}
              placeholder="e.g., SBIN0001234"
              maxLength={11}
              data-testid="wizard-bank-ifsc"
            />
            {errors.bankIfsc && (
              <p className="text-sm text-destructive">{errors.bankIfsc}</p>
            )}
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label htmlFor="bankBranch">Branch</Label>
            <Input
              id="bankBranch"
              value={data.bankBranch}
              onChange={(e) => onChange({ bankBranch: e.target.value })}
              placeholder="e.g., Main Branch, Agra"
              data-testid="wizard-bank-branch"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
