import { useForm } from "react-hook-form";
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

interface FormData {
  code: string;
  name: string;
  nameHindi: string;
  accountType: AccountTypeValue;
  nature: AccountNatureValue;
  parentId: string;
  openingBalance: string;
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

  // Get potential parent accounts (only groups)
  const parentOptions = accounts.filter((a) => a.accountType === "GROUP");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      code: account?.code ?? nextCode,
      name: account?.name ?? "",
      nameHindi: account?.nameHindi ?? "",
      accountType: account?.accountType ?? "ACCOUNT",
      nature: account?.nature ?? parentAccount?.nature ?? "DR",
      parentId: account?.parentId ?? parentAccount?.id ?? NONE_VALUE,
      openingBalance: account?.openingBalance?.toString() ?? "0",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const accountType = watch("accountType");
  const nature = watch("nature");
  const parentId = watch("parentId");

  const onSubmit = (data: FormData) => {
    const parent = parentOptions.find((p) => p.id === data.parentId);

    const input: CreateAccountInput & { id?: string } = {
      organizationId,
      code: data.code,
      name: data.name,
      nameHindi: data.nameHindi || undefined,
      accountType: data.accountType,
      nature: data.nature,
      parentId: data.parentId === NONE_VALUE ? undefined : data.parentId || undefined,
      level: parent ? (parent.level ?? 0) + 1 : 0,
      under: parent?.name,
      openingBalance: parseFloat(data.openingBalance) || 0,
    };

    if (account?.id) {
      input.id = account.id;
    }

    onSave(input);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) reset();
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Account" : "Add New Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Account Code</Label>
              <Input
                id="code"
                {...register("code", { required: "Code is required" })}
                placeholder="1000"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Type</Label>
              <Select
                value={accountType}
                onValueChange={(val) => setValue("accountType", val as AccountTypeValue)}
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
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter account name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameHindi">Name (Hindi)</Label>
              <Input
                id="nameHindi"
                {...register("nameHindi")}
                placeholder="हिंदी में नाम"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nature">Nature</Label>
              <Select
                value={nature}
                onValueChange={(val) => setValue("nature", val as AccountNatureValue)}
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
            <div className="space-y-2">
              <Label htmlFor="parentId">Under</Label>
              <Select
                value={parentId}
                onValueChange={(val) => setValue("parentId", val)}
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
            <div className="space-y-2">
              <Label htmlFor="openingBalance">Opening Balance</Label>
              <Input
                id="openingBalance"
                type="number"
                step="0.01"
                {...register("openingBalance")}
                placeholder="0.00"
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Update" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
