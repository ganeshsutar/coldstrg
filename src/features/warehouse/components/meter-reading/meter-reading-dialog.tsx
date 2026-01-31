import { useState, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChambers } from "../../hooks/use-chambers";
import { useCreateMeterReading, useLatestMeterReading } from "../../hooks/use-meter-reading";
import type { CreateMeterReadingInput, Chamber } from "../../types";

interface MeterReadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  preselectedChamber?: Chamber;
}

export function MeterReadingDialog({
  open,
  onOpenChange,
  organizationId,
  preselectedChamber,
}: MeterReadingDialogProps) {
  const { data: chambers = [] } = useChambers(organizationId);
  const createMutation = useCreateMeterReading();

  const [chamberId, setChamberId] = useState<string>(preselectedChamber?.id || "general");
  const [meterNumber, setMeterNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toTimeString().split(" ")[0].slice(0, 5)
  );
  const [currentReading, setCurrentReading] = useState("");
  const [recordedBy, setRecordedBy] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data: latestReading } = useLatestMeterReading(
    organizationId,
    chamberId === "general" ? undefined : chamberId
  );

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen && preselectedChamber) {
      setChamberId(preselectedChamber.id);
    }
    if (!newOpen) {
      // Reset form when closing
      setCurrentReading("");
      setRemarks("");
    }
    onOpenChange(newOpen);
  }, [onOpenChange, preselectedChamber]);

  const selectedChamber = chamberId === "general" ? undefined : chambers.find((c) => c.id === chamberId);
  const previousReading = latestReading?.currentReading || 0;

  const consumption = currentReading
    ? Math.max(0, parseFloat(currentReading) - previousReading)
    : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentReading) return;

    const input: CreateMeterReadingInput = {
      organizationId,
      readingDate: date,
      currentReading: parseFloat(currentReading),
      previousReading,
      consumption,
      unit: "kWh",
      ...(chamberId && chamberId !== "general" && { chamberId }),
      ...(selectedChamber && { chamberName: selectedChamber.name }),
      ...(meterNumber && { meterNumber }),
      ...(time && { readingTime: time }),
      ...(recordedBy && { recordedBy }),
      ...(remarks && { remarks }),
      isActive: true,
    };

    createMutation.mutate(input, {
      onSuccess: () => {
        handleOpenChange(false);
      },
    });
  }

  const isValid = currentReading && parseFloat(currentReading) >= previousReading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" data-testid="meter-reading-dialog">
        <DialogHeader>
          <DialogTitle>Record Meter Reading</DialogTitle>
          <DialogDescription>
            Enter the current electricity meter reading.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="chamber">Chamber (Optional)</Label>
            <Select value={chamberId} onValueChange={setChamberId}>
              <SelectTrigger data-testid="meter-form-chamber-select">
                <SelectValue placeholder="Select chamber (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Meter</SelectItem>
                {chambers.map((chamber) => (
                  <SelectItem key={chamber.id} value={chamber.id}>
                    {chamber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meterNumber">Meter Number</Label>
            <Input
              id="meterNumber"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              placeholder="e.g., MTR001"
              data-testid="meter-form-meter-number-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="meter-form-date-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                data-testid="meter-form-time-input"
              />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg" data-testid="meter-form-previous-reading">
            <div className="text-sm text-muted-foreground">Previous Reading</div>
            <div className="text-lg font-medium">{previousReading.toFixed(2)} kWh</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="currentReading">Current Reading (kWh)</Label>
            <Input
              id="currentReading"
              type="number"
              step="0.01"
              value={currentReading}
              onChange={(e) => setCurrentReading(e.target.value)}
              required
              data-testid="meter-form-current-reading-input"
            />
          </div>

          {currentReading && (
            <div className="p-3 bg-primary/10 rounded-lg" data-testid="meter-form-consumption">
              <div className="text-sm text-muted-foreground">Consumption</div>
              <div className="text-xl font-bold text-primary">
                {consumption.toFixed(2)} kWh
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="recordedBy">Recorded By</Label>
            <Input
              id="recordedBy"
              value={recordedBy}
              onChange={(e) => setRecordedBy(e.target.value)}
              data-testid="meter-form-recorded-by-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              data-testid="meter-form-remarks-input"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} data-testid="meter-form-cancel-button">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || createMutation.isPending} data-testid="meter-form-submit-button">
              {createMutation.isPending ? "Saving..." : "Save Reading"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
