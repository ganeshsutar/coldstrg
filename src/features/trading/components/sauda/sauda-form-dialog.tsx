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
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import {
  useNextSaudaNo,
  useCreateSauda,
  useUpdateSauda,
} from "../../hooks";
import type { Sauda, SaudaFormInput } from "../../types";
import { formatSaudaNo, formatCurrency, calculateDealAmount, calculateDueDate } from "../../utils";

interface SaudaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  sauda?: Sauda | null;
  onSuccess?: () => void;
}

interface SaudaFormContentProps {
  organizationId: string;
  sauda?: Sauda | null;
  nextSaudaNo: number;
  onSave: (input: SaudaFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function SaudaFormContent({
  organizationId,
  sauda,
  nextSaudaNo,
  onSave,
  onCancel,
  isPending,
}: SaudaFormContentProps) {
  const isEditing = !!sauda;
  const { data: accounts = [] } = useAccountList(organizationId);

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state
  const [saudaDate, setSaudaDate] = useState(
    sauda?.saudaDate ?? new Date().toISOString().split("T")[0]
  );
  const [dueDays, setDueDays] = useState(sauda?.dueDays ?? 30);
  const [sellerPartyId, setSellerPartyId] = useState(sauda?.sellerPartyId ?? "");
  const [buyerPartyId, setBuyerPartyId] = useState(sauda?.buyerPartyId ?? "");
  const [buyerContact, setBuyerContact] = useState(sauda?.buyerContact ?? "");
  const [buyerLocation, setBuyerLocation] = useState(sauda?.buyerLocation ?? "");
  const [commodityName, setCommodityName] = useState(sauda?.commodityName ?? "");
  const [variety, setVariety] = useState(sauda?.variety ?? "");
  const [quantity, setQuantity] = useState(sauda?.quantity ?? 0);
  const [rate, setRate] = useState(sauda?.rate ?? 0);
  const [paymentTerms, setPaymentTerms] = useState(sauda?.paymentTerms ?? "");
  const [deliveryLocation, setDeliveryLocation] = useState(sauda?.deliveryLocation ?? "");
  const [remarks, setRemarks] = useState(sauda?.remarks ?? "");

  // Get selected party details
  const selectedSeller = useMemo(
    () => partyAccounts.find((a) => a.id === sellerPartyId),
    [partyAccounts, sellerPartyId]
  );

  const selectedBuyer = useMemo(
    () => partyAccounts.find((a) => a.id === buyerPartyId),
    [partyAccounts, buyerPartyId]
  );

  // Calculate deal amount
  const amount = useMemo(
    () => calculateDealAmount(quantity, rate),
    [quantity, rate]
  );

  // Calculate due date
  const dueDate = useMemo(
    () => calculateDueDate(saudaDate, dueDays),
    [saudaDate, dueDays]
  );

  function handleSubmit() {
    if (!sellerPartyId || !buyerPartyId || quantity <= 0 || rate <= 0) return;

    onSave({
      saudaDate,
      dueDate,
      dueDays,
      sellerPartyId,
      sellerPartyName: selectedSeller?.name ?? undefined,
      sellerVillage: selectedSeller?.city ?? undefined,
      buyerPartyId,
      buyerPartyName: selectedBuyer?.name ?? undefined,
      buyerContact: buyerContact || undefined,
      buyerLocation: buyerLocation || (selectedBuyer?.city ?? undefined),
      commodityName: commodityName || undefined,
      variety: variety || undefined,
      quantity,
      rate,
      paymentTerms: paymentTerms || undefined,
      deliveryLocation: deliveryLocation || undefined,
      remarks: remarks || undefined,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Deal (Sauda)" : "New Deal (Sauda)"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Deal Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Deal Number</Label>
                <Input
                  value={formatSaudaNo(sauda?.saudaNo ?? nextSaudaNo)}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="saudaDate">Date *</Label>
                <Input
                  id="saudaDate"
                  type="date"
                  value={saudaDate}
                  onChange={(e) => setSaudaDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dueDays">Due Days</Label>
                <Input
                  id="dueDays"
                  type="number"
                  min="0"
                  value={dueDays}
                  onChange={(e) => setDueDays(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Due: {dueDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Seller */}
              <div className="flex flex-col gap-2">
                <Label>Seller (Party with stock) *</Label>
                <Select value={sellerPartyId} onValueChange={setSellerPartyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select seller" />
                  </SelectTrigger>
                  <SelectContent>
                    {partyAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSeller && (
                  <p className="text-xs text-muted-foreground">
                    {selectedSeller.city} | Balance: {formatCurrency(selectedSeller.balance ?? 0)}
                  </p>
                )}
              </div>

              {/* Buyer */}
              <div className="flex flex-col gap-2">
                <Label>Buyer (Trader/Vyapari) *</Label>
                <Select value={buyerPartyId} onValueChange={setBuyerPartyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {partyAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBuyer && (
                  <p className="text-xs text-muted-foreground">
                    {selectedBuyer.city} | {selectedBuyer.phone || "No phone"}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="buyerContact">Buyer Contact</Label>
                <Input
                  id="buyerContact"
                  value={buyerContact}
                  onChange={(e) => setBuyerContact(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="buyerLocation">Buyer Location</Label>
                <Input
                  id="buyerLocation"
                  value={buyerLocation}
                  onChange={(e) => setBuyerLocation(e.target.value)}
                  placeholder="City/Location"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Deal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="commodityName">Commodity</Label>
                <Input
                  id="commodityName"
                  value={commodityName}
                  onChange={(e) => setCommodityName(e.target.value)}
                  placeholder="e.g., Potato"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="variety">Variety (Kism)</Label>
                <Input
                  id="variety"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g., Chipsona"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity">Quantity (Bags) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity || ""}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rate">Rate (₹/Quintal) *</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={rate || ""}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  value={formatCurrency(amount)}
                  disabled
                  className="font-semibold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Terms & Remarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g., Advance 50%, Balance on delivery"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deliveryLocation">Delivery Location</Label>
                <Input
                  id="deliveryLocation"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Delivery address"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Additional notes..."
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !sellerPartyId || !buyerPartyId || quantity <= 0 || rate <= 0}
        >
          {isPending ? "Saving..." : isEditing ? "Update" : "Create Deal"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function SaudaFormDialog({
  open,
  onOpenChange,
  organizationId,
  sauda,
  onSuccess,
}: SaudaFormDialogProps) {
  const { data: nextSaudaNo = 1 } = useNextSaudaNo(organizationId);
  const createMutation = useCreateSauda();
  const updateMutation = useUpdateSauda();

  function handleSave(formInput: SaudaFormInput) {
    if (sauda) {
      // Update existing sauda
      updateMutation.mutate(
        {
          id: sauda.id,
          organizationId,
          ...formInput,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        }
      );
    } else {
      // Create new sauda
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
  }

  const formKey = `${open}-${sauda?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {open && (
          <SaudaFormContent
            key={formKey}
            organizationId={organizationId}
            sauda={sauda}
            nextSaudaNo={nextSaudaNo}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
