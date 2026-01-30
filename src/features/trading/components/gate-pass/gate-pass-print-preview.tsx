import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { GatePass, GatePassDetail } from "../../types";
import { formatGpNo, formatSaudaNo, formatNumber } from "../../utils";

interface GatePassPrintPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gatePass: GatePass | null;
  details: GatePassDetail[];
  organizationName?: string;
  organizationAddress?: string;
}

export function GatePassPrintPreview({
  open,
  onOpenChange,
  gatePass,
  details,
  organizationName = "Cold Storage",
  organizationAddress = "",
}: GatePassPrintPreviewProps) {
  if (!gatePass) return null;

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gate Pass Print Preview</DialogTitle>
        </DialogHeader>

        {/* Print Content */}
        <div className="border rounded-lg p-6 bg-white print:border-none print:p-0">
          {/* Header */}
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold">{organizationName}</h1>
            {organizationAddress && (
              <p className="text-sm text-muted-foreground">{organizationAddress}</p>
            )}
            <h2 className="text-lg font-semibold mt-2">GATE PASS</h2>
          </div>

          {/* GP Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Gate Pass No.</div>
              <div className="font-semibold">{formatGpNo(gatePass.gpNo)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Date & Time</div>
              <div className="font-semibold">
                {format(new Date(gatePass.gpDate), "dd/MM/yyyy")}
                {gatePass.gpTime && ` ${gatePass.gpTime}`}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-4 border rounded p-3">
            <div>
              <div className="text-sm text-muted-foreground">From (Seller)</div>
              <div className="font-semibold">{gatePass.sellerPartyName}</div>
              {gatePass.sellerVillage && (
                <div className="text-sm">{gatePass.sellerVillage}</div>
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">To (Buyer)</div>
              <div className="font-semibold">{gatePass.buyerPartyName || "-"}</div>
              {gatePass.buyerLocation && (
                <div className="text-sm">{gatePass.buyerLocation}</div>
              )}
            </div>
          </div>

          {/* Deal Reference */}
          {gatePass.saudaNo && (
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Deal Ref: </span>
              <span className="font-medium">{formatSaudaNo(gatePass.saudaNo)}</span>
            </div>
          )}

          {/* Goods Details */}
          <div className="mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Amad #</th>
                  <th className="text-left py-2">Commodity</th>
                  <th className="text-right py-2">PKT1</th>
                  <th className="text-right py-2">PKT2</th>
                  <th className="text-right py-2">PKT3</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail) => (
                  <tr key={detail.id} className="border-b">
                    <td className="py-2">{detail.amadNo}</td>
                    <td className="py-2">
                      {detail.commodityName}
                      {detail.variety && ` (${detail.variety})`}
                    </td>
                    <td className="text-right py-2">{detail.pkt1}</td>
                    <td className="text-right py-2">{detail.pkt2}</td>
                    <td className="text-right py-2">{detail.pkt3}</td>
                    <td className="text-right py-2 font-medium">
                      {detail.totalPackets}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan={2} className="py-2">Total</td>
                  <td className="text-right py-2">{gatePass.totalPkt1}</td>
                  <td className="text-right py-2">{gatePass.totalPkt2}</td>
                  <td className="text-right py-2">{gatePass.totalPkt3}</td>
                  <td className="text-right py-2">{formatNumber(gatePass.totalPackets)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Transport Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 border rounded p-3">
            <div>
              <div className="text-sm text-muted-foreground">Vehicle No.</div>
              <div className="font-semibold">{gatePass.vehicleNo || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Driver</div>
              <div className="font-semibold">{gatePass.driverName || "-"}</div>
              {gatePass.driverContact && (
                <div className="text-sm">{gatePass.driverContact}</div>
              )}
            </div>
            {gatePass.transport && (
              <div>
                <div className="text-sm text-muted-foreground">Transport</div>
                <div>{gatePass.transport}</div>
              </div>
            )}
            {gatePass.biltiNo && (
              <div>
                <div className="text-sm text-muted-foreground">Bilti/LR No.</div>
                <div>{gatePass.biltiNo}</div>
              </div>
            )}
          </div>

          {/* Remarks */}
          {gatePass.remarks && (
            <div className="mb-4">
              <div className="text-sm text-muted-foreground">Remarks</div>
              <div>{gatePass.remarks}</div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t">
            <div className="text-center">
              <div className="border-t border-dashed mt-8 pt-2">
                Godown Keeper
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-dashed mt-8 pt-2">
                Gate Keeper
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-dashed mt-8 pt-2">
                Receiver/Driver
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
