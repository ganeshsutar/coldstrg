import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WizardFormData } from "./wizard-types";
import { INDIAN_STATES } from "./wizard-types";

interface OrganizationDetailsStepProps {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export function OrganizationDetailsStep({
  data,
  onChange,
  errors,
}: OrganizationDetailsStepProps) {
  return (
    <div className="space-y-6" data-testid="wizard-step-1">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">Organization Details</h2>
        <p className="text-muted-foreground mt-1">
          Step 1 of 4 - Tell us about your organization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Organization Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g., Sharma Cold Storage"
            data-testid="wizard-org-name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Organization Name (Hindi) */}
        <div className="space-y-2">
          <Label htmlFor="nameHindi">Organization Name (Hindi)</Label>
          <Input
            id="nameHindi"
            value={data.nameHindi}
            onChange={(e) => onChange({ nameHindi: e.target.value })}
            placeholder="e.g., शर्मा कोल्ड स्टोरेज"
            data-testid="wizard-org-name-hindi"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">
            Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="e.g., 123 Industrial Area, Near Railway Station"
            data-testid="wizard-org-address"
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g., Agra"
            data-testid="wizard-org-city"
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">
            State <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.state}
            onValueChange={(value) => onChange({ state: value })}
          >
            <SelectTrigger id="state" data-testid="wizard-org-state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="e.g., +91 9876543210"
            data-testid="wizard-org-phone"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="e.g., contact@coldstorage.com"
            data-testid="wizard-org-email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
