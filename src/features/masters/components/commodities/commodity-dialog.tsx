import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  COMMODITY_TYPES,
  RENT_BASIS,
  RENT_ON,
  CHARGE_RENT_TYPE,
  RENT_CALCULATION_MODE,
} from "@/config/constants";
import type {
  Commodity,
  CreateCommodityInput,
  RentOnType,
  ChargeRentTypeValue,
  RentCalculationModeType,
} from "../../types";

interface CommodityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodity?: Commodity | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateCommodityInput & { id?: string }) => void;
  isPending: boolean;
}

export function CommodityDialog({
  open,
  onOpenChange,
  commodity,
  nextCode,
  organizationId,
  onSave,
  isPending,
}: CommodityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {open && (
          <CommodityForm
            commodity={commodity}
            nextCode={nextCode}
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

interface CommodityFormProps {
  commodity?: Commodity | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateCommodityInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function CommodityForm({
  commodity,
  nextCode,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: CommodityFormProps) {
  const isEdit = !!commodity;

  // Basic Info
  const [name, setName] = useState(commodity?.name ?? "");
  const [nameHindi, setNameHindi] = useState(commodity?.nameHindi ?? "");
  const [code, setCode] = useState(commodity?.code ?? nextCode);
  const [commodityType, setCommodityType] = useState(
    commodity?.commodityType ?? ""
  );
  const [hsnCode, setHsnCode] = useState(commodity?.hsnCode ?? "");
  const [barcode, setBarcode] = useState(commodity?.barcode ?? "");
  const [isActive, setIsActive] = useState(commodity?.isActive !== false);

  // Rent Settings
  const [rentRatePKT1, setRentRatePKT1] = useState(
    commodity?.rentRatePKT1?.toString() ?? ""
  );
  const [rentRatePKT2, setRentRatePKT2] = useState(
    commodity?.rentRatePKT2?.toString() ?? ""
  );
  const [rentRatePKT3, setRentRatePKT3] = useState(
    commodity?.rentRatePKT3?.toString() ?? ""
  );
  const [rateWT, setRateWT] = useState(commodity?.rateWT?.toString() ?? "");
  const [gracePeriod, setGracePeriod] = useState(
    commodity?.gracePeriod?.toString() ?? ""
  );
  const [zeroRentDays, setZeroRentDays] = useState(
    commodity?.zeroRentDays?.toString() ?? "0"
  );
  const [halfRentDays, setHalfRentDays] = useState(
    commodity?.halfRentDays?.toString() ?? "0"
  );
  const [rentBasis, setRentBasis] = useState(commodity?.rentBasis ?? "");
  const [rentOn, setRentOn] = useState(commodity?.rentOn ?? "");
  const [chargeRentType, setChargeRentType] = useState(
    commodity?.chargeRentType ?? ""
  );
  const [rentCalculationMode, setRentCalculationMode] = useState(
    commodity?.rentCalculationMode ?? ""
  );

  // Pricing
  const [loanRate, setLoanRate] = useState(
    commodity?.loanRate?.toString() ?? ""
  );
  const [ratePerUnitField, setRatePerUnitField] = useState(
    commodity?.ratePerUnitField?.toString() ?? ""
  );
  const [ratePerUnitMandi, setRatePerUnitMandi] = useState(
    commodity?.ratePerUnitMandi?.toString() ?? ""
  );
  const [purchasePrice, setPurchasePrice] = useState(
    commodity?.purchasePrice?.toString() ?? ""
  );
  const [salePrice, setSalePrice] = useState(
    commodity?.salePrice?.toString() ?? ""
  );
  const [mrp, setMrp] = useState(commodity?.mrp?.toString() ?? "");

  // Stock
  const [openingStock, setOpeningStock] = useState(
    commodity?.openingStock?.toString() ?? "0"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateCommodityInput & { id?: string } = {
      organizationId,
      name,
      code,
      isActive,
      ...(isEdit && { id: commodity!.id }),
      // Basic Info
      ...(nameHindi && { nameHindi }),
      ...(commodityType && {
        commodityType: commodityType as "SEASONAL" | "REGULAR",
      }),
      ...(hsnCode && { hsnCode }),
      ...(barcode && { barcode }),
      // Rent Settings
      ...(rentRatePKT1 && { rentRatePKT1: parseFloat(rentRatePKT1) }),
      ...(rentRatePKT2 && { rentRatePKT2: parseFloat(rentRatePKT2) }),
      ...(rentRatePKT3 && { rentRatePKT3: parseFloat(rentRatePKT3) }),
      ...(rateWT && { rateWT: parseFloat(rateWT) }),
      ...(gracePeriod && { gracePeriod: parseInt(gracePeriod, 10) }),
      zeroRentDays: parseInt(zeroRentDays, 10) || 0,
      halfRentDays: parseInt(halfRentDays, 10) || 0,
      ...(rentBasis && {
        rentBasis: rentBasis as "QUINTAL" | "PACKET" | "WEIGHT",
      }),
      ...(rentOn && { rentOn: rentOn as RentOnType }),
      ...(chargeRentType && {
        chargeRentType: chargeRentType as ChargeRentTypeValue,
      }),
      ...(rentCalculationMode && {
        rentCalculationMode: rentCalculationMode as RentCalculationModeType,
      }),
      // Pricing
      ...(loanRate && { loanRate: parseFloat(loanRate) }),
      ...(ratePerUnitField && {
        ratePerUnitField: parseFloat(ratePerUnitField),
      }),
      ...(ratePerUnitMandi && {
        ratePerUnitMandi: parseFloat(ratePerUnitMandi),
      }),
      ...(purchasePrice && { purchasePrice: parseFloat(purchasePrice) }),
      ...(salePrice && { salePrice: parseFloat(salePrice) }),
      ...(mrp && { mrp: parseFloat(mrp) }),
      // Stock
      openingStock: parseInt(openingStock, 10) || 0,
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Commodity" : "Add Commodity"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the commodity details below."
            : "Fill in the details to add a new commodity."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="rent">Rent Settings</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={isEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commodityType">Type</Label>
                <Select value={commodityType} onValueChange={setCommodityType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMODITY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (English)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameHindi">Name (Hindi)</Label>
                <Input
                  id="nameHindi"
                  value={nameHindi}
                  onChange={(e) => setNameHindi(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hsnCode">HSN Code</Label>
                <Input
                  id="hsnCode"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={isActive ? "active" : "inactive"}
                  onValueChange={(v) => setIsActive(v === "active")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Rent Settings */}
          <TabsContent value="rent" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentRatePKT1">Rent Rate PKT1</Label>
                <Input
                  id="rentRatePKT1"
                  type="number"
                  step="0.01"
                  value={rentRatePKT1}
                  onChange={(e) => setRentRatePKT1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentRatePKT2">Rent Rate PKT2</Label>
                <Input
                  id="rentRatePKT2"
                  type="number"
                  step="0.01"
                  value={rentRatePKT2}
                  onChange={(e) => setRentRatePKT2(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentRatePKT3">Rent Rate PKT3</Label>
                <Input
                  id="rentRatePKT3"
                  type="number"
                  step="0.01"
                  value={rentRatePKT3}
                  onChange={(e) => setRentRatePKT3(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rateWT">Rate (Weight)</Label>
                <Input
                  id="rateWT"
                  type="number"
                  step="0.01"
                  value={rateWT}
                  onChange={(e) => setRateWT(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentBasis">Rent Basis</Label>
                <Select value={rentBasis} onValueChange={setRentBasis}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select basis" />
                  </SelectTrigger>
                  <SelectContent>
                    {RENT_BASIS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentOn">Rent On</Label>
                <Select value={rentOn} onValueChange={setRentOn}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rent on" />
                  </SelectTrigger>
                  <SelectContent>
                    {RENT_ON.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zeroRentDays">Zero Rent Days</Label>
                <Input
                  id="zeroRentDays"
                  type="number"
                  value={zeroRentDays}
                  onChange={(e) => setZeroRentDays(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="halfRentDays">Half Rent Days</Label>
                <Input
                  id="halfRentDays"
                  type="number"
                  value={halfRentDays}
                  onChange={(e) => setHalfRentDays(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chargeRentType">Charge Rent Type</Label>
                <Select
                  value={chargeRentType}
                  onValueChange={setChargeRentType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHARGE_RENT_TYPE.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentCalculationMode">
                  Rent Calculation Mode
                </Label>
                <Select
                  value={rentCalculationMode}
                  onValueChange={setRentCalculationMode}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {RENT_CALCULATION_MODE.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Pricing */}
          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loanRate">Loan Rate</Label>
                <Input
                  id="loanRate"
                  type="number"
                  step="0.01"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ratePerUnitField">Rate per Unit (Field)</Label>
                <Input
                  id="ratePerUnitField"
                  type="number"
                  step="0.01"
                  value={ratePerUnitField}
                  onChange={(e) => setRatePerUnitField(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ratePerUnitMandi">Rate per Unit (Mandi)</Label>
                <Input
                  id="ratePerUnitMandi"
                  type="number"
                  step="0.01"
                  value={ratePerUnitMandi}
                  onChange={(e) => setRatePerUnitMandi(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrp">MRP</Label>
                <Input
                  id="mrp"
                  type="number"
                  step="0.01"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Stock */}
          <TabsContent value="stock" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingStock">Opening Stock</Label>
                <Input
                  id="openingStock"
                  type="number"
                  value={openingStock}
                  onChange={(e) => setOpeningStock(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !name || !code}>
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
