import { useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  Calculator,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "@/features/organizations";
import { useAccountList } from "@/features/accounting";
import {
  useBillableAmads,
  useCreateRentBill,
  useNextRentBillNo,
} from "../../hooks";
import type {
  RentBillFormInput,
  PriceComponentValue,
  GstTypeValue,
} from "../../types";
import {
  formatIndianRupees,
  calculateAmadRent,
  calculateBillAmounts,
  convertAmountToWords,
  roundBillAmount,
  DEFAULT_GST_RATE,
} from "../../utils";

type WizardStep = 1 | 2 | 3;

interface ChargeItem {
  id: string;
  component: PriceComponentValue;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
}

export function BillGenerationWizard() {
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: accounts = [] } = useAccountList(organizationId);
  const { data: billableAmads = [] } =
    useBillableAmads(organizationId);
  const { data: nextBillNo = "" } = useNextRentBillNo(organizationId);
  const createMutation = useCreateRentBill();

  // Wizard state
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: Party & Amad selection
  const [selectedPartyId, setSelectedPartyId] = useState<string>("");
  const [selectedAmadIds, setSelectedAmadIds] = useState<Set<string>>(new Set());

  // Step 2: Charges
  const [charges, setCharges] = useState<ChargeItem[]>([]);
  const [gstType, setGstType] = useState<GstTypeValue>("INTRA_STATE");
  const [gstRate, setGstRate] = useState(DEFAULT_GST_RATE);
  const [discountAmount, setDiscountAmount] = useState(0);
  const chargeIdCounter = useRef(0);

  // Step 3: Notes
  const [notes, setNotes] = useState("");
  const [billDate] = useState(new Date().toISOString().split("T")[0]);

  // Account type for filtering
  type AccountItem = { id: string; name: string; city?: string | null; gst?: string | null; state?: string | null; accountType: string };

  // Filter parties (accounts with type ACCOUNT)
  const parties = useMemo(
    () => (accounts as AccountItem[]).filter((a) => a.accountType === "ACCOUNT"),
    [accounts]
  );

  // Filter amads for selected party
  const partyAmads = useMemo(() => {
    if (!selectedPartyId) return billableAmads;
    const party = parties.find((p) => p.id === selectedPartyId);
    if (!party) return [];
    return billableAmads.filter((a) => a.partyName === party.name);
  }, [billableAmads, selectedPartyId, parties]);

  // Selected amads with calculated rent
  const selectedAmads = useMemo(() => {
    return partyAmads
      .filter((a) => selectedAmadIds.has(a.id))
      .map((a) => {
        const { billableDays, rentAmount } = calculateAmadRent({
          weightQtl: a.totalWeight,
          bags: a.totalPackets,
          storageDays: a.storageDays,
          graceDays: a.graceDays,
          ratePerQtl: 50, // Default rate, would come from commodity
          rentBasis: "QUINTAL",
        });
        return { ...a, billableDays, rentAmount };
      });
  }, [partyAmads, selectedAmadIds]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalBags = selectedAmads.reduce((sum, a) => sum + a.totalPackets, 0);
    const totalWeight = selectedAmads.reduce((sum, a) => sum + a.totalWeight, 0);
    const totalRent = selectedAmads.reduce((sum, a) => sum + a.rentAmount, 0);
    const totalCharges = charges.reduce((sum, c) => sum + c.amount, 0);

    const billAmounts = calculateBillAmounts({
      rentAmount: totalRent,
      loadingCharges:
        charges.find((c) => c.component === "LOADING")?.amount || 0,
      unloadingCharges:
        charges.find((c) => c.component === "UNLOADING")?.amount || 0,
      dalaCharges: charges.find((c) => c.component === "DALA")?.amount || 0,
      kataiCharges: charges.find((c) => c.component === "KATAI")?.amount || 0,
      insuranceAmount:
        charges.find((c) => c.component === "INSURANCE")?.amount || 0,
      otherCharges: charges.find((c) => c.component === "OTHER")?.amount || 0,
      discountAmount,
      gstType,
      gstRate,
    });

    const { roundedAmount, roundOffAmount } = roundBillAmount(
      billAmounts.totalAmount
    );

    return {
      totalBags,
      totalWeight,
      totalRent,
      totalCharges,
      ...billAmounts,
      roundedAmount,
      roundOffAmount,
    };
  }, [selectedAmads, charges, discountAmount, gstType, gstRate]);

  function toggleAmadSelection(amadId: string) {
    const newSet = new Set(selectedAmadIds);
    if (newSet.has(amadId)) {
      newSet.delete(amadId);
    } else {
      newSet.add(amadId);
    }
    setSelectedAmadIds(newSet);
  }

  function selectAllAmads() {
    setSelectedAmadIds(new Set(partyAmads.map((a) => a.id)));
  }

  function clearAllAmads() {
    setSelectedAmadIds(new Set());
  }

  function addCharge(component: PriceComponentValue) {
    chargeIdCounter.current += 1;
    setCharges([
      ...charges,
      {
        id: `charge-${chargeIdCounter.current}`,
        component,
        description: component,
        rate: 0,
        quantity: totals.totalBags,
        amount: 0,
      },
    ]);
  }

  function updateCharge(id: string, updates: Partial<ChargeItem>) {
    setCharges(
      charges.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };
        updated.amount = updated.rate * updated.quantity;
        return updated;
      })
    );
  }

  function removeCharge(id: string) {
    setCharges(charges.filter((c) => c.id !== id));
  }

  async function handleSubmit() {
    if (!organizationId || selectedAmads.length === 0) return;

    const party = parties.find((p) => p.id === selectedPartyId);
    if (!party) return;

    const formInput: RentBillFormInput = {
      partyId: selectedPartyId,
      partyName: party.name,
      partyVillage: party.city || undefined,
      partyGstin: party.gst || undefined,
      partyState: party.state || undefined,
      billDate,
      gstType,
      notes,
      cgstRate: gstType === "INTRA_STATE" ? gstRate / 2 : undefined,
      sgstRate: gstType === "INTRA_STATE" ? gstRate / 2 : undefined,
      igstRate: gstType === "INTER_STATE" ? gstRate : undefined,
      discountAmount,
      items: selectedAmads.map((a) => ({
        amadId: a.id,
        amadNo: a.amadNo,
        amadDate: a.date,
        commodityName: a.commodityName,
        pkt1: a.pkt1,
        pkt2: a.pkt2,
        pkt3: a.pkt3,
        bags: a.totalPackets,
        weightQtl: a.totalWeight,
        arrivalDate: a.date,
        dispatchDate: a.dispatchDate,
        storageDays: a.storageDays,
        graceDays: a.graceDays,
        billableDays: a.billableDays,
        ratePerQtl: 50, // Default
        rentAmount: a.rentAmount,
      })),
      charges: charges.map((c) => ({
        component: c.component,
        description: c.description,
        rate: c.rate,
        quantity: c.quantity,
        amount: c.amount,
      })),
    };

    createMutation.mutate(
      { organizationId, formInput },
      {
        onSuccess: (bill) => {
          navigate({ to: "/billing/$billId", params: { billId: bill.id } });
        },
      }
    );
  }

  const canGoNext =
    (step === 1 && selectedPartyId && selectedAmadIds.size > 0) ||
    step === 2 ||
    step === 3;

  return (
    <div className="flex flex-col gap-6" data-testid="bill-wizard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Generate Rent Bill
          </h1>
          <p className="text-sm text-muted-foreground">
            Bill #: {nextBillNo || "..."}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/billing/rent-bills" })} data-testid="bill-wizard-cancel">
          Cancel
        </Button>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-4" data-testid="bill-wizard-steps">
        {[
          { step: 1 as WizardStep, label: "Select Amads", icon: Package },
          { step: 2 as WizardStep, label: "Add Charges", icon: Calculator },
          { step: 3 as WizardStep, label: "Preview & Generate", icon: FileText },
        ].map(({ step: s, label, icon: Icon }, i) => (
          <div key={s} className="flex items-center gap-2" data-testid={`bill-wizard-step-${s}`}>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step >= s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <span
              className={`hidden sm:block ${step >= s ? "font-medium" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {i < 2 && (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Step 1: Select Party & Amads"}
            {step === 2 && "Step 2: Add Charges"}
            {step === 3 && "Step 3: Preview & Generate"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Select Amads */}
          {step === 1 && (
            <div className="space-y-4" data-testid="bill-wizard-step1-content">
              <div className="max-w-md">
                <Label>Select Party</Label>
                <Select
                  value={selectedPartyId}
                  onValueChange={(v) => {
                    setSelectedPartyId(v);
                    setSelectedAmadIds(new Set());
                  }}
                >
                  <SelectTrigger data-testid="bill-wizard-party-select">
                    <SelectValue placeholder="Select a party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.map((party) => (
                      <SelectItem key={party.id} value={party.id} data-testid={`bill-wizard-party-option-${party.id}`}>
                        {party.name}{" "}
                        {party.city && (
                          <span className="text-muted-foreground">
                            ({party.city})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPartyId && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground" data-testid="bill-wizard-amad-count">
                      {partyAmads.length} unbilled Amads available
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllAmads} data-testid="bill-wizard-select-all">
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAllAmads} data-testid="bill-wizard-clear-all">
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md" data-testid="bill-wizard-amad-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12" />
                          <TableHead>Amad #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Commodity</TableHead>
                          <TableHead className="text-right">Bags</TableHead>
                          <TableHead className="text-right">Weight</TableHead>
                          <TableHead className="text-right">Days</TableHead>
                          <TableHead className="text-right">Est. Rent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partyAmads.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center text-muted-foreground py-8"
                            >
                              No unbilled Amads for this party
                            </TableCell>
                          </TableRow>
                        ) : (
                          partyAmads.map((amad) => (
                            <TableRow key={amad.id} data-testid={`bill-wizard-amad-row-${amad.id}`}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedAmadIds.has(amad.id)}
                                  onCheckedChange={() =>
                                    toggleAmadSelection(amad.id)
                                  }
                                  data-testid={`bill-wizard-amad-checkbox-${amad.id}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {amad.amadNo}
                              </TableCell>
                              <TableCell>
                                {new Date(amad.date).toLocaleDateString("en-IN")}
                              </TableCell>
                              <TableCell>{amad.commodityName || "-"}</TableCell>
                              <TableCell className="text-right">
                                {amad.totalPackets}
                              </TableCell>
                              <TableCell className="text-right">
                                {amad.totalWeight.toFixed(2)} qtl
                              </TableCell>
                              <TableCell className="text-right">
                                {amad.storageDays}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatIndianRupees(amad.estimatedRent)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedAmadIds.size > 0 && (
                    <div className="bg-muted p-4 rounded-md" data-testid="bill-wizard-selection-summary">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">
                            Selected Amads
                          </div>
                          <div className="text-lg font-medium" data-testid="bill-wizard-selected-count">
                            {selectedAmadIds.size}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Bags</div>
                          <div className="text-lg font-medium" data-testid="bill-wizard-total-bags">
                            {totals.totalBags}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Est. Rent</div>
                          <div className="text-lg font-medium" data-testid="bill-wizard-est-rent">
                            {formatIndianRupees(totals.totalRent)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Add Charges */}
          {step === 2 && (
            <div className="space-y-6" data-testid="bill-wizard-step2-content">
              {/* Rent Summary */}
              <div>
                <h4 className="font-medium mb-2">Rent Summary</h4>
                <div className="border rounded-md" data-testid="bill-wizard-rent-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amad #</TableHead>
                        <TableHead className="text-right">Bags</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="text-right">Days</TableHead>
                        <TableHead className="text-right">Grace</TableHead>
                        <TableHead className="text-right">Billable</TableHead>
                        <TableHead className="text-right">Rent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedAmads.map((amad) => (
                        <TableRow key={amad.id}>
                          <TableCell>{amad.amadNo}</TableCell>
                          <TableCell className="text-right">
                            {amad.totalPackets}
                          </TableCell>
                          <TableCell className="text-right">
                            {amad.totalWeight.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {amad.storageDays}
                          </TableCell>
                          <TableCell className="text-right">
                            {amad.graceDays}
                          </TableCell>
                          <TableCell className="text-right">
                            {amad.billableDays}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatIndianRupees(amad.rentAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium bg-muted/50">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {totals.totalBags}
                        </TableCell>
                        <TableCell className="text-right">
                          {totals.totalWeight.toFixed(2)}
                        </TableCell>
                        <TableCell colSpan={3} />
                        <TableCell className="text-right">
                          {formatIndianRupees(totals.totalRent)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Additional Charges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Additional Charges</h4>
                  <div className="flex gap-2">
                    {(
                      [
                        "LOADING",
                        "UNLOADING",
                        "DALA",
                        "INSURANCE",
                        "OTHER",
                      ] as PriceComponentValue[]
                    ).map((comp) => (
                      <Button
                        key={comp}
                        variant="outline"
                        size="sm"
                        onClick={() => addCharge(comp)}
                        disabled={charges.some((c) => c.component === comp)}
                        data-testid={`bill-wizard-add-charge-${comp.toLowerCase()}`}
                      >
                        + {comp}
                      </Button>
                    ))}
                  </div>
                </div>

                {charges.length > 0 && (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Charge Type</TableHead>
                          <TableHead className="w-32">Rate</TableHead>
                          <TableHead className="w-24">Qty</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {charges.map((charge) => (
                          <TableRow key={charge.id}>
                            <TableCell>{charge.component}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={charge.rate}
                                onChange={(e) =>
                                  updateCharge(charge.id, {
                                    rate: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={charge.quantity}
                                onChange={(e) =>
                                  updateCharge(charge.id, {
                                    quantity: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatIndianRupees(charge.amount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCharge(charge.id)}
                              >
                                &times;
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* GST Settings */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <Label>GST Type</Label>
                  <Select
                    value={gstType}
                    onValueChange={(v) => setGstType(v as GstTypeValue)}
                  >
                    <SelectTrigger data-testid="bill-wizard-gst-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTRA_STATE" data-testid="bill-wizard-gst-intra">
                        Intra-State (CGST+SGST)
                      </SelectItem>
                      <SelectItem value="INTER_STATE" data-testid="bill-wizard-gst-inter">
                        Inter-State (IGST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>GST Rate (%)</Label>
                  <Input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                    data-testid="bill-wizard-gst-rate"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="max-w-md">
                <Label>Discount Amount</Label>
                <Input
                  type="number"
                  value={discountAmount}
                  onChange={(e) =>
                    setDiscountAmount(parseFloat(e.target.value) || 0)
                  }
                  data-testid="bill-wizard-discount"
                />
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-6" data-testid="bill-wizard-step3-content">
              {/* Bill Summary */}
              <div className="grid grid-cols-2 gap-6" data-testid="bill-wizard-preview">
                <div>
                  <h4 className="font-medium mb-2">Bill Details</h4>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Bill #</dt>
                      <dd className="font-medium">{nextBillNo}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd>{new Date(billDate).toLocaleDateString("en-IN")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Party</dt>
                      <dd>
                        {parties.find((p) => p.id === selectedPartyId)?.name}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Amads</dt>
                      <dd>{selectedAmads.length}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Amount Summary</h4>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Rent Amount</dt>
                      <dd>{formatIndianRupees(totals.totalRent)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Other Charges</dt>
                      <dd>{formatIndianRupees(totals.totalCharges)}</dd>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <dt>Discount</dt>
                        <dd>-{formatIndianRupees(discountAmount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Taxable Amount</dt>
                      <dd>{formatIndianRupees(totals.taxableAmount)}</dd>
                    </div>
                    {gstType === "INTRA_STATE" ? (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">
                            CGST @{totals.cgstRate}%
                          </dt>
                          <dd>{formatIndianRupees(totals.cgstAmount)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">
                            SGST @{totals.sgstRate}%
                          </dt>
                          <dd>{formatIndianRupees(totals.sgstAmount)}</dd>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          IGST @{totals.igstRate}%
                        </dt>
                        <dd>{formatIndianRupees(totals.igstAmount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-1 font-medium">
                      <dt>Total Amount</dt>
                      <dd>{formatIndianRupees(totals.roundedAmount)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md text-sm">
                <strong>Amount in Words:</strong>{" "}
                {convertAmountToWords(totals.roundedAmount)}
              </div>

              {/* Notes */}
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes for the bill..."
                  rows={3}
                  data-testid="bill-wizard-notes"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => (s - 1) as WizardStep)}
          disabled={step === 1}
          data-testid="bill-wizard-back"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex gap-2">
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => (s + 1) as WizardStep)}
              disabled={!canGoNext}
              data-testid="bill-wizard-next"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || !canGoNext}
              data-testid="bill-wizard-generate-button"
            >
              {createMutation.isPending ? "Generating..." : "Generate Bill"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
