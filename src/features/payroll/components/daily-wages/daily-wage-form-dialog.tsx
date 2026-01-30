import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { DWage, DWageFormInput } from "../../types";
import { formatCurrency } from "../../utils";

interface DailyWageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wage?: DWage | null;
  onSubmit: (data: DWageFormInput) => void;
  isSubmitting?: boolean;
}

export function DailyWageFormDialog({
  open,
  onOpenChange,
  wage,
  onSubmit,
  isSubmitting,
}: DailyWageFormDialogProps) {
  const isEditing = !!wage;

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [workerName, setWorkerName] = useState("");
  const [workerContact, setWorkerContact] = useState("");
  const [workType, setWorkType] = useState("");
  const [hoursWorked, setHoursWorked] = useState(8);
  const [ratePerHour, setRatePerHour] = useState(50);
  const [unitsCompleted, setUnitsCompleted] = useState(0);
  const [ratePerUnit, setRatePerUnit] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [remarks, setRemarks] = useState("");

  const { grossAmount, netAmount } = useMemo(() => {
    const hourlyEarning = hoursWorked * ratePerHour;
    const unitEarning = unitsCompleted * ratePerUnit;
    const gross = hourlyEarning + unitEarning;
    const net = gross - deductions;
    return { grossAmount: gross, netAmount: net };
  }, [hoursWorked, ratePerHour, unitsCompleted, ratePerUnit, deductions]);

  useEffect(() => {
    if (open) {
      if (wage) {
        setDate(wage.date);
        setWorkerName(wage.workerName);
        setWorkerContact(wage.workerContact || "");
        setWorkType(wage.workType || "");
        setHoursWorked(wage.hoursWorked || 8);
        setRatePerHour(wage.ratePerHour || 0);
        setUnitsCompleted(wage.unitsCompleted || 0);
        setRatePerUnit(wage.ratePerUnit || 0);
        setDeductions(wage.deductions || 0);
        setRemarks(wage.remarks || "");
      } else {
        setDate(new Date().toISOString().split("T")[0]);
        setWorkerName("");
        setWorkerContact("");
        setWorkType("");
        setHoursWorked(8);
        setRatePerHour(50);
        setUnitsCompleted(0);
        setRatePerUnit(0);
        setDeductions(0);
        setRemarks("");
      }
    }
  }, [open, wage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName || !date) return;

    onSubmit({
      date,
      workerName,
      workerContact: workerContact || undefined,
      workType: workType || undefined,
      hoursWorked,
      ratePerHour,
      unitsCompleted,
      ratePerUnit,
      deductions,
      remarks: remarks || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Daily Wage" : "Add Daily Wage"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update daily wage entry"
              : "Record daily wage for a worker"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Work Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workerName">Worker Name</Label>
              <Input
                id="workerName"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Enter worker name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workType">Work Type</Label>
              <Input
                id="workType"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                placeholder="e.g., Loading, Unloading"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workerContact">Contact</Label>
              <Input
                id="workerContact"
                value={workerContact}
                onChange={(e) => setWorkerContact(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ratePerHour">Rate Per Hour (₹)</Label>
              <Input
                id="ratePerHour"
                type="number"
                value={ratePerHour}
                onChange={(e) => setRatePerHour(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitsCompleted">Units Completed</Label>
              <Input
                id="unitsCompleted"
                type="number"
                value={unitsCompleted}
                onChange={(e) => setUnitsCompleted(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ratePerUnit">Rate Per Unit (₹)</Label>
              <Input
                id="ratePerUnit"
                type="number"
                value={ratePerUnit}
                onChange={(e) => setRatePerUnit(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductions">Deductions (₹)</Label>
            <Input
              id="deductions"
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
            />
          </div>

          {/* Total Display */}
          <div className="bg-muted rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Gross Amount</p>
                <p className="text-lg font-bold">
                  {formatCurrency(grossAmount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Net Amount</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(netAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Additional notes"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
