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
import { useAmadList } from "@/features/inventory/hooks/use-amad";
import {
  useNextGpNo,
  useCreateGatePass,
  useOpenSaudas,
} from "../../hooks";
import { AmadSelector } from "./amad-selector";
import type {
  GatePass,
  GatePassFormInput,
  GatePassDetailFormInput,
  AmadSelectionItem,
  Sauda,
} from "../../types";
import { formatGpNo, formatSaudaNo, calculateTotalPackets } from "../../utils";

interface GatePassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  gatePass?: GatePass | null;
  preselectedSauda?: Sauda | null;
  onSuccess?: () => void;
}

interface GatePassFormContentProps {
  organizationId: string;
  gatePass?: GatePass | null;
  preselectedSauda?: Sauda | null;
  nextGpNo: number;
  onSave: (input: GatePassFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function GatePassFormContent({
  organizationId,
  gatePass,
  preselectedSauda,
  nextGpNo,
  onSave,
  onCancel,
  isPending,
}: GatePassFormContentProps) {
  const isEditing = !!gatePass;
  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: amads = [] } = useAmadList(organizationId);
  const { data: openSaudas = [] } = useOpenSaudas(organizationId);

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state
  const [gpDate, setGpDate] = useState(
    gatePass?.gpDate ?? new Date().toISOString().split("T")[0]
  );
  const [gpTime, setGpTime] = useState(
    gatePass?.gpTime ?? new Date().toTimeString().slice(0, 5)
  );
  const [sellerPartyId, setSellerPartyId] = useState(
    gatePass?.sellerPartyId ?? preselectedSauda?.sellerPartyId ?? ""
  );
  const [buyerPartyId, setBuyerPartyId] = useState(
    gatePass?.buyerPartyId ?? preselectedSauda?.buyerPartyId ?? ""
  );
  const [buyerLocation, setBuyerLocation] = useState(
    gatePass?.buyerLocation ?? preselectedSauda?.buyerLocation ?? ""
  );
  const [saudaId, setSaudaId] = useState(
    gatePass?.saudaId ?? preselectedSauda?.id ?? ""
  );
  const [transport, setTransport] = useState(gatePass?.transport ?? "");
  const [vehicleNo, setVehicleNo] = useState(gatePass?.vehicleNo ?? "");
  const [driverName, setDriverName] = useState(gatePass?.driverName ?? "");
  const [driverContact, setDriverContact] = useState(gatePass?.driverContact ?? "");
  const [biltiNo, setBiltiNo] = useState(gatePass?.biltiNo ?? "");
  const [rate, setRate] = useState(gatePass?.rate ?? preselectedSauda?.rate ?? 0);
  const [remarks, setRemarks] = useState(gatePass?.remarks ?? "");
  const [details, setDetails] = useState<GatePassDetailFormInput[]>([]);

  // Get selected party/sauda details
  const selectedSeller = useMemo(
    () => partyAccounts.find((a) => a.id === sellerPartyId),
    [partyAccounts, sellerPartyId]
  );

  const selectedBuyer = useMemo(
    () => partyAccounts.find((a) => a.id === buyerPartyId),
    [partyAccounts, buyerPartyId]
  );

  const selectedSauda = useMemo(
    () => openSaudas.find((s) => s.id === saudaId),
    [openSaudas, saudaId]
  );

  // Get available amads for selected seller
  const availableAmads: AmadSelectionItem[] = useMemo(() => {
    if (!sellerPartyId) return [];

    return amads
      .filter(
        (a) =>
          a.partyName === selectedSeller?.name &&
          (a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH")
      )
      .map((a) => {
        const dispatched = a.dispatchedPackets ?? 0;
        const availablePkt1 = Math.max(0, (a.pkt1 ?? 0) - dispatched);
        const availablePkt2 = a.pkt2 ?? 0;
        const availablePkt3 = a.pkt3 ?? 0;

        return {
          amadId: a.id,
          amadNo: a.amadNo ?? 0,
          amadDate: a.date ?? "",
          commodityName: a.commodityName ?? "",
          variety: a.variety ?? "",
          marks: a.mark1 ?? "",
          availablePkt1,
          availablePkt2,
          availablePkt3,
          availableTotal: availablePkt1 + availablePkt2 + availablePkt3,
          selectedPkt1: 0,
          selectedPkt2: 0,
          selectedPkt3: 0,
          selected: false,
        };
      })
      .filter((a) => a.availableTotal > 0);
  }, [amads, sellerPartyId, selectedSeller?.name]);

  // Calculate totals from details
  const totalPackets = useMemo(() => {
    return details.reduce(
      (sum, d) => sum + calculateTotalPackets(d.pkt1, d.pkt2, d.pkt3),
      0
    );
  }, [details]);

  // When sauda is selected, auto-fill seller/buyer
  function handleSaudaChange(newSaudaId: string) {
    setSaudaId(newSaudaId);
    const sauda = openSaudas.find((s) => s.id === newSaudaId);
    if (sauda) {
      setSellerPartyId(sauda.sellerPartyId);
      setBuyerPartyId(sauda.buyerPartyId);
      setBuyerLocation(sauda.buyerLocation ?? "");
      setRate(sauda.rate);
    }
  }

  function handleSubmit() {
    if (!sellerPartyId || details.length === 0) return;

    onSave({
      gpDate,
      gpTime,
      sellerPartyId,
      sellerPartyName: selectedSeller?.name ?? undefined,
      sellerVillage: selectedSeller?.city ?? undefined,
      buyerPartyId: buyerPartyId || undefined,
      buyerPartyName: selectedBuyer?.name ?? undefined,
      buyerLocation: buyerLocation || undefined,
      saudaId: saudaId || undefined,
      saudaNo: selectedSauda?.saudaNo,
      transport: transport || undefined,
      vehicleNo: vehicleNo || undefined,
      driverName: driverName || undefined,
      driverContact: driverContact || undefined,
      biltiNo: biltiNo || undefined,
      rate: rate || undefined,
      remarks: remarks || undefined,
      details,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Gate Pass" : "New Gate Pass"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* GP Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Gate Pass Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>GP Number</Label>
                <Input
                  value={formatGpNo(gatePass?.gpNo ?? nextGpNo)}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="gpDate">Date *</Label>
                <Input
                  id="gpDate"
                  type="date"
                  value={gpDate}
                  onChange={(e) => setGpDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="gpTime">Time</Label>
                <Input
                  id="gpTime"
                  type="time"
                  value={gpTime}
                  onChange={(e) => setGpTime(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Party & Deal Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Party & Deal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Link to Deal (Optional)</Label>
                <Select value={saudaId} onValueChange={handleSaudaChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No linked deal</SelectItem>
                    {openSaudas.map((sauda) => (
                      <SelectItem key={sauda.id} value={sauda.id}>
                        {formatSaudaNo(sauda.saudaNo)} - {sauda.sellerPartyName} → {sauda.buyerPartyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSauda && (
                  <p className="text-xs text-muted-foreground">
                    Balance: {selectedSauda.balanceQty} bags @ ₹{selectedSauda.rate}/qtl
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rate">Rate (₹/Qtl)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={rate || ""}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Seller (From) *</Label>
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
              </div>
              <div className="flex flex-col gap-2">
                <Label>Buyer (To)</Label>
                <Select value={buyerPartyId} onValueChange={setBuyerPartyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not specified</SelectItem>
                    {partyAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="buyerLocation">Delivery Location</Label>
              <Input
                id="buyerLocation"
                value={buyerLocation}
                onChange={(e) => setBuyerLocation(e.target.value)}
                placeholder="Delivery address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Amad Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Select Amads for Dispatch
              {totalPackets > 0 && (
                <span className="ml-2 text-primary font-bold">
                  ({totalPackets} bags selected)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AmadSelector amads={availableAmads} onChange={setDetails} />
          </CardContent>
        </Card>

        {/* Transport Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Transport Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="transport">Transport Name</Label>
                <Input
                  id="transport"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  placeholder="Transport company"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="vehicleNo">Vehicle Number *</Label>
                <Input
                  id="vehicleNo"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g., UP 32 AB 1234"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="driverContact">Driver Contact</Label>
                <Input
                  id="driverContact"
                  value={driverContact}
                  onChange={(e) => setDriverContact(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="biltiNo">Bilti/LR Number</Label>
                <Input
                  id="biltiNo"
                  value={biltiNo}
                  onChange={(e) => setBiltiNo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remarks */}
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
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !sellerPartyId || details.length === 0}
        >
          {isPending ? "Saving..." : isEditing ? "Update" : "Create Gate Pass"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function GatePassFormDialog({
  open,
  onOpenChange,
  organizationId,
  gatePass,
  preselectedSauda,
  onSuccess,
}: GatePassFormDialogProps) {
  const { data: nextGpNo = 1 } = useNextGpNo(organizationId);
  const createMutation = useCreateGatePass();

  function handleSave(formInput: GatePassFormInput) {
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

  const formKey = `${open}-${gatePass?.id ?? "new"}-${preselectedSauda?.id ?? ""}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {open && (
          <GatePassFormContent
            key={formKey}
            organizationId={organizationId}
            gatePass={gatePass}
            preselectedSauda={preselectedSauda}
            nextGpNo={nextGpNo}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isPending={createMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
