import React, { useState, useMemo } from "react";
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
import { AlertCircle } from "lucide-react";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import { useAmadList } from "@/features/inventory/hooks/use-amad";
import { useNextLoanNo, useCreateLoan, useLoansByAmad } from "../../hooks";
import { CollateralSelector } from "./collateral-selector";
import type { LoanAmount, LoanAgainstGoodsFormInput, PaymentModeValue } from "../../types";
import { formatLoanNo, formatCurrency, calculateLoanLimit } from "../../utils";

interface LagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  loan?: LoanAmount | null;
  onSuccess?: () => void;
}

interface LagFormContentProps {
  organizationId: string;
  loan?: LoanAmount | null;
  nextLoanNo: number;
  onSave: (input: LoanAgainstGoodsFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

// Interface for Amad data from collateral selector
interface CollateralAmad {
  id: string;
  amadNo: number;
  date: string;
  partyName?: string | null;
  commodityName?: string | null;
  totalPackets: number;
  room?: string | null;
  status?: string | null;
}

function LagFormContent({
  organizationId,
  loan,
  nextLoanNo,
  onSave,
  onCancel,
  isPending,
}: LagFormContentProps) {
  const isEditing = !!loan;
  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: allAmads = [] } = useAmadList(organizationId);

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state
  const [partyId, setPartyId] = useState(loan?.partyId ?? "");
  const [date, setDate] = useState(
    loan?.date ?? new Date().toISOString().split("T")[0]
  );
  const [selectedAmadId, setSelectedAmadId] = useState<string | null>(
    loan?.amadId ?? null
  );
  const [loanAmount, setLoanAmount] = useState(loan?.disbursedAmount ?? 0);
  const [interestRate, setInterestRate] = useState(loan?.interestRate ?? 0);
  const [paymentMode, setPaymentMode] = useState<PaymentModeValue>(
    loan?.paymentMode ?? "CASH"
  );
  const [narration, setNarration] = useState(loan?.narration ?? "");

  // Filter amads for selected party and convert to CollateralAmad type
  const partyAmads = useMemo((): CollateralAmad[] => {
    if (!partyId) return [];
    return allAmads
      .filter((a) => {
        // Match by party name since amad uses partyName string
        const selectedParty = partyAccounts.find((p) => p.id === partyId);
        return (
          selectedParty &&
          a.partyName === selectedParty.name &&
          (a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH")
        );
      })
      .map((a) => ({
        id: a.id,
        amadNo: a.amadNo,
        date: a.date,
        partyName: a.partyName,
        commodityName: a.commodityName,
        totalPackets: a.totalPackets ?? 0,
        room: a.room,
        status: a.status,
      }));
  }, [allAmads, partyId, partyAccounts]);

  // Get existing loans for amads
  const { data: existingLoans = [] } = useLoansByAmad(
    organizationId,
    selectedAmadId ?? undefined
  );

  // Build existing loans map
  const existingLoansMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of existingLoans) {
      if (l.status !== "CLOSED" && (!isEditing || l.id !== loan?.id)) {
        const current = map.get(l.amadId) ?? 0;
        map.set(l.amadId, current + l.outstandingBalance);
      }
    }
    return map;
  }, [existingLoans, isEditing, loan?.id]);

  // Default loan limit per bag (would come from settings)
  const loanLimitPerBag = 1000; // Example: Rs. 1000 per bag

  // Get selected amad details
  const selectedAmad = useMemo(
    () => partyAmads.find((a) => a.id === selectedAmadId),
    [partyAmads, selectedAmadId]
  );

  // Calculate loan limits
  const loanLimits = useMemo(() => {
    if (!selectedAmad) return { maxLoan: 0, available: 0 };
    const existingOnAmad = existingLoansMap.get(selectedAmad.id) ?? 0;
    return calculateLoanLimit(
      selectedAmad.totalPackets,
      loanLimitPerBag,
      existingOnAmad
    );
  }, [selectedAmad, loanLimitPerBag, existingLoansMap]);

  // Get selected party details
  const selectedParty = useMemo(
    () => partyAccounts.find((a) => a.id === partyId),
    [partyAccounts, partyId]
  );

  // Check if over limit
  const isOverLimit = loanAmount > loanLimits.available;

  // Reset amad selection when party changes
  const prevPartyIdRef = React.useRef(partyId);
  React.useEffect(() => {
    if (prevPartyIdRef.current !== partyId && !isEditing) {
      setSelectedAmadId(null);
      setLoanAmount(0);
    }
    prevPartyIdRef.current = partyId;
  }, [partyId, isEditing]);

  function handleSubmit() {
    if (!partyId || !selectedAmadId || loanAmount <= 0) return;

    onSave({
      partyId,
      partyName: selectedParty?.name,
      date,
      amadId: selectedAmadId,
      amadNo: selectedAmad?.amadNo ?? undefined,
      collateralBags: selectedAmad?.totalPackets ?? undefined,
      loanAmount,
      interestRate,
      paymentMode,
      narration: narration || undefined,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Loan" : "Loan Against Goods"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Voucher Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loan Number</Label>
                <Input
                  value={formatLoanNo(loan?.loanNo ?? nextLoanNo)}
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

        {/* Collateral Selection */}
        {partyId && (
          <CollateralSelector
            amads={partyAmads}
            selectedAmadId={selectedAmadId}
            onSelect={setSelectedAmadId}
            loanLimitPerBag={loanLimitPerBag}
            existingLoans={existingLoansMap}
          />
        )}

        {/* Loan Amount */}
        {selectedAmadId && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Loan Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Amount *</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={loanLimits.available}
                    value={loanAmount || ""}
                    onChange={(e) =>
                      setLoanAmount(parseFloat(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Max available: {formatCurrency(loanLimits.available)}
                  </p>
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

              {isOverLimit && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Requested amount exceeds available limit by{" "}
                    {formatCurrency(loanAmount - loanLimits.available)}
                  </span>
                </div>
              )}

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
        <Button
          onClick={handleSubmit}
          disabled={
            isPending ||
            !partyId ||
            !selectedAmadId ||
            loanAmount <= 0 ||
            isOverLimit
          }
        >
          {isPending ? "Saving..." : isEditing ? "Update" : "Disburse Loan"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function LagFormDialog({
  open,
  onOpenChange,
  organizationId,
  loan,
  onSuccess,
}: LagFormDialogProps) {
  const { data: nextLoanNo = 1 } = useNextLoanNo(organizationId);
  const createMutation = useCreateLoan();

  function handleSave(formInput: LoanAgainstGoodsFormInput) {
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

  const formKey = `${open}-${loan?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {open && (
          <LagFormContent
            key={formKey}
            organizationId={organizationId}
            loan={loan}
            nextLoanNo={nextLoanNo}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isPending={createMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
