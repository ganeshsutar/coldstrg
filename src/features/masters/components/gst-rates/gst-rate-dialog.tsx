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
import type { GstRate, CreateGstRateInput } from "../../types";

interface GstRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gstRate?: GstRate | null;
  organizationId: string;
  onSave: (input: CreateGstRateInput & { id?: string }) => void;
  isPending: boolean;
}

export function GstRateDialog({
  open,
  onOpenChange,
  gstRate,
  organizationId,
  onSave,
  isPending,
}: GstRateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open && (
          <GstRateForm
            gstRate={gstRate}
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

interface GstRateFormProps {
  gstRate?: GstRate | null;
  organizationId: string;
  onSave: (input: CreateGstRateInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function GstRateForm({
  gstRate,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: GstRateFormProps) {
  const isEdit = !!gstRate;

  const [cgstRate, setCgstRate] = useState(
    gstRate?.cgstRate?.toString() ?? ""
  );
  const [sgstRate, setSgstRate] = useState(
    gstRate?.sgstRate?.toString() ?? ""
  );
  const [hsnCode, setHsnCode] = useState(gstRate?.hsnCode ?? "");
  const [description, setDescription] = useState(gstRate?.description ?? "");
  const [effectiveDate, setEffectiveDate] = useState(
    gstRate?.effectiveDate ?? new Date().toISOString().split("T")[0]
  );
  const [isActive, setIsActive] = useState(gstRate?.isActive !== false);

  // Auto-calculate IGST = CGST + SGST
  const igstRate = (parseFloat(cgstRate) || 0) + (parseFloat(sgstRate) || 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateGstRateInput & { id?: string } = {
      organizationId,
      cgstRate: parseFloat(cgstRate),
      sgstRate: parseFloat(sgstRate),
      igstRate,
      effectiveDate,
      isActive,
      ...(isEdit && { id: gstRate!.id }),
      ...(hsnCode && { hsnCode }),
      ...(description && { description }),
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit GST Rate" : "Add GST Rate"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the GST rate details below."
            : "Fill in the details to add a new GST rate. IGST is auto-calculated."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gCgst">CGST %</Label>
            <Input
              id="gCgst"
              type="number"
              step="0.01"
              value={cgstRate}
              onChange={(e) => setCgstRate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gSgst">SGST %</Label>
            <Input
              id="gSgst"
              type="number"
              step="0.01"
              value={sgstRate}
              onChange={(e) => setSgstRate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gIgst">IGST %</Label>
            <Input
              id="gIgst"
              type="number"
              value={igstRate}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gHsn">HSN Code</Label>
            <Input
              id="gHsn"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gDate">Effective Date</Label>
            <Input
              id="gDate"
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gDesc">Description</Label>
          <Input
            id="gDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gStatus">Status</Label>
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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !cgstRate || !sgstRate || !effectiveDate}
          >
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
