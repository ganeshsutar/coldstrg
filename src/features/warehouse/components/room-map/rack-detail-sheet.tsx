import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { RACK_STATUS_COLORS } from "@/config/constants";
import type { RackOccupancy, Chamber } from "../../types";

interface RackDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rack: RackOccupancy | null;
  chamber: Chamber | undefined;
  onLoadGoods?: () => void;
  onUnloadGoods?: () => void;
  onShiftGoods?: () => void;
}

export function RackDetailSheet({
  open,
  onOpenChange,
  rack,
  chamber,
  onLoadGoods,
  onUnloadGoods,
  onShiftGoods,
}: RackDetailSheetProps) {
  if (!rack || !chamber) return null;

  const canLoad = rack.status === "EMPTY" || rack.status === "PARTIAL";
  const canUnload = rack.totalQuantity > 0;
  const canShift = rack.totalQuantity > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>Rack {rack.rackNumber}</SheetTitle>
          <SheetDescription>
            {chamber.name} - Floor {rack.floorNumber}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              variant="secondary"
              className={RACK_STATUS_COLORS[rack.status]}
            >
              {rack.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Stock Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Quantity</span>
                <div className="font-medium">{rack.totalQuantity} bags</div>
              </div>
              <div>
                <span className="text-muted-foreground">Capacity</span>
                <div className="font-medium">{chamber.rackCapacity || 100} bags</div>
              </div>
            </div>
            {rack.amadNo && (
              <div className="text-sm">
                <span className="text-muted-foreground">Amad #</span>
                <div className="font-medium">{rack.amadNo}</div>
              </div>
            )}
            {rack.partyName && (
              <div className="text-sm">
                <span className="text-muted-foreground">Party</span>
                <div className="font-medium">{rack.partyName}</div>
              </div>
            )}
            {rack.commodityName && (
              <div className="text-sm">
                <span className="text-muted-foreground">Commodity</span>
                <div className="font-medium">{rack.commodityName}</div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Actions</h4>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start"
                disabled={!canLoad}
                onClick={onLoadGoods}
              >
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Load Goods
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                disabled={!canUnload}
                onClick={onUnloadGoods}
              >
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Unload Goods
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                disabled={!canShift}
                onClick={onShiftGoods}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Shift to Another Rack
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
