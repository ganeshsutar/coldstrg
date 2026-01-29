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
import { Plus, Trash2 } from "lucide-react";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import { useBardanaTypeList } from "../../hooks/use-bardana-types";
import { AdvanceFormSection } from "./advance-form-section";
import type {
  BardanaIssueHeader,
  BardanaIssueFormInput,
  BardanaIssueTypeValue,
} from "../../types";
import {
  formatIssueVoucherNo,
  formatAdvanceVoucherNo,
} from "../../utils/voucher-number";
import {
  calculateItemAmount,
  calculateIssueTotals,
  formatCurrency,
} from "../../utils/calculations";

interface IssueFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue?: BardanaIssueHeader | null;
  nextVoucherNo: number;
  organizationId: string;
  onSave: (input: BardanaIssueFormInput) => void;
  isPending: boolean;
}

interface IssueItemRow {
  bardanaTypeId: string;
  bardanaTypeName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface IssueFormContentProps {
  issue?: BardanaIssueHeader | null;
  nextVoucherNo: number;
  organizationId: string;
  onSave: (input: BardanaIssueFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function IssueFormContent({
  issue,
  nextVoucherNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: IssueFormContentProps) {
  const isEditing = !!issue;

  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: bardanaTypes = [] } = useBardanaTypeList(organizationId);

  // Filter to party accounts only (type ACCOUNT)
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state - initialized from issue prop
  const [partyId, setPartyId] = useState(issue?.partyId ?? "");
  const [issueDate, setIssueDate] = useState(
    issue?.issueDate ?? new Date().toISOString().split("T")[0]
  );
  const [issueType, setIssueType] = useState<BardanaIssueTypeValue>(
    issue?.issueType ?? "REGULAR"
  );
  const [narration, setNarration] = useState(issue?.narration ?? "");
  const [items, setItems] = useState<IssueItemRow[]>([]);

  // Advance fields
  const [interestRatePm, setInterestRatePm] = useState(issue?.interestRatePm ?? 0);
  const [expectedArrivalDate, setExpectedArrivalDate] = useState(
    issue?.expectedArrivalDate ?? ""
  );
  const [expectedBags, setExpectedBags] = useState(issue?.expectedBags ?? 0);
  const [referenceNo, setReferenceNo] = useState(issue?.referenceNo ?? "");

  // Get selected party details
  const selectedParty = useMemo(
    () => partyAccounts.find((a) => a.id === partyId),
    [partyAccounts, partyId]
  );

  // Calculate totals
  const totals = useMemo(() => calculateIssueTotals(items), [items]);

  // Add item row
  function addItem() {
    setItems([
      ...items,
      {
        bardanaTypeId: "",
        bardanaTypeName: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ]);
  }

  // Update item row
  function updateItem(index: number, updates: Partial<IssueItemRow>) {
    const newItems = [...items];
    const item = { ...newItems[index], ...updates };

    // If type changed, update rate from defaults
    if (updates.bardanaTypeId) {
      const type = bardanaTypes.find((t) => t.id === updates.bardanaTypeId);
      if (type) {
        item.bardanaTypeName = type.name;
        item.rate = type.defaultRate ?? 0;
      }
    }

    // Recalculate amount
    item.amount = calculateItemAmount(item.quantity, item.rate);
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

    const formInput: BardanaIssueFormInput = {
      partyId,
      partyName: selectedParty?.name,
      partyVillage: selectedParty?.city ?? undefined,
      issueDate,
      issueType,
      narration: narration || undefined,
      items: items.map((item) => ({
        bardanaTypeId: item.bardanaTypeId,
        bardanaTypeName: item.bardanaTypeName,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
    };

    if (issueType === "ADVANCE") {
      formInput.interestRatePm = interestRatePm;
      formInput.expectedArrivalDate = expectedArrivalDate || undefined;
      formInput.expectedBags = expectedBags || undefined;
      formInput.referenceNo = referenceNo || undefined;
    }

    onSave(formInput);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Bardana Issue" : "Issue Bardana"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Party & Date */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voucher Number</Label>
                <Input
                  value={
                    issueType === "ADVANCE"
                      ? formatAdvanceVoucherNo(nextVoucherNo)
                      : formatIssueVoucherNo(nextVoucherNo)
                  }
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
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
                  Balance: {formatCurrency(selectedParty.balance ?? 0)} | Bar
                  Dr: {formatCurrency(selectedParty.barDr ?? 0)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Issue Type</Label>
              <ToggleGroup
                type="single"
                value={issueType}
                onValueChange={(val) =>
                  val && setIssueType(val as BardanaIssueTypeValue)
                }
                className="justify-start"
              >
                <ToggleGroupItem value="REGULAR">Regular</ToggleGroupItem>
                <ToggleGroupItem value="ADVANCE">
                  Advance (with Interest)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>

        {/* Advance Settings (conditional) */}
        {issueType === "ADVANCE" && (
          <AdvanceFormSection
            interestRatePm={interestRatePm}
            expectedArrivalDate={expectedArrivalDate}
            expectedBags={expectedBags}
            referenceNo={referenceNo}
            totalAmount={totals.totalAmount}
            onInterestRateChange={setInterestRatePm}
            onExpectedArrivalDateChange={setExpectedArrivalDate}
            onExpectedBagsChange={setExpectedBags}
            onReferenceNoChange={setReferenceNo}
          />
        )}

        {/* Items */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Items</CardTitle>
            <Button size="sm" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No items added. Click "Add Item" to start.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-4">Bardana Type</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-3">Amount</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Rows */}
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-4">
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
                          {bardanaTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name} ({formatCurrency(type.defaultRate)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateItem(index, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.rate || ""}
                        onChange={(e) =>
                          updateItem(index, {
                            rate: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={formatCurrency(item.amount)}
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
                <div className="border-t pt-3 mt-3">
                  <div className="grid grid-cols-12 gap-2 items-center font-medium">
                    <div className="col-span-4">Total</div>
                    <div className="col-span-2">{totals.totalQuantity}</div>
                    <div className="col-span-2"></div>
                    <div className="col-span-3">
                      {formatCurrency(totals.totalAmount)}
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
          disabled={isPending || !partyId || items.length === 0}
        >
          {isPending ? "Saving..." : isEditing ? "Update" : "Save Issue"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function IssueFormDialog({
  open,
  onOpenChange,
  issue,
  nextVoucherNo,
  organizationId,
  onSave,
  isPending,
}: IssueFormDialogProps) {
  // Use key to reset form state when dialog opens/closes or issue changes
  const formKey = `${open}-${issue?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {open && (
          <IssueFormContent
            key={formKey}
            issue={issue}
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
