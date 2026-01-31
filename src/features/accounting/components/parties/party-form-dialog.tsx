import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCOUNT_NATURE_OPTIONS, PARTY_TYPE_OPTIONS, PARTY_TYPE_PARENT_MAP } from "@/config/constants";
import type { Account, CreateAccountInput, AccountNatureValue, PartyTypeValue } from "../../types";
import { useVillages } from "@/features/masters/hooks/use-villages";
import type { Village } from "@/features/masters/types";

interface PartyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  nextCode: string;
  organizationId: string;
  accounts: Account[];
  onSave: (input: CreateAccountInput & { id?: string }) => void;
  isPending: boolean;
}

interface InnerFormProps {
  account: Account | null | undefined;
  nextCode: string;
  organizationId: string;
  groupAccounts: Account[];
  villages: Village[];
  onSave: (input: CreateAccountInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
  isEditing: boolean;
}

// Inner form component using controlled inputs
function PartyFormInner({
  account,
  nextCode,
  organizationId,
  groupAccounts,
  villages,
  onSave,
  onCancel,
  isPending,
  isEditing,
}: InnerFormProps) {
  // Form state using useState (like Village form)
  const [code, setCode] = useState(account?.code ?? nextCode);
  const [name, setName] = useState(account?.name ?? "");
  const [nameHindi, setNameHindi] = useState(account?.nameHindi ?? "");
  const [nature, setNature] = useState<AccountNatureValue>(account?.nature ?? "DR");
  const [partyType, setPartyType] = useState<PartyTypeValue | "">(account?.partyType ?? "");
  const [parentId, setParentId] = useState(account?.parentId ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [address1, setAddress1] = useState(account?.address1 ?? "");
  const [address2, setAddress2] = useState(account?.address2 ?? "");
  const [city, setCity] = useState(account?.city ?? "");
  const [state, setState] = useState(account?.state ?? "");
  const [aadhar, setAadhar] = useState(account?.aadhar ?? "");
  const [pan, setPan] = useState(account?.pan ?? "");
  const [gst, setGst] = useState(account?.gst ?? "");
  const [openingBalance, setOpeningBalance] = useState(account?.openingBalance?.toString() ?? "0");
  const [interestRate, setInterestRate] = useState(account?.interestRate?.toString() ?? "");
  const [drLimit, setDrLimit] = useState(account?.drLimit?.toString() ?? "");

  // Validation errors
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  // Handler to auto-fill city/state when village changes
  const handleVillageChange = (villageName: string) => {
    setAddress2(villageName);
    const village = villages.find((v) => v.name === villageName);
    if (village) {
      setCity(village.districtName);
      setState(village.stateName);
    }
  };

  // Handler to auto-select parent account and nature based on party type
  const handlePartyTypeChange = (newPartyType: PartyTypeValue) => {
    setPartyType(newPartyType);
    if (newPartyType && PARTY_TYPE_PARENT_MAP[newPartyType]) {
      const parentCode = PARTY_TYPE_PARENT_MAP[newPartyType];
      const parentAccount = groupAccounts.find((a) => a.code === parentCode);
      if (parentAccount) {
        setParentId(parentAccount.id);
        setNature(parentAccount.nature);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: { code?: string; name?: string } = {};
    if (!code.trim()) {
      newErrors.code = "Code is required";
    }
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors
    setErrors({});

    // Get parent account details to compute level and under
    const parentAccount = parentId
      ? groupAccounts.find((a) => a.id === parentId)
      : null;

    const input: CreateAccountInput & { id?: string } = {
      organizationId,
      code,
      name,
      nameHindi: nameHindi || undefined,
      accountType: "ACCOUNT",
      nature,
      partyType: partyType ? (partyType as PartyTypeValue) : undefined,
      parentId: parentId || undefined,
      level: parentAccount ? (parentAccount.level ?? 0) + 1 : undefined,
      under: parentAccount?.code || undefined,
      phone: phone || undefined,
      address1: address1 || undefined,
      address2: address2 || undefined,
      city: city || undefined,
      state: state || undefined,
      aadhar: aadhar || undefined,
      pan: pan || undefined,
      gst: gst || undefined,
      openingBalance: parseFloat(openingBalance) || 0,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      drLimit: drLimit ? parseFloat(drLimit) : undefined,
    };

    if (account?.id) {
      input.id = account.id;
    }

    onSave(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="party-form">
      {/* Classification & Basic Info - 4 columns with custom widths */}
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="partyType">Party Type</Label>
          <Select
            value={partyType}
            onValueChange={(val) => handlePartyTypeChange(val as PartyTypeValue)}
          >
            <SelectTrigger className="w-full" data-testid="party-form-type-select">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PARTY_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="parentId">Parent Account</Label>
          <Select
            value={parentId}
            onValueChange={(val) => setParentId(val)}
          >
            <SelectTrigger className="w-full" data-testid="party-form-parent-select">
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              {groupAccounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name} ({acc.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Party Code</Label>
          <Input
            id="code"
            data-testid="party-form-code-input"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
            }}
            placeholder="P0001"
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nature">Nature</Label>
          <Select
            value={nature}
            onValueChange={(val) => setNature(val as AccountNatureValue)}
          >
            <SelectTrigger className="w-full" data-testid="party-form-nature-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_NATURE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Party Name</Label>
          <Input
            id="name"
            data-testid="party-form-name-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Enter party name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nameHindi">Name (Hindi)</Label>
          <Input
            id="nameHindi"
            data-testid="party-form-name-hindi-input"
            value={nameHindi}
            onChange={(e) => setNameHindi(e.target.value)}
            placeholder="हिंदी में नाम"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input
              id="address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address2">Village</Label>
            <Select
              value={address2}
              onValueChange={handleVillageChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select village" />
              </SelectTrigger>
              <SelectContent>
                {villages
                  .filter((v) => v.isActive !== false)
                  .map((village) => (
                    <SelectItem key={village.id} value={village.name}>
                      {village.name} ({village.districtName})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              data-testid="party-form-phone-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile number"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </div>
        </div>
      </div>

      {/* Identity */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-medium text-muted-foreground">Identity</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="aadhar">Aadhar</Label>
            <Input
              id="aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="XXXX XXXX XXXX"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pan">PAN</Label>
            <Input
              id="pan"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              placeholder="XXXXX0000X"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gst">GST</Label>
            <Input
              id="gst"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              placeholder="GST Number"
            />
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-medium text-muted-foreground">Financial</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="openingBalance">Opening Balance</Label>
            <Input
              id="openingBalance"
              data-testid="party-form-opening-balance-input"
              type="number"
              step="0.01"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="18.00"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="drLimit">DR Limit</Label>
            <Input
              id="drLimit"
              type="number"
              step="0.01"
              value={drLimit}
              onChange={(e) => setDrLimit(e.target.value)}
              placeholder="Credit limit"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-testid="party-form-cancel-button"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} data-testid="party-form-submit-button">
          {isPending ? "Saving..." : isEditing ? "Update Party" : "Add Party"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PartyFormDialog({
  open,
  onOpenChange,
  account,
  nextCode,
  organizationId,
  accounts,
  onSave,
  isPending,
}: PartyFormDialogProps) {
  const isEditing = !!account;

  // Get only GROUP accounts for parent selection
  const groupAccounts = accounts.filter((a) => a.accountType === "GROUP");

  // Fetch villages for dropdown
  const { data: villages = [] } = useVillages(organizationId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="party-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Party" : "Add New Party"}</DialogTitle>
        </DialogHeader>

        {/* Only render form when dialog is open to reset state */}
        {open && (
          <PartyFormInner
            account={account}
            nextCode={nextCode}
            organizationId={organizationId}
            groupAccounts={groupAccounts}
            villages={villages}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
            isEditing={isEditing}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
