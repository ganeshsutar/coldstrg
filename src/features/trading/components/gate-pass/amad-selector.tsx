import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AmadSelectionItem, GatePassDetailFormInput } from "../../types";

interface AmadSelectorProps {
  amads: AmadSelectionItem[];
  onChange: (details: GatePassDetailFormInput[]) => void;
}

export function AmadSelector({ amads, onChange }: AmadSelectorProps) {
  const [selections, setSelections] = useState<Map<string, AmadSelectionItem>>(
    () => new Map()
  );

  // Calculate totals
  const totals = useMemo(() => {
    let pkt1 = 0;
    let pkt2 = 0;
    let pkt3 = 0;

    selections.forEach((item) => {
      pkt1 += item.selectedPkt1;
      pkt2 += item.selectedPkt2;
      pkt3 += item.selectedPkt3;
    });

    return {
      pkt1,
      pkt2,
      pkt3,
      total: pkt1 + pkt2 + pkt3,
    };
  }, [selections]);

  function updateSelection(amadId: string, updates: Partial<AmadSelectionItem>) {
    setSelections((prev) => {
      const next = new Map(prev);
      const existing = next.get(amadId) || amads.find((a) => a.amadId === amadId);

      if (!existing) return prev;

      const updated = { ...existing, ...updates };

      // Remove if deselected
      if (!updated.selected && updates.selected === false) {
        next.delete(amadId);
      } else {
        next.set(amadId, updated);
      }

      // Notify parent of changes
      const details: GatePassDetailFormInput[] = [];
      next.forEach((item) => {
        if (item.selected && (item.selectedPkt1 > 0 || item.selectedPkt2 > 0 || item.selectedPkt3 > 0)) {
          details.push({
            amadId: item.amadId,
            amadNo: item.amadNo,
            amadDate: item.amadDate,
            commodityName: item.commodityName,
            variety: item.variety,
            marks: item.marks,
            pkt1: item.selectedPkt1,
            pkt2: item.selectedPkt2,
            pkt3: item.selectedPkt3,
          });
        }
      });
      onChange(details);

      return next;
    });
  }

  function toggleSelection(amadId: string, checked: boolean) {
    const amad = amads.find((a) => a.amadId === amadId);
    if (!amad) return;

    if (checked) {
      updateSelection(amadId, {
        ...amad,
        selected: true,
        selectedPkt1: amad.availablePkt1,
        selectedPkt2: amad.availablePkt2,
        selectedPkt3: amad.availablePkt3,
      });
    } else {
      updateSelection(amadId, {
        selected: false,
        selectedPkt1: 0,
        selectedPkt2: 0,
        selectedPkt3: 0,
      });
    }
  }

  function updateQuantity(
    amadId: string,
    field: "selectedPkt1" | "selectedPkt2" | "selectedPkt3",
    value: number
  ) {
    const amad = amads.find((a) => a.amadId === amadId);
    if (!amad) return;

    const maxField = field.replace("selected", "available") as
      | "availablePkt1"
      | "availablePkt2"
      | "availablePkt3";
    const maxValue = amad[maxField];

    updateSelection(amadId, {
      [field]: Math.min(Math.max(0, value), maxValue),
      selected: true,
    });
  }

  if (amads.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No amads available for dispatch
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Amad #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Commodity</TableHead>
            <TableHead className="text-right">Avail PKT1</TableHead>
            <TableHead className="text-right">Dispatch PKT1</TableHead>
            <TableHead className="text-right">Avail PKT2</TableHead>
            <TableHead className="text-right">Dispatch PKT2</TableHead>
            <TableHead className="text-right">Avail PKT3</TableHead>
            <TableHead className="text-right">Dispatch PKT3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amads.map((amad) => {
            const selection = selections.get(amad.amadId);
            const isSelected = selection?.selected ?? false;

            return (
              <TableRow key={amad.amadId}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      toggleSelection(amad.amadId, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {amad.amadNo}
                </TableCell>
                <TableCell>
                  {format(new Date(amad.amadDate), "dd/MM/yy")}
                </TableCell>
                <TableCell>
                  <div>{amad.commodityName}</div>
                  {amad.variety && (
                    <div className="text-xs text-muted-foreground">
                      {amad.variety}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {amad.availablePkt1}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    max={amad.availablePkt1}
                    className="w-16 h-8 text-right"
                    value={selection?.selectedPkt1 ?? 0}
                    onChange={(e) =>
                      updateQuantity(
                        amad.amadId,
                        "selectedPkt1",
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!isSelected}
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {amad.availablePkt2}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    max={amad.availablePkt2}
                    className="w-16 h-8 text-right"
                    value={selection?.selectedPkt2 ?? 0}
                    onChange={(e) =>
                      updateQuantity(
                        amad.amadId,
                        "selectedPkt2",
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!isSelected}
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {amad.availablePkt3}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    max={amad.availablePkt3}
                    className="w-16 h-8 text-right"
                    value={selection?.selectedPkt3 ?? 0}
                    onChange={(e) =>
                      updateQuantity(
                        amad.amadId,
                        "selectedPkt3",
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!isSelected}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Totals */}
      <div className="flex justify-end gap-6 text-sm font-medium border-t pt-4">
        <div>
          PKT1: <span className="text-primary">{totals.pkt1}</span>
        </div>
        <div>
          PKT2: <span className="text-primary">{totals.pkt2}</span>
        </div>
        <div>
          PKT3: <span className="text-primary">{totals.pkt3}</span>
        </div>
        <div>
          Total: <span className="text-primary font-bold">{totals.total}</span>
        </div>
      </div>
    </div>
  );
}
