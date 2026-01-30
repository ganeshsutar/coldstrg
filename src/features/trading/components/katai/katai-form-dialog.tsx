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
import { useNextKataiNo, useCreateKatai } from "../../hooks";
import { GradingOutputTable } from "./grading-output-table";
import type { Katai, KataiFormInput } from "../../types";
import {
  formatKataiNo,
  formatCurrency,
  calculateGradingCharges,
  isGradingBalanced,
} from "../../utils";

interface KataiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  katai?: Katai | null;
  onSuccess?: () => void;
}

interface KataiFormContentProps {
  organizationId: string;
  katai?: Katai | null;
  nextKataiNo: number;
  onSave: (input: KataiFormInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function KataiFormContent({
  organizationId,
  katai,
  nextKataiNo,
  onSave,
  onCancel,
  isPending,
}: KataiFormContentProps) {
  const isEditing = !!katai;
  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: amads = [] } = useAmadList(organizationId);

  // Filter to party accounts only
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Form state
  const [kataiDate, setKataiDate] = useState(
    katai?.kataiDate ?? new Date().toISOString().split("T")[0]
  );
  const [partyId, setPartyId] = useState(katai?.partyId ?? "");
  const [amadId, setAmadId] = useState(katai?.amadId ?? "");
  const [bagsGraded, setBagsGraded] = useState(katai?.bagsGraded ?? 0);
  const [motaBags, setMotaBags] = useState(katai?.motaBags ?? 0);
  const [chattaBags, setChattaBags] = useState(katai?.chattaBags ?? 0);
  const [beejBags, setBeejBags] = useState(katai?.beejBags ?? 0);
  const [mixBags, setMixBags] = useState(katai?.mixBags ?? 0);
  const [gullaBags, setGullaBags] = useState(katai?.gullaBags ?? 0);
  const [laborName, setLaborName] = useState(katai?.laborName ?? "");
  const [laborRate, setLaborRate] = useState(katai?.laborRate ?? 0);
  const [remarks, setRemarks] = useState(katai?.remarks ?? "");

  // Get selected party details
  const selectedParty = useMemo(
    () => partyAccounts.find((a) => a.id === partyId),
    [partyAccounts, partyId]
  );

  // Filter amads for selected party
  const partyAmads = useMemo(() => {
    if (!partyId || !selectedParty) return [];
    return amads.filter(
      (a) =>
        a.partyName === selectedParty.name &&
        (a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH")
    );
  }, [amads, partyId, selectedParty]);

  // Get selected amad details
  const selectedAmad = useMemo(
    () => partyAmads.find((a) => a.id === amadId),
    [partyAmads, amadId]
  );

  // Calculate charges
  const charges = useMemo(
    () => calculateGradingCharges(bagsGraded, laborRate),
    [bagsGraded, laborRate]
  );

  // Check if grading is balanced - used for validation feedback
  const gradingIsBalanced = useMemo(
    () =>
      isGradingBalanced(bagsGraded, {
        motaBags,
        chattaBags,
        beejBags,
        mixBags,
        gullaBags,
      }),
    [bagsGraded, motaBags, chattaBags, beejBags, mixBags, gullaBags]
  );
  // Log balance status for debugging (can be used for future validation)
  if (bagsGraded > 0 && !gradingIsBalanced) {
    // Balance warning is shown in GradingOutputTable
  }

  function handleGradeChange(field: string, value: number) {
    switch (field) {
      case "motaBags":
        setMotaBags(value);
        break;
      case "chattaBags":
        setChattaBags(value);
        break;
      case "beejBags":
        setBeejBags(value);
        break;
      case "mixBags":
        setMixBags(value);
        break;
      case "gullaBags":
        setGullaBags(value);
        break;
    }
  }

  function handleSubmit() {
    if (!partyId || !amadId || bagsGraded <= 0) return;

    onSave({
      kataiDate,
      partyId,
      partyName: selectedParty?.name,
      amadId,
      amadNo: selectedAmad?.amadNo ?? undefined,
      bagsGraded,
      motaBags,
      chattaBags,
      beejBags,
      mixBags,
      gullaBags,
      laborName: laborName || undefined,
      laborRate,
      remarks: remarks || undefined,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Grading (Katai)" : "New Grading (Katai)"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Katai Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Grading Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Katai Number</Label>
                <Input
                  value={formatKataiNo(katai?.kataiNo ?? nextKataiNo)}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="kataiDate">Date *</Label>
                <Input
                  id="kataiDate"
                  type="date"
                  value={kataiDate}
                  onChange={(e) => setKataiDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Source Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Party *</Label>
                <Select
                  value={partyId}
                  onValueChange={(value) => {
                    setPartyId(value);
                    setAmadId(""); // Reset amad when party changes
                  }}
                >
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
                <Label>Amad *</Label>
                <Select
                  value={amadId}
                  onValueChange={setAmadId}
                  disabled={!partyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select amad" />
                  </SelectTrigger>
                  <SelectContent>
                    {partyAmads.map((amad) => (
                      <SelectItem key={amad.id} value={amad.id}>
                        #{amad.amadNo} - {amad.commodityName} ({amad.totalPackets} bags)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedAmad && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-muted-foreground">Commodity: </span>
                    {selectedAmad.commodityName}
                    {selectedAmad.variety && ` (${selectedAmad.variety})`}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Bags: </span>
                    {selectedAmad.totalPackets}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Room: </span>
                    {selectedAmad.room || "-"}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="bagsGraded">Bags to Grade *</Label>
              <Input
                id="bagsGraded"
                type="number"
                min="1"
                max={selectedAmad?.totalPackets ?? undefined}
                value={bagsGraded || ""}
                onChange={(e) => setBagsGraded(parseInt(e.target.value) || 0)}
              />
              {selectedAmad && bagsGraded > (selectedAmad.totalPackets ?? 0) && (
                <p className="text-xs text-destructive">
                  Cannot grade more than available ({selectedAmad.totalPackets} bags)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grading Output */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Grading Output</CardTitle>
          </CardHeader>
          <CardContent>
            <GradingOutputTable
              bagsGraded={bagsGraded}
              motaBags={motaBags}
              chattaBags={chattaBags}
              beejBags={beejBags}
              mixBags={mixBags}
              gullaBags={gullaBags}
              onChange={handleGradeChange}
            />
          </CardContent>
        </Card>

        {/* Labor Charges */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Labor Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="laborName">Labor Name</Label>
                <Input
                  id="laborName"
                  value={laborName}
                  onChange={(e) => setLaborName(e.target.value)}
                  placeholder="Worker name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="laborRate">Rate per Bag (₹)</Label>
                <Input
                  id="laborRate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={laborRate || ""}
                  onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Total Charges</Label>
                <Input
                  value={formatCurrency(charges)}
                  disabled
                  className="font-semibold"
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
          disabled={isPending || !partyId || !amadId || bagsGraded <= 0}
        >
          {isPending ? "Saving..." : isEditing ? "Update" : "Save Grading"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function KataiFormDialog({
  open,
  onOpenChange,
  organizationId,
  katai,
  onSuccess,
}: KataiFormDialogProps) {
  const { data: nextKataiNo = 1 } = useNextKataiNo(organizationId);
  const createMutation = useCreateKatai();

  function handleSave(formInput: KataiFormInput) {
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

  const formKey = `${open}-${katai?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {open && (
          <KataiFormContent
            key={formKey}
            organizationId={organizationId}
            katai={katai}
            nextKataiNo={nextKataiNo}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isPending={createMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
