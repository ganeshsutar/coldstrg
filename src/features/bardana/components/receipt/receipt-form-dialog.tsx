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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import { useBardanaTypeList } from "../../hooks/use-bardana-types";
import { useBardanaStockByParty } from "../../hooks/use-bardana-stock";
import type {
  BardanaReceiptHeader,
  BardanaReceiptFormInput,
  BardanaConditionValue,
} from "../../types";
import { formatReceiptVoucherNo } from "../../utils/voucher-number";
import {
  calculateReceiptItemAmounts,
  calculateReceiptTotals,
  formatCurrency,
  formatNumber,
} from "../../utils/calculations";

interface ReceiptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt?: BardanaReceiptHeader | null;
  nextVoucherNo: number;
  organizationId: string;
  onSave: (input: BardanaReceiptFormInput) => void;
  isPending: boolean;
}

interface ReceiptItemRow {
  bardanaTypeId: string;
  bardanaTypeName: string;
  outstandingQty: number;
  quantity: number;
  condition: BardanaConditionValue;
  rate: number;
  creditRate: number;
  amount: number;
  deduction: number;
  netAmount: number;
}

const CONDITIONS: { value: BardanaConditionValue; label: string }[] = [
  { value: "GOOD", label: "Good (100%)" },
  { value: "FAIR", label: "Fair (50%)" },
  { value: "DAMAGED", label: "Damaged (0%)" },
  { value: "UNUSABLE", label: "Unusable (0%)" },
];

