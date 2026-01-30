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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { VOUCHER_TYPE_OPTIONS, PAYMENT_MODE_OPTIONS } from "@/config/constants";
import type {
  Voucher,
  CreateVoucherInput,
  VoucherTypeValue,
  PaymentModeValue,
  Account,
} from "../../types";

interface VoucherFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher?: Voucher | null;
  accounts: Account[];
  nextVoucherNo: number;
  organizationId: string;
  onSave: (input: CreateVoucherInput & { id?: string }) => void;
  isPending: boolean;
}

interface FormData {
  voucherNo: string;
  voucherType: VoucherTypeValue;
  date: string;
  drAccountId: string;
  crAccountId: string;
  amount: string;
  rentAmount: string;
  loanAmount: string;
  interestAmount: string;
  bardanaAmount: string;
  otherAmount: string;
  paymentMode: PaymentModeValue | "";
  chequeNo: string;
  chequeDate: string;
  bankName: string;
  narration: string;
}

interface VoucherFormInnerProps {
  voucher?: Voucher | null;
  accounts: Account[];
  nextVoucherNo: number;
  organizationId: string;
  onSave: (input: CreateVoucherInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function VoucherFormInner({
  voucher,
  accounts,
  nextVoucherNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: VoucherFormInnerProps) {
  const isEditing = !!voucher;

  // Only show accounts (not groups) for selection
  const partyAccounts = accounts.filter((a) => a.accountType === "ACCOUNT");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      voucherNo: voucher?.voucherNo?.toString() ?? nextVoucherNo.toString(),
      voucherType: voucher?.voucherType ?? "CR",
      date: voucher?.date ?? new Date().toISOString().split("T")[0],
      drAccountId: voucher?.drAccountId ?? "",
      crAccountId: voucher?.crAccountId ?? "",
      amount: voucher?.amount?.toString() ?? "",
      rentAmount: voucher?.rentAmount?.toString() ?? "0",
      loanAmount: voucher?.loanAmount?.toString() ?? "0",
      interestAmount: voucher?.interestAmount?.toString() ?? "0",
      bardanaAmount: voucher?.bardanaAmount?.toString() ?? "0",
      otherAmount: voucher?.otherAmount?.toString() ?? "0",
      paymentMode: voucher?.paymentMode ?? "",
      chequeNo: voucher?.chequeNo ?? "",
      chequeDate: voucher?.chequeDate ?? "",
      bankName: voucher?.bankName ?? "",
      narration: voucher?.narration ?? "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const voucherType = watch("voucherType");
  const paymentMode = watch("paymentMode");
  const drAccountId = watch("drAccountId");
  const crAccountId = watch("crAccountId");

  const drAccount = partyAccounts.find((a) => a.id === drAccountId);
  const crAccount = partyAccounts.find((a) => a.id === crAccountId);

  const onSubmit = (data: FormData) => {
    const input: CreateVoucherInput & { id?: string } = {
      organizationId,
      voucherNo: parseInt(data.voucherNo, 10),
      voucherType: data.voucherType,
      date: data.date,
      drAccountId: data.drAccountId || undefined,
      drAccountCode: drAccount?.code,
      drAccountName: drAccount?.name,
      crAccountId: data.crAccountId || undefined,
      crAccountCode: crAccount?.code,
      crAccountName: crAccount?.name,
      amount: parseFloat(data.amount) || 0,
      rentAmount: parseFloat(data.rentAmount) || 0,
      loanAmount: parseFloat(data.loanAmount) || 0,
      interestAmount: parseFloat(data.interestAmount) || 0,
      bardanaAmount: parseFloat(data.bardanaAmount) || 0,
      otherAmount: parseFloat(data.otherAmount) || 0,
      paymentMode: data.paymentMode || undefined,
      chequeNo: data.chequeNo || undefined,
      chequeDate: data.chequeDate || undefined,
      bankName: data.bankName || undefined,
      narration: data.narration || undefined,
    };

    if (voucher?.id) {
      input.id = voucher.id;
    }

    onSave(input);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Voucher Type Toggle */}
      <div className="flex flex-col gap-2">
        <Label>Voucher Type</Label>
        <ToggleGroup
          type="single"
          value={voucherType}
          onValueChange={(val) => val && setValue("voucherType", val as VoucherTypeValue)}
          className="justify-start"
        >
          {VOUCHER_TYPE_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="px-4"
            >
              {opt.shortLabel}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="voucherNo">Voucher No</Label>
          <Input
            id="voucherNo"
            type="number"
            {...register("voucherNo", { required: "Required" })}
          />
          {errors.voucherNo && (
            <p className="text-sm text-destructive">{errors.voucherNo.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register("date", { required: "Required" })} />
        </div>
      </div>

      {/* Accounts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="drAccountId">Debit Account (Dr)</Label>
          <Select
            value={drAccountId}
            onValueChange={(val) => setValue("drAccountId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {partyAccounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.code} - {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="crAccountId">Credit Account (Cr)</Label>
          <Select
            value={crAccountId}
            onValueChange={(val) => setValue("crAccountId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {partyAccounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.code} - {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", { required: "Amount is required" })}
          placeholder="0.00"
          className="text-lg font-semibold"
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Allocation Grid */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Amount Allocation (Optional)
        </h4>
        <div className="grid grid-cols-5 gap-3">
          <div className="space-y-1">
            <Label htmlFor="rentAmount" className="text-xs">
              Rent
            </Label>
            <Input
              id="rentAmount"
              type="number"
              step="0.01"
              {...register("rentAmount")}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="loanAmount" className="text-xs">
              Loan
            </Label>
            <Input
              id="loanAmount"
              type="number"
              step="0.01"
              {...register("loanAmount")}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="interestAmount" className="text-xs">
              Interest
            </Label>
            <Input
              id="interestAmount"
              type="number"
              step="0.01"
              {...register("interestAmount")}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bardanaAmount" className="text-xs">
              Bardana
            </Label>
            <Input
              id="bardanaAmount"
              type="number"
              step="0.01"
              {...register("bardanaAmount")}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherAmount" className="text-xs">
              Other
            </Label>
            <Input
              id="otherAmount"
              type="number"
              step="0.01"
              {...register("otherAmount")}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Payment Mode */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Payment Details
        </h4>
        <div className="flex flex-col gap-2">
          <Label>Payment Mode</Label>
          <ToggleGroup
            type="single"
            value={paymentMode}
            onValueChange={(val) => setValue("paymentMode", (val || "") as PaymentModeValue | "")}
            className="justify-start"
          >
            {PAYMENT_MODE_OPTIONS.map((opt) => (
              <ToggleGroupItem key={opt.value} value={opt.value} className="px-4">
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {(paymentMode === "CHEQUE" || paymentMode === "BANK") && (
          <div className="grid grid-cols-3 gap-4">
            {paymentMode === "CHEQUE" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="chequeNo">Cheque No</Label>
                  <Input id="chequeNo" {...register("chequeNo")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="chequeDate">Cheque Date</Label>
                  <Input id="chequeDate" type="date" {...register("chequeDate")} />
                </div>
              </>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" {...register("bankName")} />
            </div>
          </div>
        )}
      </div>

      {/* Narration */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="narration">Narration</Label>
        <Textarea
          id="narration"
          {...register("narration")}
          placeholder="Enter remarks or description..."
          rows={2}
        />
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update Voucher" : "Save Voucher"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function VoucherFormDialog({
  open,
  onOpenChange,
  voucher,
  accounts,
  nextVoucherNo,
  organizationId,
  onSave,
  isPending,
}: VoucherFormDialogProps) {
  const isEditing = !!voucher;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Voucher" : "New Voucher Entry"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <VoucherFormInner
            voucher={voucher}
            accounts={accounts}
            nextVoucherNo={nextVoucherNo}
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
