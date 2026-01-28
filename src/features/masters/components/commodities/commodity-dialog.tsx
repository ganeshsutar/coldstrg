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
import { COMMODITY_TYPES, RENT_BASIS } from "@/config/constants";
import type { Commodity, CreateCommodityInput } from "../../types";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

  const [name, setName] = useState(commodity?.name ?? "");
  const [nameHindi, setNameHindi] = useState(commodity?.nameHindi ?? "");
  const [code, setCode] = useState(commodity?.code ?? nextCode);
  const [commodityType, setCommodityType] = useState(
    commodity?.commodityType ?? ""
  );
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
  const [rentBasis, setRentBasis] = useState(commodity?.rentBasis ?? "");
  const [hsnCode, setHsnCode] = useState(commodity?.hsnCode ?? "");
  const [loanRate, setLoanRate] = useState(
    commodity?.loanRate?.toString() ?? ""
  );
  const [isActive, setIsActive] = useState(commodity?.isActive !== false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateCommodityInput & { id?: string } = {
      organizationId,
      name,
      code,
      isActive,
      ...(isEdit && { id: commodity!.id }),
      ...(nameHindi && { nameHindi }),
      ...(commodityType && {
        commodityType: commodityType as "SEASONAL" | "REGULAR",
      }),
      ...(rentRatePKT1 && { rentRatePKT1: parseFloat(rentRatePKT1) }),
      ...(rentRatePKT2 && { rentRatePKT2: parseFloat(rentRatePKT2) }),
      ...(rentRatePKT3 && { rentRatePKT3: parseFloat(rentRatePKT3) }),
      ...(rateWT && { rateWT: parseFloat(rateWT) }),
      ...(gracePeriod && { gracePeriod: parseInt(gracePeriod, 10) }),
      ...(rentBasis && {
        rentBasis: rentBasis as "QUINTAL" | "PACKET" | "WEIGHT",
      }),
      ...(hsnCode && { hsnCode }),
      ...(loanRate && { loanRate: parseFloat(loanRate) }),
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
            <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
            <Input
              id="gracePeriod"
              type="number"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
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