interface ReceiptFormContentProps {
  receipt?: BardanaReceiptHeader | null;
  nextVoucherNo: number;
  organizationId: string;
  onSave: (input: BardanaReceiptFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function ReceiptFormContent({
  receipt,
  nextVoucherNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: ReceiptFormContentProps) {
  const isEditing = !!receipt;

  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: bardanaTypes = [] } = useBardanaTypeList(organizationId);

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state - initialized from receipt prop
  const [partyId, setPartyId] = useState(receipt?.partyId ?? "");
  const [receiptDate, setReceiptDate] = useState(
    receipt?.receiptDate ?? new Date().toISOString().split("T")[0]
  );
  const [narration, setNarration] = useState(receipt?.narration ?? "");
  const [items, setItems] = useState<ReceiptItemRow[]>([]);

  // Get party's outstanding bardana
  const { data: partyStock = [] } = useBardanaStockByParty(
    organizationId,
    partyId || undefined
  );

  // Get selected party details
  const selectedParty = useMemo(
    () => partyAccounts.find((a) => a.id === partyId),
    [partyAccounts, partyId]
  );

  // Outstanding by type
  const outstandingByType = useMemo(() => {
    const map = new Map<string, { balance: number; rate: number; typeName: string }>();
    partyStock.forEach((s) => {
      if (s.balance > 0) {
        const type = bardanaTypes.find((t) => t.id === s.bardanaTypeId);
        map.set(s.bardanaTypeId, {
          balance: s.balance,
          rate: type?.defaultRate ?? 0,
          typeName: s.bardanaTypeName ?? type?.name ?? "",
        });
      }
    });
    return map;
  }, [partyStock, bardanaTypes]);

  // Calculate totals
  const totals = useMemo(() => calculateReceiptTotals(items), [items]);

  // Add item row
  function addItem() {
    setItems([
      ...items,
      {
        bardanaTypeId: "",
        bardanaTypeName: "",
        outstandingQty: 0,
        quantity: 0,
        condition: "GOOD",
        rate: 0,
        creditRate: 0,
        amount: 0,
        deduction: 0,
        netAmount: 0,
      },
    ]);
  }

  // Update item row
  function updateItem(index: number, updates: Partial<ReceiptItemRow>) {
    const newItems = [...items];
    const item = { ...newItems[index], ...updates };

    // If type changed, update from outstanding data
    if (updates.bardanaTypeId) {
      const outstanding = outstandingByType.get(updates.bardanaTypeId);
      if (outstanding) {
        item.bardanaTypeName = outstanding.typeName;
        item.outstandingQty = outstanding.balance;
        item.rate = outstanding.rate;
      }
    }

    // Recalculate amounts based on condition
    const amounts = calculateReceiptItemAmounts(
      item.quantity,
      item.rate,
      item.condition
    );
    item.creditRate = amounts.creditRate;
    item.amount = amounts.amount;
    item.deduction = amounts.deduction;
    item.netAmount = amounts.netAmount;

    newItems[index] = item;
    setItems(newItems);
  }

  // Remove item row
  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  // Handle save
  function handleSubmit() {
    if (!partyId || items.length === 0) {
      return;
    }

    const formInput: BardanaReceiptFormInput = {
      partyId,
      partyName: selectedParty?.name,
      partyVillage: selectedParty?.city ?? undefined,
      receiptDate,
      narration: narration || undefined,
      items: items.map((item) => ({
        bardanaTypeId: item.bardanaTypeId,
        bardanaTypeName: item.bardanaTypeName,
        quantity: item.quantity,
        condition: item.condition,
        rate: item.rate,
      })),
    };

    onSave(formInput);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Bardana Return" : "Return Bardana"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Party & Date */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Return Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Voucher Number</Label>
                <Input
                  value={formatReceiptVoucherNo(nextVoucherNo)}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="receiptDate">Date *</Label>
                <Input
                  id="receiptDate"
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
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
            </div>

            {/* Outstanding Summary */}
            {partyId && outstandingByType.size > 0 && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2">
                  Outstanding Bardana
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {Array.from(outstandingByType.entries()).map(
                    ([typeId, data]) => (
                      <div key={typeId} className="space-y-0.5">
                        <div className="text-muted-foreground">
                          {data.typeName}
                        </div>
                        <div className="font-medium">
                          {formatNumber(data.balance)} bags
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @ {formatCurrency(data.rate)}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {partyId && outstandingByType.size === 0 && (
              <div className="rounded-lg border bg-muted/50 p-4 text-center text-muted-foreground">
                No outstanding bardana for this party
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Return Items</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={addItem}
              disabled={outstandingByType.size === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {outstandingByType.size === 0
                  ? "Select a party with outstanding bardana"
                  : 'No items added. Click "Add Item" to start.'}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-3">Type</div>
                  <div className="col-span-1">O/S</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Condition</div>
                  <div className="col-span-1">Rate</div>
                  <div className="col-span-1">Deduct</div>
                  <div className="col-span-2">Net Amt</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Rows */}
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-3">
                      <Select
                        value={item.bardanaTypeId}
                        onValueChange={(val) =>
                          updateItem(index, { bardanaTypeId: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(outstandingByType.entries()).map(
                            ([typeId, data]) => (
                              <SelectItem key={typeId} value={typeId}>
                                {data.typeName} ({data.balance})
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 text-sm text-muted-foreground">
                      {item.outstandingQty}
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        max={item.outstandingQty}
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateItem(index, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={item.condition}
                        onValueChange={(val) =>
                          updateItem(index, {
                            condition: val as BardanaConditionValue,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 text-sm">
                      {formatCurrency(item.rate)}
                    </div>
                    <div className="col-span-1 text-sm text-red-600">
                      {item.deduction > 0 && `-${formatCurrency(item.deduction)}`}
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={formatCurrency(item.netAmount)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="border-t pt-3 mt-3 space-y-1">
                  <div className="grid grid-cols-12 gap-2 items-center text-sm">
                    <div className="col-span-3 font-medium">Total</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1 font-medium">
                      {totals.totalQuantity}
                    </div>
                    <div className="col-span-2"></div>
                    <div className="col-span-1">
                      {formatCurrency(totals.totalAmount)}
                    </div>
                    <div className="col-span-1 text-red-600">
                      {totals.totalDeduction > 0 &&
                        `-${formatCurrency(totals.totalDeduction)}`}
                    </div>
                    <div className="col-span-2 font-medium">
                      {formatCurrency(totals.netAmount)}
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Good: {totals.totalGoodQuantity} | Fair:{" "}
                    {totals.totalFairQuantity} | Damaged:{" "}
                    {totals.totalDamagedQuantity}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Narration */}
        <div className="flex flex-col gap-2">
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
          disabled={isPending || !partyId || items.length === 0}
        >
          {isPending ? "Saving..." : isEditing ? "Update" : "Save Return"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function ReceiptFormDialog({
  open,
  onOpenChange,
  receipt,
  nextVoucherNo,
  organizationId,
  onSave,
  isPending,
}: ReceiptFormDialogProps) {
  // Use key to reset form state when dialog opens/closes or receipt changes
  const formKey = `${open}-${receipt?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {open && (
          <ReceiptFormContent
            key={formKey}
            receipt={receipt}
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
