import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAmadList } from "../../hooks/use-amad";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import type { CreateStockTransferInput, Amad } from "../../types";

interface StockTransferWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextTransferNo: number;
  organizationId: string;
  onSave: (input: CreateStockTransferInput) => void;
  isPending: boolean;
}

export function StockTransferWizard({
  open,
  onOpenChange,
  nextTransferNo,
  organizationId,
  onSave,
  isPending,
}: StockTransferWizardProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="transfer-form-dialog">
        {open && (
          <WizardContent
            nextTransferNo={nextTransferNo}
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

interface WizardContentProps {
  nextTransferNo: number;
  organizationId: string;
  onSave: (input: CreateStockTransferInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function WizardContent({
  nextTransferNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: WizardContentProps) {
  const { data: amadList = [] } = useAmadList(organizationId);
  const { data: accounts = [] } = useAccountList(organizationId);
  const [currentStep, setCurrentStep] = useState(1);

  // Filter to party accounts only (type ACCOUNT)
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Step 1: Source
  const [amadId, setAmadId] = useState("");
  const [selectedAmad, setSelectedAmad] = useState<Amad | null>(null);
  const [pkt1, setPkt1] = useState("");
  const [pkt2, setPkt2] = useState("");
  const [pkt3, setPkt3] = useState("");

  // Step 2: Destination
  const [toPartyId, setToPartyId] = useState("");
  const [toPartyName, setToPartyName] = useState("");
  const [destRoom, setDestRoom] = useState("");

  // Step 3: Confirm
  const [remarks, setRemarks] = useState("");

  const availableAmads = useMemo(
    () =>
      amadList.filter(
        (a) => a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH"
      ),
    [amadList]
  );

  const totalPackets = useMemo(
    () =>
      (parseInt(pkt1, 10) || 0) +
      (parseInt(pkt2, 10) || 0) +
      (parseInt(pkt3, 10) || 0),
    [pkt1, pkt2, pkt3]
  );

  function handleAmadSelect(id: string) {
    setAmadId(id);
    const amad = amadList.find((a) => a.id === id);
    setSelectedAmad(amad || null);
  }

  function handleToPartyChange(id: string) {
    setToPartyId(id);
    const party = partyAccounts.find((a) => a.id === id);
    if (party) {
      setToPartyName(party.name);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateStockTransferInput = {
      organizationId,
      transferNo: nextTransferNo,
      date: new Date().toISOString().split("T")[0],
      totalPackets,
      status: "COMPLETED",
      ...(amadId && { amadId }),
      ...(selectedAmad && {
        amadNo: selectedAmad.amadNo,
        fromPartyId: selectedAmad.partyId || undefined,
        fromPartyName: selectedAmad.partyName,
        commodityName: selectedAmad.commodityName || undefined,
        sourceRoom: selectedAmad.room || undefined,
      }),
      ...(toPartyId && { toPartyId }),
      ...(toPartyName && { toPartyName }),
      ...(destRoom && { destRoom }),
      ...(pkt1 && { pkt1: parseInt(pkt1, 10) }),
      ...(pkt2 && { pkt2: parseInt(pkt2, 10) }),
      ...(pkt3 && { pkt3: parseInt(pkt3, 10) }),
      ...(remarks && { remarks }),
    };
    onSave(input);
  }

  const stepTitles = ["Source", "Destination", "Confirm"];

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>New Stock Transfer</DialogTitle>
        <DialogDescription>
          Step {currentStep} of 3: {stepTitles[currentStep - 1]}
        </DialogDescription>
      </DialogHeader>

      <div className="py-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-1.5 rounded-full ${
                step <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Source */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Select Amad</Label>
              <Select value={amadId} onValueChange={handleAmadSelect}>
                <SelectTrigger className="w-full" data-testid="transfer-form-amad-select">
                  <SelectValue placeholder="Select Amad to transfer from" />
                </SelectTrigger>
                <SelectContent>
                  {availableAmads.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      #{a.amadNo} - {a.partyName} ({(a.totalPackets ?? 0) - (a.dispatchedPackets ?? 0)} pkt)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAmad && (
              <div className="rounded-md bg-muted/50 p-3 space-y-1 text-sm" data-testid="transfer-form-amad-info">
                <div>
                  <span className="text-muted-foreground">Party: </span>
                  {selectedAmad.partyName}
                </div>
                <div>
                  <span className="text-muted-foreground">Commodity: </span>
                  {selectedAmad.commodityName || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Room: </span>
                  {selectedAmad.room || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Balance: </span>
                  {(selectedAmad.totalPackets ?? 0) -
                    (selectedAmad.dispatchedPackets ?? 0)}{" "}
                  packets
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>PKT1</Label>
                <Input
                  type="number"
                  value={pkt1}
                  onChange={(e) => setPkt1(e.target.value)}
                  data-testid="transfer-form-pkt1-input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>PKT2</Label>
                <Input
                  type="number"
                  value={pkt2}
                  onChange={(e) => setPkt2(e.target.value)}
                  data-testid="transfer-form-pkt2-input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>PKT3</Label>
                <Input
                  type="number"
                  value={pkt3}
                  onChange={(e) => setPkt3(e.target.value)}
                  data-testid="transfer-form-pkt3-input"
                />
              </div>
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Transfer Packets: </span>
              <span className="font-semibold" data-testid="transfer-form-total-packets">{totalPackets}</span>
            </div>
          </div>
        )}

        {/* Step 2: Destination */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Destination Party</Label>
              <Select value={toPartyId} onValueChange={handleToPartyChange}>
                <SelectTrigger data-testid="transfer-form-to-party-select">
                  <SelectValue placeholder="Select destination party" />
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
              <Label>Destination Room</Label>
              <Input
                value={destRoom}
                onChange={(e) => setDestRoom(e.target.value)}
                placeholder="Enter destination room"
                data-testid="transfer-form-dest-room-input"
              />
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-md border p-4 space-y-2 text-sm" data-testid="transfer-form-summary">
              <div className="font-medium text-base mb-3">Transfer Summary</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">From: </span>
                  {selectedAmad?.partyName || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">To: </span>
                  {toPartyName || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Amad #: </span>
                  {selectedAmad?.amadNo || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Packets: </span>
                  {totalPackets}
                </div>
                <div>
                  <span className="text-muted-foreground">Source Room: </span>
                  {selectedAmad?.room || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Dest Room: </span>
                  {destRoom || "-"}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Remarks</Label>
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional remarks"
                data-testid="transfer-form-remarks-input"
              />
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              data-testid="transfer-form-back-button"
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="transfer-form-cancel-button">
            Cancel
          </Button>
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && (!amadId || totalPackets === 0)}
              data-testid="transfer-form-next-button"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              data-testid="transfer-form-submit-button"
            >
              {isPending ? "Transferring..." : "Confirm Transfer"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </form>
  );
}
