import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
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
import { useAmadList } from "../../hooks/use-amad";
import type { CreateTakpattiInput } from "../../types";

interface TakpattiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextTakpattiNo: number;
  organizationId: string;
  onSave: (input: CreateTakpattiInput) => void;
  isPending: boolean;
}

export function TakpattiFormDialog({
  open,
  onOpenChange,
  nextTakpattiNo,
  organizationId,
  onSave,
  isPending,
}: TakpattiFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {open && (
          <TakpattiForm
            nextTakpattiNo={nextTakpattiNo}
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

interface TakpattiFormProps {
  nextTakpattiNo: number;
  organizationId: string;
  onSave: (input: CreateTakpattiInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function TakpattiForm({
  nextTakpattiNo,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: TakpattiFormProps) {
  const { data: amadList = [] } = useAmadList(organizationId);

  const [takpattiNo] = useState(nextTakpattiNo);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amadId, setAmadId] = useState("");
  const [amadNo, setAmadNo] = useState("");
  const [room, setRoom] = useState("");
  const [pkt1, setPkt1] = useState("");
  const [pkt2, setPkt2] = useState("");
  const [pkt3, setPkt3] = useState("");

  const totalPackets = useMemo(
    () =>
      (parseInt(pkt1, 10) || 0) +
      (parseInt(pkt2, 10) || 0) +
      (parseInt(pkt3, 10) || 0),
    [pkt1, pkt2, pkt3]
  );

  function handleAmadSelect(id: string) {
    setAmadId(id);
    const selected = amadList.find((a) => a.id === id);
    if (selected) {
      setAmadNo(String(selected.amadNo));
      if (selected.room) setRoom(selected.room);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateTakpattiInput = {
      organizationId,
      takpattiNo,
      date,
      totalPackets,
      ...(amadId && { amadId }),
      ...(amadNo && { amadNo: parseInt(amadNo, 10) }),
      ...(room && { room }),
      ...(pkt1 && { pkt1: parseInt(pkt1, 10) }),
      ...(pkt2 && { pkt2: parseInt(pkt2, 10) }),
      ...(pkt3 && { pkt3: parseInt(pkt3, 10) }),
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>New Takpatti</DialogTitle>
        <DialogDescription>
          Create a new weighment slip entry.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="takpattiNo">Takpatti No</Label>
            <Input id="takpattiNo" type="number" value={takpattiNo} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amad">Select Amad</Label>
            <Select value={amadId} onValueChange={handleAmadSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Amad" />
              </SelectTrigger>
              <SelectContent>
                {amadList.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    #{a.amadNo} - {a.partyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Room</Label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>PKT1</Label>
            <Input
              type="number"
              value={pkt1}
              onChange={(e) => setPkt1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>PKT2</Label>
            <Input
              type="number"
              value={pkt2}
              onChange={(e) => setPkt2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>PKT3</Label>
            <Input
              type="number"
              value={pkt3}
              onChange={(e) => setPkt3(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-3 text-sm">
          <span className="text-muted-foreground">Total Packets: </span>
          <span className="font-semibold">{totalPackets}</span>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !date}>
            {isPending ? "Saving..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
