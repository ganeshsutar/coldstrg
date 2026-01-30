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
import { Card, CardContent } from "@/components/ui/card";
import type { LoanAmount } from "../../types";
import { formatCurrency, formatLoanNo } from "../../utils";

interface RepaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: LoanAmount;
  onSubmit: (loanId: string, amount: number) => void;
  isPending: boolean;
}

export function RepaymentDialog({
  open,
  onOpenChange,
  loan,
  onSubmit,
  isPending,
}: RepaymentDialogProps) {
  const [amount, setAmount] = useState(loan.outstandingBalance);

  function handleSubmit() {
    if (amount <= 0) return;
    onSubmit(loan.id, amount);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Repayment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Loan #</p>
                  <p className="font-medium">{formatLoanNo(loan.loanNo)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Party</p>
                  <p className="font-medium">{loan.partyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Disbursed</p>
                  <p className="font-medium">
                    {formatCurrency(loan.disbursedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Repaid</p>
                  <p className="font-medium">
                    {formatCurrency(loan.repaidAmount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Outstanding Balance</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(loan.outstandingBalance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="repaymentAmount">Repayment Amount *</Label>
            <Input
              id="repaymentAmount"
              type="number"
              step="0.01"
              min="0"
              max={loan.outstandingBalance}
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <button
                type="button"
                className="hover:underline"
                onClick={() => setAmount(loan.outstandingBalance)}
              >
                Full amount
              </button>
              <button
                type="button"
                className="hover:underline"
                onClick={() => setAmount(Math.round(loan.outstandingBalance / 2))}
              >
                Half amount
              </button>
            </div>
          </div>

          {amount > loan.outstandingBalance && (
            <p className="text-sm text-destructive">
              Amount exceeds outstanding balance
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending || amount <= 0 || amount > loan.outstandingBalance
            }
          >
            {isPending ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
