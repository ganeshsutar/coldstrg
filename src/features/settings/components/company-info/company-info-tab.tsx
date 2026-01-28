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
import type { Organization } from "@/features/organizations/types";
import { updateCompanyInfo } from "../../api/company-info";

interface CompanyInfoTabProps {
  organizationId: string;
  organization: Organization;
  onUpdate: (org: Organization) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const FINANCIAL_YEAR_MONTHS = [
  { value: "1", label: "January" }, { value: "2", label: "February" },
  { value: "3", label: "March" }, { value: "4", label: "April" },
  { value: "5", label: "May" }, { value: "6", label: "June" },
  { value: "7", label: "July" }, { value: "8", label: "August" },
  { value: "9", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];

export function CompanyInfoTab({ organization, onUpdate }: CompanyInfoTabProps) {
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
    fax: organization.fax || "",
    email: organization.email || "",
    gstNo: organization.gstNo || "",
    panNo: organization.panNo || "",
    tanNo: organization.tanNo || "",
    cinNo: organization.cinNo || "",
    bankName: organization.bankName || "",
    bankAccountNo: organization.bankAccountNo || "",
    bankIfsc: organization.bankIfsc || "",
    bankBranch: organization.bankBranch || "",
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
      const financialYearStart = formData.financialYearStart
        ? parseInt(formData.financialYearStart)
        : 4;
      // Calculate end month (month before start)
      const financialYearEnd = financialYearStart === 1 ? 12 : financialYearStart - 1;

      const updatedOrg = await updateCompanyInfo({
        id: organization.id,
        name: formData.name,
        nameHindi: formData.nameHindi || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        phone: formData.phone || null,
        fax: formData.fax || null,
        email: formData.email || null,
        gstNo: formData.gstNo || null,
        panNo: formData.panNo || null,
        tanNo: formData.tanNo || null,
        cinNo: formData.cinNo || null,
        bankName: formData.bankName || null,
        bankAccountNo: formData.bankAccountNo || null,
        bankIfsc: formData.bankIfsc || null,
        bankBranch: formData.bankBranch || null,
        financialYearStart,
        financialYearEnd,
      });
      onUpdate(updatedOrg);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update organization";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>Basic information about your organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-500/10 p-3 rounded-md">
              Organization updated successfully.
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} disabled={isLoading} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameHindi">Organization name (Hindi)</Label>
              <Input id="nameHindi" value={formData.nameHindi} onChange={(e) => handleChange("nameHindi", e.target.value)} disabled={isLoading} placeholder="Optional" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} disabled={isLoading} placeholder="Enter street address" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(v) => handleChange("state", v)} disabled={isLoading}>
                <SelectTrigger id="state"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} disabled={isLoading} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fax">Fax</Label>
              <Input id="fax" value={formData.fax} onChange={(e) => handleChange("fax", e.target.value)} disabled={isLoading} placeholder="Optional" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} disabled={isLoading} placeholder="organization@example.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>Tax registration and identification numbers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="panNo">PAN Number</Label>
              <Input id="panNo" value={formData.panNo} onChange={(e) => handleChange("panNo", e.target.value)} disabled={isLoading} placeholder="AAAAA0000A" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstNo">GSTIN</Label>
              <Input id="gstNo" value={formData.gstNo} onChange={(e) => handleChange("gstNo", e.target.value)} disabled={isLoading} placeholder="22AAAAA0000A1Z5" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tanNo">TAN Number</Label>
              <Input id="tanNo" value={formData.tanNo} onChange={(e) => handleChange("tanNo", e.target.value)} disabled={isLoading} placeholder="AAAA00000A" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cinNo">CIN Number</Label>
              <Input id="cinNo" value={formData.cinNo} onChange={(e) => handleChange("cinNo", e.target.value)} disabled={isLoading} placeholder="Optional" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
          <CardDescription>Organization bank account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" value={formData.bankName} onChange={(e) => handleChange("bankName", e.target.value)} disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bankAccountNo">Account Number</Label>
              <Input id="bankAccountNo" value={formData.bankAccountNo} onChange={(e) => handleChange("bankAccountNo", e.target.value)} disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bankIfsc">IFSC Code</Label>
              <Input id="bankIfsc" value={formData.bankIfsc} onChange={(e) => handleChange("bankIfsc", e.target.value)} disabled={isLoading} placeholder="SBIN0000000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bankBranch">Branch</Label>
              <Input id="bankBranch" value={formData.bankBranch} onChange={(e) => handleChange("bankBranch", e.target.value)} disabled={isLoading} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Year */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Year</CardTitle>
          <CardDescription>Configure your organization's financial year.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="financialYearStart">Financial year starts</Label>
              <Select value={formData.financialYearStart} onValueChange={(v) => handleChange("financialYearStart", v)} disabled={isLoading}>
                <SelectTrigger id="financialYearStart"><SelectValue placeholder="Select month" /></SelectTrigger>
                <SelectContent>
                  {FINANCIAL_YEAR_MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Financial year ends</Label>
              <Input
                disabled
                value={
                  FINANCIAL_YEAR_MONTHS[
                    (parseInt(formData.financialYearStart || "4") - 2 + 12) % 12
                  ]?.label || "March"
                }
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
