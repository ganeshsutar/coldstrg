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

  // Form state using useState (like Party form)
  const [voucherNo, setVoucherNo] = useState(
    voucher?.voucherNo?.toString() ?? nextVoucherNo.toString()
  );
  const [voucherType, setVoucherType] = useState<VoucherTypeValue>(
    voucher?.voucherType ?? "CR"
  );
  const [date, setDate] = useState(
    voucher?.date ?? new Date().toISOString().split("T")[0]
  );
  const [drAccountId, setDrAccountId] = useState(voucher?.drAccountId ?? "");
  const [crAccountId, setCrAccountId] = useState(voucher?.crAccountId ?? "");
  const [amount, setAmount] = useState(voucher?.amount?.toString() ?? "");
  const [rentAmount, setRentAmount] = useState(
    voucher?.rentAmount?.toString() ?? "0"
  );
  const [loanAmount, setLoanAmount] = useState(
    voucher?.loanAmount?.toString() ?? "0"
  );
  const [interestAmount, setInterestAmount] = useState(
    voucher?.interestAmount?.toString() ?? "0"
  );
  const [bardanaAmount, setBardanaAmount] = useState(
    voucher?.bardanaAmount?.toString() ?? "0"
  );
  const [otherAmount, setOtherAmount] = useState(
    voucher?.otherAmount?.toString() ?? "0"
  );
  const [paymentMode, setPaymentMode] = useState<PaymentModeValue | "">(
    voucher?.paymentMode ?? ""
  );
  const [chequeNo, setChequeNo] = useState(voucher?.chequeNo ?? "");
  const [chequeDate, setChequeDate] = useState(voucher?.chequeDate ?? "");
  const [bankName, setBankName] = useState(voucher?.bankName ?? "");
  const [narration, setNarration] = useState(voucher?.narration ?? "");

  // Validation errors
  const [errors, setErrors] = useState<{
    voucherNo?: string;
    date?: string;
    amount?: string;
  }>({});

  const drAccount = partyAccounts.find((a) => a.id === drAccountId);
  const crAccount = partyAccounts.find((a) => a.id === crAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: { voucherNo?: string; date?: string; amount?: string } =
      {};
    if (!voucherNo.trim()) {
      newErrors.voucherNo = "Required";
    }
    if (!date.trim()) {
      newErrors.date = "Required";
    }
    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors
    setErrors({});

    const input: CreateVoucherInput & { id?: string } = {
      organizationId,
      voucherNo: parseInt(voucherNo, 10),
      voucherType,
      date,
      drAccountId: drAccountId || undefined,
      drAccountCode: drAccount?.code,
      drAccountName: drAccount?.name,
      crAccountId: crAccountId || undefined,
      crAccountCode: crAccount?.code,
      crAccountName: crAccount?.name,
      amount: parseFloat(amount) || 0,
      rentAmount: parseFloat(rentAmount) || 0,
      loanAmount: parseFloat(loanAmount) || 0,
      interestAmount: parseFloat(interestAmount) || 0,
      bardanaAmount: parseFloat(bardanaAmount) || 0,
      otherAmount: parseFloat(otherAmount) || 0,
      paymentMode: paymentMode || undefined,
      chequeNo: chequeNo || undefined,
      chequeDate: chequeDate || undefined,
      bankName: bankName || undefined,
      narration: narration || undefined,
    };

    if (voucher?.id) {
      input.id = voucher.id;
    }

    onSave(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="voucher-form"
    >
      {/* Voucher Type Toggle */}
      <div className="flex flex-col gap-2">
        <Label>Voucher Type</Label>
        <ToggleGroup
          type="single"
          value={voucherType}
          onValueChange={(val) => val && setVoucherType(val as VoucherTypeValue)}
          className="justify-start"
          data-testid="voucher-form-type-toggle"
        >
          {VOUCHER_TYPE_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="px-4"
              data-testid={`voucher-form-type-${opt.value.toLowerCase()}`}
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
            data-testid="voucher-form-number-input"
            value={voucherNo}
            onChange={(e) => {
              setVoucherNo(e.target.value);
              if (errors.voucherNo)
                setErrors((prev) => ({ ...prev, voucherNo: undefined }));
            }}
          />
          {errors.voucherNo && (
            <p className="text-sm text-destructive">{errors.voucherNo}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            data-testid="voucher-form-date-input"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date)
                setErrors((prev) => ({ ...prev, date: undefined }));
            }}
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date}</p>
          )}
        </div>
      </div>

      {/* Accounts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="drAccountId">Debit Account (Dr)</Label>
          <Select value={drAccountId} onValueChange={setDrAccountId}>
            <SelectTrigger data-testid="voucher-form-dr-account-select">
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
          <Select value={crAccountId} onValueChange={setCrAccountId}>
            <SelectTrigger data-testid="voucher-form-cr-account-select">
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
          data-testid="voucher-form-amount-input"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (errors.amount)
              setErrors((prev) => ({ ...prev, amount: undefined }));
          }}
          placeholder="0.00"
          className="text-lg font-semibold"
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
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
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
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
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
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
              value={interestAmount}
              onChange={(e) => setInterestAmount(e.target.value)}
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
              value={bardanaAmount}
              onChange={(e) => setBardanaAmount(e.target.value)}
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
              value={otherAmount}
              onChange={(e) => setOtherAmount(e.target.value)}
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
            onValueChange={(val) =>
              setPaymentMode((val || "") as PaymentModeValue | "")
            }
            className="justify-start"
            data-testid="voucher-form-payment-mode-toggle"
          >
            {PAYMENT_MODE_OPTIONS.map((opt) => (
              <ToggleGroupItem
                key={opt.value}
                value={opt.value}
                className="px-4"
                data-testid={`voucher-form-payment-${opt.value.toLowerCase()}`}
              >
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
                  <Input
                    id="chequeNo"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="chequeDate">Cheque Date</Label>
                  <Input
                    id="chequeDate"
                    type="date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Narration */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="narration">Narration</Label>
        <Textarea
          id="narration"
          data-testid="voucher-form-narration-input"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          placeholder="Enter remarks or description..."
          rows={2}
        />
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-testid="voucher-form-cancel-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          data-testid="voucher-form-submit-button"
        >
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
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid="voucher-form-dialog"
      >
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
