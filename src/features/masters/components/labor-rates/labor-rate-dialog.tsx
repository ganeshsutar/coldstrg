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
import { LABOR_RATE_TYPES } from "@/config/constants";
import type { CreateLaborRateInput, LaborRateTypeValue } from "../../types";

interface LaborRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onSave: (input: CreateLaborRateInput) => void;
  isPending: boolean;
}

export function LaborRateDialog({
  open,
  onOpenChange,
  organizationId,
  onSave,
  isPending,
}: LaborRateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open && (
          <LaborRateForm
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

interface LaborRateFormProps {
  organizationId: string;
  onSave: (input: CreateLaborRateInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function LaborRateForm({
  organizationId,
  onSave,
  onCancel,
  isPending,
}: LaborRateFormProps) {
  const [rateType, setRateType] = useState<string>("");
  const [ratePKT1, setRatePKT1] = useState("");
  const [ratePKT2, setRatePKT2] = useState("");
  const [ratePKT3, setRatePKT3] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reason, setReason] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateLaborRateInput = {
      organizationId,
      rateType: rateType as LaborRateTypeValue,
      ratePKT1: parseFloat(ratePKT1),
      effectiveDate,
      isActive: true,
      ...(ratePKT2 && { ratePKT2: parseFloat(ratePKT2) }),
      ...(ratePKT3 && { ratePKT3: parseFloat(ratePKT3) }),
      ...(reason && { reason }),
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Labor Rate</DialogTitle>
        <DialogDescription>
          Create a new labor rate entry. Existing rates are preserved as
          history.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="lType">Rate Type</Label>
          <Select value={rateType} onValueChange={setRateType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {LABOR_RATE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lPKT1">Rate PKT1</Label>
            <Input
              id="lPKT1"
              type="number"
              step="0.01"
              value={ratePKT1}
              onChange={(e) => setRatePKT1(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lPKT2">Rate PKT2</Label>
            <Input
              id="lPKT2"
              type="number"
              step="0.01"
              value={ratePKT2}
              onChange={(e) => setRatePKT2(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lPKT3">Rate PKT3</Label>
            <Input
              id="lPKT3"
              type="number"
              step="0.01"
              value={ratePKT3}
              onChange={(e) => setRatePKT3(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lDate">Effective Date</Label>
          <Input
            id="lDate"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lReason">Reason</Label>
          <Input
            id="lReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rate change"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !rateType || !ratePKT1 || !effectiveDate}
          >
            {isPending ? "Saving..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
