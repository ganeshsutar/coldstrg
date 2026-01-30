import { useState, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import {
  useNextAdvanceNo,
  useCreateAdvance,
  usePendingAdvancesByParty,
} from "../../hooks";
import { LimitCheckCard } from "./limit-check-card";
import type { Advance, AdvanceFormInput, PaymentModeValue } from "../../types";
import { formatAdvanceNo, formatCurrency } from "../../utils";

interface AdvanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  advance?: Advance | null;
  onSuccess?: () => void;
}

interface AdvanceFormContentProps {
  organizationId: string;
  advance?: Advance | null;
  nextAdvanceNo: number;
  onSave: (input: AdvanceFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function AdvanceFormContent({
  organizationId,
  advance,
  nextAdvanceNo,
  onSave,
  onCancel,
  isPending,
}: AdvanceFormContentProps) {
  const isEditing = !!advance;
  const { data: accounts = [] } = useAccountList(organizationId);

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state
  const [partyId, setPartyId] = useState(advance?.partyId ?? "");
  const [date, setDate] = useState(
    advance?.date ?? new Date().toISOString().split("T")[0]
  );
  const [expectedDate, setExpectedDate] = useState(advance?.expectedDate ?? "");
  const [expectedBags, setExpectedBags] = useState(advance?.expectedBags ?? 0);
  const [amount, setAmount] = useState(advance?.amount ?? 0);
  const [interestRate, setInterestRate] = useState(advance?.interestRate ?? 0);
  const [paymentMode, setPaymentMode] = useState<PaymentModeValue>(
    advance?.paymentMode ?? "CASH"
  );
  const [narration, setNarration] = useState(advance?.narration ?? "");

  // Get existing advances for selected party
  const { data: existingAdvances = [] } = usePendingAdvancesByParty(
    organizationId,
    partyId || undefined
  );

  // Calculate existing advance total (excluding current if editing)
  const existingAdvanceTotal = useMemo(() => {
    return existingAdvances
      .filter((a) => !isEditing || a.id !== advance?.id)
      .reduce((sum, a) => sum + a.amount, 0);
  }, [existingAdvances, isEditing, advance?.id]);

  // Get selected party details
  const selectedParty = useMemo(
    () => partyAccounts.find((a) => a.id === partyId),
    [partyAccounts, partyId]
  );

  // Default advance per bag (would come from settings)
  const advancePerBag = 500; // Example: Rs. 500 per bag

  function handleSubmit() {
    if (!partyId || amount <= 0) return;

    onSave({
      partyId,
      partyName: selectedParty?.name,
      date,
      expectedDate: expectedDate || undefined,
      expectedBags: expectedBags || undefined,
      amount,
      interestRate,
      paymentMode,
      narration: narration || undefined,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Advance" : "Book Advance"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Voucher Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Advance Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voucher Number</Label>
                <Input
                  value={formatAdvanceNo(advance?.advanceNo ?? nextAdvanceNo)}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Party *</Label>
              <Select value={partyId} onValueChange={setPartyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select party" />
                </SelectTrigger>
                <SelectContent>
                  {partyAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedParty && (
                <p className="text-xs text-muted-foreground">
                  Balance: {formatCurrency(selectedParty.balance ?? 0)} | Loan
                  Dr: {formatCurrency(selectedParty.loanDr ?? 0)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expected Goods */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Expected Goods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedBags">Expected Bags</Label>
                <Input
                  id="expectedBags"
                  type="number"
                  min="0"
                  value={expectedBags || ""}
                  onChange={(e) =>
                    setExpectedBags(parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedDate">Expected Arrival</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advance Amount */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Advance Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (% p.m.)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  min="0"
                  value={interestRate || ""}
                  onChange={(e) =>
                    setInterestRate(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <ToggleGroup
                type="single"
                value={paymentMode}
                onValueChange={(val) =>
                  val && setPaymentMode(val as PaymentModeValue)
                }
                className="justify-start"
              >
                <ToggleGroupItem value="CASH">Cash</ToggleGroupItem>
                <ToggleGroupItem value="CHEQUE">Cheque</ToggleGroupItem>
                <ToggleGroupItem value="BANK">Bank</ToggleGroupItem>
                <ToggleGroupItem value="UPI">UPI</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>

        {/* Limit Check */}
        {expectedBags > 0 && (
          <LimitCheckCard
            expectedBags={expectedBags}
            advancePerBag={advancePerBag}
            existingAdvance={existingAdvanceTotal}
            requestedAmount={amount}
          />
        )}

        {/* Narration */}
        <div className="space-y-2">
          <Label htmlFor="narration">Narration</Label>
          <Textarea
            id="narration"
            placeholder="Additional notes..."
            rows={2}
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending || !partyId || amount <= 0}>
          {isPending ? "Saving..." : isEditing ? "Update" : "Save Advance"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function AdvanceFormDialog({
  open,
  onOpenChange,
  organizationId,
  advance,
  onSuccess,
}: AdvanceFormDialogProps) {
  const { data: nextAdvanceNo = 1 } = useNextAdvanceNo(organizationId);
  const createMutation = useCreateAdvance();

  function handleSave(formInput: AdvanceFormInput) {
    createMutation.mutate(
      { organizationId, formInput },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  }

  const formKey = `${open}-${advance?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {open && (
          <AdvanceFormContent
            key={formKey}
            organizationId={organizationId}
            advance={advance}
            nextAdvanceNo={nextAdvanceNo}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isPending={createMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
