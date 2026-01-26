import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization } from "../types";
import { updateOrganization } from "../api/organizations";

interface GeneralSettingsFormProps {
  organization: Organization;
  onUpdate: (org: Organization) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const FINANCIAL_YEAR_MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function GeneralSettingsForm({
  organization,
  onUpdate,
}: GeneralSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: organization.name || "",
    nameHindi: organization.nameHindi || "",
    address: organization.address || "",
    city: organization.city || "",
    state: organization.state || "",
    phone: organization.phone || "",
    email: organization.email || "",
    gstNo: organization.gstNo || "",
    financialYearStart: organization.financialYearStart?.toString() || "4",
  });

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedOrg = await updateOrganization({
        id: organization.id,
        name: formData.name,
        nameHindi: formData.nameHindi || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        phone: formData.phone || null,
        email: formData.email || null,
        gstNo: formData.gstNo || null,
        financialYearStart: formData.financialYearStart
          ? parseInt(formData.financialYearStart)
          : null,
      });
      onUpdate(updatedOrg);
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update organization";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization details</CardTitle>
          <CardDescription>
            Update your organization's basic information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-500/10 p-3 rounded-md">
              Organization updated successfully.
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameHindi">Organization name (Hindi)</Label>
              <Input
                id="nameHindi"
                value={formData.nameHindi}
                onChange={(e) => handleChange("nameHindi", e.target.value)}
                disabled={isLoading}
                placeholder="Optional"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isLoading}
                placeholder="organization@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isLoading}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>
            Update your organization's address details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="address">Street address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={isLoading}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={isLoading}
                placeholder="Enter city"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleChange("state", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="state">
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
          <CardDescription>
            Tax and financial year settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="gstNo">GST Number</Label>
              <Input
                id="gstNo"
                value={formData.gstNo}
                onChange={(e) => handleChange("gstNo", e.target.value)}
                disabled={isLoading}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="financialYearStart">Financial year starts</Label>
              <Select
                value={formData.financialYearStart}
                onValueChange={(value) =>
                  handleChange("financialYearStart", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger id="financialYearStart">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {FINANCIAL_YEAR_MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
