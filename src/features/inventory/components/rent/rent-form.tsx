import { useState, useMemo } from "react";
import {
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
import type { Rent, CreateRentInput } from "../../types";

interface RentFormProps {
  rent?: Rent | null;
  nextSerialNo: number;
  organizationId: string;
  onSave: (input: CreateRentInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

const stepTitles = [
  "Amad Selection",
  "Dispatch Packets",
  "Rent & Charges",
];

export function RentForm({
  rent,
  nextSerialNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: RentFormProps) {
  const isEdit = !!rent;
  const { data: amadList = [] } = useAmadList(organizationId);

  const [currentStep, setCurrentStep] = useState(1);

  // Only show in-stock or partial amads for selection
  const availableAmads = useMemo(
    () =>
      amadList.filter(
        (a) => a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH"
      ),
    [amadList]
  );

  const [serialNo] = useState(rent?.serialNo ?? nextSerialNo);
  const [date, setDate] = useState(
    rent?.date ?? new Date().toISOString().split("T")[0]
  );
  const [partyId, setPartyId] = useState(rent?.partyId ?? "");
  const [partyName, setPartyName] = useState(rent?.partyName ?? "");
  const [amadId, setAmadId] = useState(rent?.amadId ?? "");
  const [amadNo, setAmadNo] = useState(rent?.amadNo?.toString() ?? "");
  const [receiverName, setReceiverName] = useState(rent?.receiverName ?? "");
  const [vehicleNo, setVehicleNo] = useState(rent?.vehicleNo ?? "");

  // Packets
  const [pkt1, setPkt1] = useState(rent?.pkt1?.toString() ?? "");
  const [pkt2, setPkt2] = useState(rent?.pkt2?.toString() ?? "");
  const [pkt3, setPkt3] = useState(rent?.pkt3?.toString() ?? "");

  // Financial
  const [rate, setRate] = useState(rent?.rate?.toString() ?? "");
  const [storageDays, setStorageDays] = useState(
    rent?.storageDays?.toString() ?? ""
  );
  const [loadingAmt, setLoadingAmt] = useState(
    rent?.loadingAmt?.toString() ?? ""
  );
  const [unloadingAmt, setUnloadingAmt] = useState(
    rent?.unloadingAmt?.toString() ?? ""
  );
  const [dumpingAmt, setDumpingAmt] = useState(
    rent?.dumpingAmt?.toString() ?? ""
  );
  const [cgst, setCgst] = useState(rent?.cgst?.toString() ?? "");
  const [sgst, setSgst] = useState(rent?.sgst?.toString() ?? "");
  const [igst, setIgst] = useState(rent?.igst?.toString() ?? "");

  const totalPackets = useMemo(
    () =>
      (parseInt(pkt1, 10) || 0) +
      (parseInt(pkt2, 10) || 0) +
      (parseInt(pkt3, 10) || 0),
    [pkt1, pkt2, pkt3]
  );

  // Simple rent calculation
  const rentAmount = useMemo(() => {
    const days = parseInt(storageDays, 10) || 0;
    const r = parseFloat(rate) || 0;
    return days * r * totalPackets;
  }, [storageDays, rate, totalPackets]);

  const billAmount = useMemo(() => {
    return (
      rentAmount +
      (parseFloat(loadingAmt) || 0) +
      (parseFloat(unloadingAmt) || 0) +
      (parseFloat(dumpingAmt) || 0) +
      (parseFloat(cgst) || 0) +
      (parseFloat(sgst) || 0) +
      (parseFloat(igst) || 0)
    );
  }, [rentAmount, loadingAmt, unloadingAmt, dumpingAmt, cgst, sgst, igst]);

  function handleAmadSelect(id: string) {
    setAmadId(id);
    const selectedAmad = amadList.find((a) => a.id === id);
    if (selectedAmad) {
      // Capture partyId from selected Amad if available
      if (selectedAmad.partyId) {
        setPartyId(selectedAmad.partyId);
      }
      setPartyName(selectedAmad.partyName);
      setAmadNo(String(selectedAmad.amadNo));
      if (selectedAmad.rentRate) {
        setRate(selectedAmad.rentRate.toString());
      }
      // Calculate storage days from amad date to today
      const amadDate = new Date(selectedAmad.date);
      const today = new Date();
      const diffTime = today.getTime() - amadDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setStorageDays(String(Math.max(0, diffDays)));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateRentInput & { id?: string } = {
      organizationId,
      serialNo,
      date,
      partyName,
      totalPackets,
      rent: rentAmount,
      billAmount,
      ...(isEdit && { id: rent!.id }),
      ...(partyId && { partyId }),
      ...(amadId && { amadId }),
      ...(amadNo && { amadNo: parseInt(amadNo, 10) }),
      ...(receiverName && { receiverName }),
      ...(vehicleNo && { vehicleNo }),
      ...(pkt1 && { pkt1: parseInt(pkt1, 10) }),
      ...(pkt2 && { pkt2: parseInt(pkt2, 10) }),
      ...(pkt3 && { pkt3: parseInt(pkt3, 10) }),
      ...(rate && { rate: parseFloat(rate) }),
      ...(storageDays && { storageDays: parseInt(storageDays, 10) }),
      ...(rentAmount && { amount: rentAmount }),
      ...(loadingAmt && { loadingAmt: parseFloat(loadingAmt) }),
      ...(unloadingAmt && { unloadingAmt: parseFloat(unloadingAmt) }),
      ...(dumpingAmt && { dumpingAmt: parseFloat(dumpingAmt) }),
      ...(cgst && { cgst: parseFloat(cgst) }),
      ...(sgst && { sgst: parseFloat(sgst) }),
      ...(igst && { igst: parseFloat(igst) }),
    };
    onSave(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Dispatch" : "New Dispatch (Nikasi)"}
        </DialogTitle>
        <DialogDescription>
          Step {currentStep} of 3: {stepTitles[currentStep - 1]}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex-1 h-1.5 rounded-full ${
              step <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Amad Selection */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="serialNo">Serial No</Label>
              <Input id="serialNo" type="number" value={serialNo} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="amad">Select Amad</Label>
              <Select value={amadId} onValueChange={handleAmadSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Amad" />
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
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="partyName">Party Name</Label>
              <Input
                id="partyName"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="receiverName">Receiver Name</Label>
              <Input
                id="receiverName"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vehicleNo">Vehicle No</Label>
              <Input
                id="vehicleNo"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Dispatch Packets */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>PKT1</Label>
              <Input
                type="number"
                value={pkt1}
                onChange={(e) => setPkt1(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>PKT2</Label>
              <Input
                type="number"
                value={pkt2}
                onChange={(e) => setPkt2(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>PKT3</Label>
              <Input
                type="number"
                value={pkt3}
                onChange={(e) => setPkt3(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <span className="text-muted-foreground">Total Packets: </span>
            <span className="font-semibold">{totalPackets}</span>
          </div>
        </div>
      )}

      {/* Step 3: Rent & Charges */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Storage Days</Label>
              <Input
                type="number"
                value={storageDays}
                onChange={(e) => setStorageDays(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Rate</Label>
              <Input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Rent Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={rentAmount.toFixed(2)}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Loading Amt</Label>
              <Input
                type="number"
                step="0.01"
                value={loadingAmt}
                onChange={(e) => setLoadingAmt(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Unloading Amt</Label>
              <Input
                type="number"
                step="0.01"
                value={unloadingAmt}
                onChange={(e) => setUnloadingAmt(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Dumping Amt</Label>
              <Input
                type="number"
                step="0.01"
                value={dumpingAmt}
                onChange={(e) => setDumpingAmt(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>CGST</Label>
              <Input
                type="number"
                step="0.01"
                value={cgst}
                onChange={(e) => setCgst(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>SGST</Label>
              <Input
                type="number"
                step="0.01"
                value={sgst}
                onChange={(e) => setSgst(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>IGST</Label>
              <Input
                type="number"
                step="0.01"
                value={igst}
                onChange={(e) => setIgst(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <span className="text-muted-foreground">Bill Amount: </span>
            <span className="font-semibold">
              {`\u20B9${billAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </span>
          </div>
        </div>
      )}

      <DialogFooter className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!partyName || !date}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending || !partyName || !date}
            >
              {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </form>
  );
}
