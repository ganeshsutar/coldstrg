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
import { useCommodities } from "@/features/masters";
import { useAccountList } from "@/features/accounting/hooks/use-accounts";
import { useChambers, useChamberFloorsByChamberId } from "@/features/warehouse";
import type { Amad, CreateAmadInput } from "../../types";

interface AmadFormProps {
  amad?: Amad | null;
  nextAmadNo: number;
  organizationId: string;
  onSave: (input: CreateAmadInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

const stepTitles = [
  "Basic Information",
  "Commodity & Storage",
  "Packet Details",
  "Identification Marks",
];

export function AmadForm({
  amad,
  nextAmadNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: AmadFormProps) {
  const isEdit = !!amad;
  const { data: commodities = [] } = useCommodities(organizationId);
  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: chambers = [] } = useChambers(organizationId);

  // Local state for chamber selection (used to fetch floors)
  const [selectedChamberId, setSelectedChamberId] = useState(amad?.chamberId ?? "");
  const { data: chamberFloors = [] } = useChamberFloorsByChamberId(selectedChamberId || undefined);

  // Filter to party accounts only (type ACCOUNT)
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  const [currentStep, setCurrentStep] = useState(1);

  // Basic Information
  const [amadNo] = useState(amad?.amadNo ?? nextAmadNo);
  const [date, setDate] = useState(
    amad?.date ?? new Date().toISOString().split("T")[0]
  );
  const [partyId, setPartyId] = useState(amad?.partyId ?? "");
  const [partyName, setPartyName] = useState(amad?.partyName ?? "");
  const [villageName, setVillageName] = useState(amad?.villageName ?? "");
  const [post, setPost] = useState(amad?.post ?? "");
  const [district, setDistrict] = useState(amad?.district ?? "");
  const [road, setRoad] = useState(amad?.road ?? "");

  // Commodity & Storage
  const [commodityId, setCommodityId] = useState(amad?.commodityId ?? "");
  const [commodityName, setCommodityName] = useState(
    amad?.commodityName ?? ""
  );
  const [variety, setVariety] = useState(amad?.variety ?? "");
  const [chamberId, setChamberId] = useState(amad?.chamberId ?? "");
  const [chamberName, setChamberName] = useState(amad?.chamberName ?? "");
  const [room, setRoom] = useState(amad?.room ?? "");
  const [floor, setFloor] = useState(amad?.floor ?? "");
  const [rentRate, setRentRate] = useState(
    amad?.rentRate?.toString() ?? ""
  );
  const [graceDays, setGraceDays] = useState(
    amad?.graceDays?.toString() ?? ""
  );
  const [eWayBillNo, setEWayBillNo] = useState(amad?.eWayBillNo ?? "");
  const [eWayBillDate, setEWayBillDate] = useState(amad?.eWayBillDate ?? "");

  // Packet Details
  const [pkt1, setPkt1] = useState(amad?.pkt1?.toString() ?? "");
  const [pkt2, setPkt2] = useState(amad?.pkt2?.toString() ?? "");
  const [pkt3, setPkt3] = useState(amad?.pkt3?.toString() ?? "");
  const [pwt1, setPwt1] = useState(amad?.pwt1?.toString() ?? "");
  const [pwt2, setPwt2] = useState(amad?.pwt2?.toString() ?? "");
  const [pwt3, setPwt3] = useState(amad?.pwt3?.toString() ?? "");

  // Marks
  const [mark1, setMark1] = useState(amad?.mark1 ?? "");
  const [mark2, setMark2] = useState(amad?.mark2 ?? "");
  const [partyMark, setPartyMark] = useState(amad?.partyMark ?? "");

  // Computed totals
  const totalPackets = useMemo(() => {
    return (
      (parseInt(pkt1, 10) || 0) +
      (parseInt(pkt2, 10) || 0) +
      (parseInt(pkt3, 10) || 0)
    );
  }, [pkt1, pkt2, pkt3]);

  const totalWeight = useMemo(() => {
    return (
      (parseFloat(pwt1) || 0) +
      (parseFloat(pwt2) || 0) +
      (parseFloat(pwt3) || 0)
    );
  }, [pwt1, pwt2, pwt3]);

  function handlePartyChange(id: string) {
    setPartyId(id);
    const party = partyAccounts.find((a) => a.id === id);
    if (party) {
      setPartyName(party.name);
      // Auto-fill village from party's city field
      if (party.city) {
        setVillageName(party.city);
      }
    }
  }

  function handleCommodityChange(id: string) {
    setCommodityId(id);
    const commodity = commodities.find((c) => c.id === id);
    if (commodity) {
      setCommodityName(commodity.name);
      if (commodity.rentRatePKT3) {
        setRentRate(commodity.rentRatePKT3.toString());
      }
      if (commodity.gracePeriod) {
        setGraceDays(commodity.gracePeriod.toString());
      }
    }
  }

  function handleChamberChange(id: string) {
    setSelectedChamberId(id);
    setChamberId(id);
    const chamber = chambers.find((c) => c.id === id);
    if (chamber) {
      setChamberName(chamber.name);
      setRoom(chamber.name); // Store chamber name as room for backward compatibility
      setFloor(""); // Reset floor when chamber changes
    }
  }

  function handleFloorChange(floorNumber: string) {
    setFloor(floorNumber);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateAmadInput & { id?: string } = {
      organizationId,
      amadNo,
      date,
      partyName,
      totalPackets,
      totalWeight,
      ...(isEdit && { id: amad!.id }),
      ...(partyId && { partyId }),
      ...(villageName && { villageName }),
      ...(post && { post }),
      ...(district && { district }),
      ...(road && { road }),
      ...(commodityId && { commodityId }),
      ...(commodityName && { commodityName }),
      ...(variety && { variety }),
      ...(chamberId && { chamberId }),
      ...(chamberName && { chamberName }),
      ...(room && { room }),
      ...(floor && { floor }),
      ...(rentRate && { rentRate: parseFloat(rentRate) }),
      ...(graceDays && { graceDays: parseInt(graceDays, 10) }),
      ...(eWayBillNo && { eWayBillNo }),
      ...(eWayBillDate && { eWayBillDate }),
      ...(pkt1 && { pkt1: parseInt(pkt1, 10) }),
      ...(pkt2 && { pkt2: parseInt(pkt2, 10) }),
      ...(pkt3 && { pkt3: parseInt(pkt3, 10) }),
      ...(pwt1 && { pwt1: parseFloat(pwt1) }),
      ...(pwt2 && { pwt2: parseFloat(pwt2) }),
      ...(pwt3 && { pwt3: parseFloat(pwt3) }),
      ...(mark1 && { mark1 }),
      ...(mark2 && { mark2 }),
      ...(partyMark && { partyMark }),
    };
    onSave(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Amad" : "New Amad"}</DialogTitle>
        <DialogDescription>
          Step {currentStep} of 4: {stepTitles[currentStep - 1]}
        </DialogDescription>
      </DialogHeader>

      <div className="py-6">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-1.5 rounded-full ${
                step <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="amadNo">Amad No</Label>
                <Input
                  id="amadNo"
                  type="number"
                  value={amadNo}
                  disabled
                />
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="partyName">Party Name</Label>
                <Select value={partyId} onValueChange={handlePartyChange}>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="villageName">Village</Label>
                <Input
                  id="villageName"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="post">Post</Label>
                <Input
                  id="post"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="road">Road</Label>
                <Input
                  id="road"
                  value={road}
                  onChange={(e) => setRoad(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Commodity & Storage */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="commodity">Commodity</Label>
                <Select value={commodityId} onValueChange={handleCommodityChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    {commodities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chamber">Chamber</Label>
                <Select value={chamberId} onValueChange={handleChamberChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select chamber" />
                  </SelectTrigger>
                  <SelectContent>
                    {chambers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} (Room {c.roomNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Select
                  value={floor}
                  onValueChange={handleFloorChange}
                  disabled={!chamberId || chamberFloors.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={chamberId ? "Select floor" : "Select chamber first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {chamberFloors.map((f) => (
                      <SelectItem key={f.id} value={String(f.floorNumber)}>
                        {f.floorName || `Floor ${f.floorNumber}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rentRate">Rent Rate</Label>
                <Input
                  id="rentRate"
                  type="number"
                  step="0.01"
                  value={rentRate}
                  onChange={(e) => setRentRate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="graceDays">Grace Days</Label>
                <Input
                  id="graceDays"
                  type="number"
                  value={graceDays}
                  onChange={(e) => setGraceDays(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="eWayBillNo">E-Way Bill No</Label>
                <Input
                  id="eWayBillNo"
                  value={eWayBillNo}
                  onChange={(e) => setEWayBillNo(e.target.value)}
                />
              </div>
            </div>
            {eWayBillNo && (
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="eWayBillDate">E-Way Bill Date</Label>
                  <Input
                    id="eWayBillDate"
                    type="date"
                    value={eWayBillDate}
                    onChange={(e) => setEWayBillDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Packet Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>PKT1 (80kg)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Count"
                      value={pkt1}
                      onChange={(e) => setPkt1(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Weight"
                      value={pwt1}
                      onChange={(e) => setPwt1(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>PKT2 (70kg)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Count"
                      value={pkt2}
                      onChange={(e) => setPkt2(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Weight"
                      value={pwt2}
                      onChange={(e) => setPwt2(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>PKT3 (50kg)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Count"
                      value={pkt3}
                      onChange={(e) => setPkt3(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Weight"
                      value={pwt3}
                      onChange={(e) => setPwt3(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-md bg-muted/50 p-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Total Packets: </span>
                <span className="font-semibold">{totalPackets}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Total Weight: </span>
                <span className="font-semibold">
                  {totalWeight.toLocaleString("en-IN")} kg
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Identification Marks */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="mark1">Mark 1</Label>
                <Input
                  id="mark1"
                  value={mark1}
                  onChange={(e) => setMark1(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="mark2">Mark 2</Label>
                <Input
                  id="mark2"
                  value={mark2}
                  onChange={(e) => setMark2(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="partyMark">Party Mark</Label>
                <Input
                  id="partyMark"
                  value={partyMark}
                  onChange={(e) => setPartyMark(e.target.value)}
                />
              </div>
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
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!partyId || !date}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending || !partyId || !date}
            >
              {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </form>
  );
}
