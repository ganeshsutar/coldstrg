import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccountList } from "@/features/accounting";
import { useUnpaidBillsByParty, usePartyOutstanding } from "../../hooks";
import type { ReceiptFormInput, ReceiptPaymentModeValue, RentBillHeader } from "../../types";
import { formatIndianRupees, convertAmountToWords } from "../../utils";

interface ReceiptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  nextReceiptNo: string;
  preselectedPartyId?: string;
  onSave: (formInput: ReceiptFormInput) => void;
  isPending?: boolean;
}

export function ReceiptFormDialog({
  open,
  onOpenChange,
  organizationId,
  nextReceiptNo,
  preselectedPartyId,
  onSave,
  isPending,
}: ReceiptFormDialogProps) {
  const { data: accounts = [] } = useAccountList(organizationId);

  const [partyId, setPartyId] = useState(preselectedPartyId || "");
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMode, setPaymentMode] = useState<ReceiptPaymentModeValue>("CASH");
  const [amount, setAmount] = useState(0);

  // Cheque fields
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isPdcCheque, setIsPdcCheque] = useState(false);

  // Bank/UPI fields
  const [upiRef, setUpiRef] = useState("");
  const [bankRef, setBankRef] = useState("");

  // Narration
  const [narration, setNarration] = useState("");

  // Bill allocations
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [allocations, setAllocations] = useState<
    Map<string, { billNo: string; allocated: number; balance: number }>
  >(new Map());

  // Fetch data
  const { data: unpaidBills = [] } = useUnpaidBillsByParty(organizationId, partyId);
  const { data: outstanding = 0 } = usePartyOutstanding(organizationId, partyId);

  // Compute auto allocations based on amount and unpaidBills
  const autoAllocations = useMemo(() => {
    if (amount <= 0 || unpaidBills.length === 0) {
      return new Map<string, { billNo: string; allocated: number; balance: number }>();
    }

    let remaining = amount;
    const newAllocations = new Map<
      string,
      { billNo: string; allocated: number; balance: number }
    >();

    // Sort by date (oldest first)
    const sortedBills = [...unpaidBills].sort(
      (a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
    );

    for (const bill of sortedBills) {
      if (remaining <= 0) break;

      const allocatedAmount = Math.min(remaining, bill.balanceAmount);
      if (allocatedAmount > 0) {
        newAllocations.set(bill.id, {
          billNo: bill.billNo,
          allocated: allocatedAmount,
          balance: bill.balanceAmount - allocatedAmount,
        });
        remaining -= allocatedAmount;
      }
    }

    return newAllocations;
  }, [amount, unpaidBills]);

  // Use auto allocations for auto-adjust mode, otherwise use manual allocations
  const effectiveAllocations = autoAdjust ? autoAllocations : allocations;

  // Filter parties (accounts with type ACCOUNT)
  const parties = useMemo(
    () => accounts.filter((a: { accountType: string }) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  const selectedParty = parties.find((p: { id: string }) => p.id === partyId);

  // Total allocated
  const totalAllocated = useMemo(() => {
    let total = 0;
    effectiveAllocations.forEach((a) => {
      total += a.allocated;
    });
    return total;
  }, [effectiveAllocations]);

  function updateAllocation(billId: string, bill: RentBillHeader, allocated: number) {
    const newAllocations = new Map(allocations);
    if (allocated <= 0) {
      newAllocations.delete(billId);
    } else {
      newAllocations.set(billId, {
        billNo: bill.billNo,
        allocated: Math.min(allocated, bill.balanceAmount),
        balance: bill.balanceAmount - Math.min(allocated, bill.balanceAmount),
      });
    }
    setAllocations(newAllocations);
  }

  function handleSubmit() {
    if (!partyId || amount <= 0) return;

    const formInput: ReceiptFormInput = {
      partyId,
      partyName: selectedParty?.name,
      receiptDate,
      paymentMode,
      amount,
      chequeNo: paymentMode === "CHEQUE" ? chequeNo : undefined,
      chequeDate: paymentMode === "CHEQUE" ? chequeDate : undefined,
      bankName: paymentMode === "CHEQUE" ? bankName : undefined,
      branchName: paymentMode === "CHEQUE" ? branchName : undefined,
      isPdcCheque: paymentMode === "CHEQUE" ? isPdcCheque : undefined,
      upiRef: paymentMode === "UPI" ? upiRef : undefined,
      bankRef: paymentMode === "BANK" ? bankRef : undefined,
      narration,
      allocations: Array.from(effectiveAllocations.entries()).map(([rentBillId, a]) => ({
        rentBillId,
        billNo: a.billNo,
        allocatedAmount: a.allocated,
      })),
    };

    onSave(formInput);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="receipt-form-dialog">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Receipt #: {nextReceiptNo}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Party Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Party</Label>
              <Select value={partyId} onValueChange={setPartyId}>
                <SelectTrigger data-testid="receipt-form-party">
                  <SelectValue placeholder="Select party" />
                </SelectTrigger>
                <SelectContent>
                  {parties.map((party: { id: string; name: string }) => (
                    <SelectItem key={party.id} value={party.id} data-testid={`receipt-form-party-option-${party.id}`}>
                      {party.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                data-testid="receipt-form-date"
              />
            </div>
          </div>

          {/* Outstanding Display */}
          {partyId && (
            <div className="p-3 bg-muted rounded-md" data-testid="receipt-form-outstanding">
              <div className="text-sm text-muted-foreground">
                Outstanding Balance
              </div>
              <div className="text-2xl font-bold" data-testid="receipt-form-outstanding-amount">
                {formatIndianRupees(outstanding)}
              </div>
            </div>
          )}

          {/* Payment Mode */}
          <div>
            <Label>Payment Mode</Label>
            <ToggleGroup
              type="single"
              value={paymentMode}
              onValueChange={(v) => v && setPaymentMode(v as ReceiptPaymentModeValue)}
              className="justify-start mt-1"
            >
              <ToggleGroupItem value="CASH" data-testid="receipt-form-mode-cash">Cash</ToggleGroupItem>
              <ToggleGroupItem value="CHEQUE" data-testid="receipt-form-mode-cheque">Cheque</ToggleGroupItem>
              <ToggleGroupItem value="BANK" data-testid="receipt-form-mode-bank">Bank</ToggleGroupItem>
              <ToggleGroupItem value="UPI" data-testid="receipt-form-mode-upi">UPI</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Amount */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
              data-testid="receipt-form-amount"
            />
            {amount > 0 && (
              <p className="text-xs text-muted-foreground mt-1" data-testid="receipt-form-amount-words">
                {convertAmountToWords(amount)}
              </p>
            )}
          </div>

          {/* Cheque Details */}
          {paymentMode === "CHEQUE" && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-md" data-testid="receipt-form-cheque-section">
              <div>
                <Label>Cheque Number</Label>
                <Input
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  placeholder="Cheque #"
                  data-testid="receipt-form-cheque-number"
                />
              </div>
              <div>
                <Label>Cheque Date</Label>
                <Input
                  type="date"
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  data-testid="receipt-form-cheque-date"
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank name"
                  data-testid="receipt-form-cheque-bank"
                />
              </div>
              <div>
                <Label>Branch</Label>
                <Input
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Branch name"
                  data-testid="receipt-form-cheque-branch"
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="pdc"
                  checked={isPdcCheque}
                  onCheckedChange={(c) => setIsPdcCheque(!!c)}
                  data-testid="receipt-form-pdc"
                />
                <label
                  htmlFor="pdc"
                  className="text-sm font-medium leading-none"
                >
                  Post-dated cheque (PDC)
                </label>
              </div>
            </div>
          )}

          {/* UPI Reference */}
          {paymentMode === "UPI" && (
            <div>
              <Label>UPI Reference</Label>
              <Input
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                placeholder="UPI transaction ID"
                data-testid="receipt-form-upi-ref"
              />
            </div>
          )}

          {/* Bank Reference */}
          {paymentMode === "BANK" && (
            <div>
              <Label>Bank Reference / NEFT/RTGS Ref</Label>
              <Input
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
                placeholder="Transaction reference"
                data-testid="receipt-form-bank-ref"
              />
            </div>
          )}

          {/* Bill Adjustment */}
          {partyId && unpaidBills.length > 0 && (
            <div className="space-y-4" data-testid="receipt-form-bill-adjustment-section">
              <div className="flex items-center justify-between">
                <Label>Bill Adjustment</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto"
                    checked={autoAdjust}
                    onCheckedChange={(c) => setAutoAdjust(!!c)}
                    data-testid="receipt-form-auto-adjust"
                  />
                  <label
                    htmlFor="auto"
                    className="text-sm font-medium leading-none"
                  >
                    Auto-adjust (oldest first)
                  </label>
                </div>
              </div>

              <div className="border rounded-md max-h-48 overflow-auto" data-testid="receipt-form-bill-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right w-28">Allocate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unpaidBills.map((bill) => {
                      const allocation = effectiveAllocations.get(bill.id);
                      return (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">
                            {bill.billNo}
                          </TableCell>
                          <TableCell>
                            {new Date(bill.billDate).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatIndianRupees(bill.balanceAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="w-24 text-right"
                              value={allocation?.allocated || ""}
                              onChange={(e) =>
                                updateAllocation(
                                  bill.id,
                                  bill,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              disabled={autoAdjust}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between text-sm">
                <span>Total Allocated: {formatIndianRupees(totalAllocated)}</span>
                {totalAllocated !== amount && amount > 0 && (
                  <span className="text-orange-500">
                    Unallocated: {formatIndianRupees(amount - totalAllocated)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Narration */}
          <div>
            <Label>Narration (Optional)</Label>
            <Textarea
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Payment description..."
              rows={2}
              data-testid="receipt-form-narration"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="receipt-form-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !partyId || amount <= 0}
            data-testid="receipt-form-submit"
          >
            {isPending ? "Saving..." : "Save Receipt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
