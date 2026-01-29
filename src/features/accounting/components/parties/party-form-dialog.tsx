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
import { ACCOUNT_NATURE_OPTIONS } from "@/config/constants";
import type { Account, CreateAccountInput, AccountNatureValue } from "../../types";

interface PartyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateAccountInput & { id?: string }) => void;
  isPending: boolean;
}

interface FormData {
  code: string;
  name: string;
  nameHindi: string;
  nature: AccountNatureValue;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  aadhar: string;
  pan: string;
  gst: string;
  openingBalance: string;
  interestRate: string;
  drLimit: string;
}

export function PartyFormDialog({
  open,
  onOpenChange,
  account,
  nextCode,
  organizationId,
  onSave,
  isPending,
}: PartyFormDialogProps) {
  const isEditing = !!account;

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
      nature: account?.nature ?? "DR",
      phone: account?.phone ?? "",
      address1: account?.address1 ?? "",
      address2: account?.address2 ?? "",
      city: account?.city ?? "",
      state: account?.state ?? "",
      aadhar: account?.aadhar ?? "",
      pan: account?.pan ?? "",
      gst: account?.gst ?? "",
      openingBalance: account?.openingBalance?.toString() ?? "0",
      interestRate: account?.interestRate?.toString() ?? "",
      drLimit: account?.drLimit?.toString() ?? "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const nature = watch("nature");

  const onSubmit = (data: FormData) => {
    const input: CreateAccountInput & { id?: string } = {
      organizationId,
      code: data.code,
      name: data.name,
      nameHindi: data.nameHindi || undefined,
      accountType: "ACCOUNT",
      nature: data.nature,
      phone: data.phone || undefined,
      address1: data.address1 || undefined,
      address2: data.address2 || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      aadhar: data.aadhar || undefined,
      pan: data.pan || undefined,
      gst: data.gst || undefined,
      openingBalance: parseFloat(data.openingBalance) || 0,
      interestRate: data.interestRate ? parseFloat(data.interestRate) : undefined,
      drLimit: data.drLimit ? parseFloat(data.drLimit) : undefined,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Party" : "Add New Party"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Party Code</Label>
              <Input
                id="code"
                {...register("code", { required: "Code is required" })}
                placeholder="P0001"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Party Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter party name"
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

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Mobile number"
            />
          </div>

          {/* Address */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  {...register("address1")}
                  placeholder="Street address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  {...register("address2")}
                  placeholder="Village/Area"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} placeholder="State" />
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Identity</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar</Label>
                <Input
                  id="aadhar"
                  {...register("aadhar")}
                  placeholder="XXXX XXXX XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN</Label>
                <Input id="pan" {...register("pan")} placeholder="XXXXX0000X" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst">GST</Label>
                <Input
                  id="gst"
                  {...register("gst")}
                  placeholder="GST Number"
                />
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Financial</h4>
            <div className="grid grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  {...register("interestRate")}
                  placeholder="18.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drLimit">DR Limit</Label>
                <Input
                  id="drLimit"
                  type="number"
                  step="0.01"
                  {...register("drLimit")}
                  placeholder="Credit limit"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Update Party" : "Add Party"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
