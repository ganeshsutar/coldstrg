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
import { useCreateTemperatureLog } from "../../hooks/use-temperature";
import { getTemperatureStatus } from "../../utils/temperature-utils";
import type { CreateTemperatureLogInput, Chamber } from "../../types";

interface TempLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  preselectedChamber?: Chamber;
}

export function TempLogDialog({
  open,
  onOpenChange,
  organizationId,
  preselectedChamber,
}: TempLogDialogProps) {
  const { data: chambers = [] } = useChambers(organizationId);
  const createMutation = useCreateTemperatureLog();

  const [chamberId, setChamberId] = useState<string>(preselectedChamber?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toTimeString().split(" ")[0].slice(0, 5)
  );
  const [lowTemp, setLowTemp] = useState("");
  const [highTemp, setHighTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [recordedBy, setRecordedBy] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen && preselectedChamber) {
      setChamberId(preselectedChamber.id);
    }
    if (!newOpen) {
      // Reset form when closing
      setLowTemp("");
      setHighTemp("");
      setHumidity("");
      setRemarks("");
    }
    onOpenChange(newOpen);
  }, [onOpenChange, preselectedChamber]);

  const selectedChamber = chambers.find((c) => c.id === chamberId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chamberId || !lowTemp || !highTemp) return;

    const low = parseFloat(lowTemp);
    const high = parseFloat(highTemp);
    const avg = (low + high) / 2;
    const status = getTemperatureStatus(avg, selectedChamber?.targetTemperature ?? undefined);

    const input: CreateTemperatureLogInput = {
      organizationId,
      chamberId,
      chamberName: selectedChamber?.name,
      date,
      time,
      lowTemp: low,
      highTemp: high,
      avgTemp: avg,
      status,
      ...(humidity && { humidity: parseFloat(humidity) }),
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

  const isValid = chamberId && lowTemp && highTemp;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Temperature Reading</DialogTitle>
          <DialogDescription>
            Record temperature measurements for a chamber.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="chamber">Chamber</Label>
            <Select value={chamberId} onValueChange={setChamberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select chamber" />
              </SelectTrigger>
              <SelectContent>
                {chambers.map((chamber) => (
                  <SelectItem key={chamber.id} value={chamber.id}>
                    {chamber.name} (Room {chamber.roomNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="lowTemp">Low Temp (°C)</Label>
              <Input
                id="lowTemp"
                type="number"
                step="0.1"
                value={lowTemp}
                onChange={(e) => setLowTemp(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="highTemp">High Temp (°C)</Label>
              <Input
                id="highTemp"
                type="number"
                step="0.1"
                value={highTemp}
                onChange={(e) => setHighTemp(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                step="0.1"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="recordedBy">Recorded By</Label>
              <Input
                id="recordedBy"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Save Reading"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
