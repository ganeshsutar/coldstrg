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
import { ACCOUNT_TYPE_OPTIONS, ACCOUNT_NATURE_OPTIONS } from "@/config/constants";
import type {
  Account,
  CreateAccountInput,
  AccountTypeValue,
  AccountNatureValue,
} from "../../types";

// Radix UI Select doesn't allow empty string as value, so we use a sentinel value
const NONE_VALUE = "__none__";

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  parentAccount?: Account | null;
  accounts: Account[];
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateAccountInput & { id?: string }) => void;
  isPending: boolean;
}

interface AccountFormInnerProps {
  account?: Account | null;
  parentAccount?: Account | null;
  accounts: Account[];
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateAccountInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function AccountFormInner({
  account,
  parentAccount,
  accounts,
  nextCode,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: AccountFormInnerProps) {
  const isEditing = !!account;

  // Get potential parent accounts (only groups)
  const parentOptions = accounts.filter((a) => a.accountType === "GROUP");

  // Use useState for controlled inputs (same pattern as ChamberForm)
  const [code, setCode] = useState(account?.code ?? nextCode);
  const [name, setName] = useState(account?.name ?? "");
  const [nameHindi, setNameHindi] = useState(account?.nameHindi ?? "");
  const [accountType, setAccountType] = useState<AccountTypeValue>(account?.accountType ?? "ACCOUNT");
  const [nature, setNature] = useState<AccountNatureValue>(account?.nature ?? parentAccount?.nature ?? "DR");
  const [parentId, setParentId] = useState(account?.parentId ?? parentAccount?.id ?? NONE_VALUE);
  const [openingBalance, setOpeningBalance] = useState(account?.openingBalance?.toString() ?? "0");

  // Form validation errors
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: { code?: string; name?: string } = {};
    if (!code.trim()) newErrors.code = "Code is required";
    if (!name.trim()) newErrors.name = "Name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const parent = parentOptions.find((p) => p.id === parentId);

    const input: CreateAccountInput & { id?: string } = {
      organizationId,
      code,
      name,
      nameHindi: nameHindi || undefined,
      accountType,
      nature,
      parentId: parentId === NONE_VALUE ? undefined : parentId || undefined,
      level: parent ? (parent.level ?? 0) + 1 : 0,
      under: parent?.name,
      openingBalance: parseFloat(openingBalance) || 0,
    };

    if (account?.id) {
      input.id = account.id;
    }

    onSave(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Account Code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
            }}
            placeholder="1000"
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="accountType">Type</Label>
          <Select
            value={accountType}
            onValueChange={(val) => setAccountType(val as AccountTypeValue)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
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
          <Label htmlFor="name">Account Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Enter account name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nameHindi">Name (Hindi)</Label>
          <Input
            id="nameHindi"
            value={nameHindi}
            onChange={(e) => setNameHindi(e.target.value)}
            placeholder="हिंदी में नाम"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nature">Nature</Label>
          <Select
            value={nature}
            onValueChange={(val) => setNature(val as AccountNatureValue)}
          >
            <SelectTrigger>
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="parentId">Under</Label>
          <Select
            value={parentId}
            onValueChange={(val) => setParentId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>-- None (Root) --</SelectItem>
              {parentOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.code} - {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {accountType === "ACCOUNT" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="openingBalance">Opening Balance</Label>
          <Input
            id="openingBalance"
            type="number"
            step="0.01"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="0.00"
          />
        </div>
      )}

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update" : "Add Account"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AccountFormDialog({
  open,
  onOpenChange,
  account,
  parentAccount,
  accounts,
  nextCode,
  organizationId,
  onSave,
  isPending,
}: AccountFormDialogProps) {
  const isEditing = !!account;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Account" : "Add New Account"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <AccountFormInner
            key={account?.id ?? 'new'}
            account={account}
            parentAccount={parentAccount}
            accounts={accounts}
            nextCode={nextCode}
            organizationId={organizationId}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
