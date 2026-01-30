import { useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganization } from "@/features/organizations";
import {
  useRentBillDetail,
  useRentBillItems,
  usePriceBreakups,
  useConfirmRentBill,
  useCancelRentBill,
} from "../../hooks";
import { formatIndianRupees } from "../../utils";

export function BillPreview() {
  const { billId } = useParams({ from: "/_authenticated/billing/$billId" });
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const { currentOrganization } = useOrganization();
  const { data: bill, isLoading } = useRentBillDetail(billId);
  const { data: items = [] } = useRentBillItems(billId);
  const { data: breakups = [] } = usePriceBreakups(billId);
  const confirmMutation = useConfirmRentBill();
  const cancelMutation = useCancelRentBill();

  function handlePrint() {
    window.print();
  }

  function handleConfirm() {
    if (!bill) return;
    if (confirm(`Confirm bill ${bill.billNo}?`)) {
      confirmMutation.mutate({
        id: bill.id,
        confirmedBy: "current-user",
      });
    }
  }

  function handleCancel() {
    if (!bill) return;
    const reason = prompt(`Cancel bill ${bill.billNo}? Enter reason:`);
    if (reason !== null) {
      cancelMutation.mutate({
        id: bill.id,
        cancelledBy: "current-user",
        cancelReason: reason,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading bill...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-muted-foreground">Bill not found</div>
        <Button variant="outline" onClick={() => navigate({ to: "/billing/rent-bills" })}>
          Back to Bills
        </Button>
      </div>
    );
  }

  const isDraft = bill.status === "DRAFT";
  const isCancelled = bill.status === "CANCELLED";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/billing/rent-bills" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Bill #{bill.billNo}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(bill.billDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge
            variant={
              bill.status === "PAID"
                ? "default"
                : bill.status === "CANCELLED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {bill.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          {isDraft && (
            <>
              <Button variant="outline" onClick={handleConfirm}>
                <Check className="h-4 w-4 mr-1" />
                Confirm
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
          {!isCancelled && (
            <>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Print-ready Invoice */}
      <Card ref={printRef} className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Company Header */}
          <div className="text-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold">
              {currentOrganization?.name || "Cold Storage"}
            </h2>
            {currentOrganization?.address && (
              <p className="text-sm text-muted-foreground">
                {currentOrganization.address}
              </p>
            )}
            {currentOrganization?.gstNo && (
              <p className="text-sm">GSTIN: {currentOrganization.gstNo}</p>
            )}
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">TAX INVOICE</h3>
            <p className="text-sm text-muted-foreground">
              (Rent Bill / Kiraya Bill)
            </p>
          </div>

          {/* Bill & Party Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold mb-2">Bill To:</h4>
              <p className="font-medium">{bill.partyName}</p>
              {bill.partyVillage && <p>{bill.partyVillage}</p>}
              {bill.partyGstin && <p>GSTIN: {bill.partyGstin}</p>}
            </div>
            <div className="text-right">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-end gap-2">
                  <dt className="text-muted-foreground">Bill No:</dt>
                  <dd className="font-medium">{bill.billNo}</dd>
                </div>
                <div className="flex justify-end gap-2">
                  <dt className="text-muted-foreground">Date:</dt>
                  <dd>
                    {new Date(bill.billDate).toLocaleDateString("en-IN")}
                  </dd>
                </div>
                {bill.dueDate && (
                  <div className="flex justify-end gap-2">
                    <dt className="text-muted-foreground">Due Date:</dt>
                    <dd>
                      {new Date(bill.dueDate).toLocaleDateString("en-IN")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Line Items */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Particulars</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Amad No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead className="text-right">Bags</TableHead>
                  <TableHead className="text-right">Weight (Qtl)</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.amadNo}</TableCell>
                    <TableCell>
                      {item.amadDate
                        ? new Date(item.amadDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>{item.commodityName || "-"}</TableCell>
                    <TableCell className="text-right">{item.bags}</TableCell>
                    <TableCell className="text-right">
                      {item.weightQtl.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.billableDays}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.ratePerQtl.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIndianRupees(item.rentAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Charges Breakup */}
          {breakups.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Additional Charges</h4>
              <Table>
                <TableBody>
                  {breakups.map((breakup) => (
                    <TableRow key={breakup.id}>
                      <TableCell>{breakup.component}</TableCell>
                      <TableCell className="text-right">
                        {breakup.rate} x {breakup.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIndianRupees(breakup.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Separator className="my-4" />

          {/* Amount Summary */}
          <div className="flex justify-end">
            <div className="w-80">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Rent Amount</dt>
                  <dd>{formatIndianRupees(bill.rentAmount)}</dd>
                </div>
                {bill.loadingCharges > 0 && (
                  <div className="flex justify-between">
                    <dt>Loading Charges</dt>
                    <dd>{formatIndianRupees(bill.loadingCharges)}</dd>
                  </div>
                )}
                {bill.unloadingCharges > 0 && (
                  <div className="flex justify-between">
                    <dt>Unloading Charges</dt>
                    <dd>{formatIndianRupees(bill.unloadingCharges)}</dd>
                  </div>
                )}
                {bill.otherCharges > 0 && (
                  <div className="flex justify-between">
                    <dt>Other Charges</dt>
                    <dd>{formatIndianRupees(bill.otherCharges)}</dd>
                  </div>
                )}
                {bill.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Discount</dt>
                    <dd>-{formatIndianRupees(bill.discountAmount)}</dd>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <dt>Taxable Amount</dt>
                  <dd>{formatIndianRupees(bill.taxableAmount)}</dd>
                </div>
                {bill.gstType === "INTRA_STATE" ? (
                  <>
                    <div className="flex justify-between">
                      <dt>CGST @{bill.cgstRate}%</dt>
                      <dd>{formatIndianRupees(bill.cgstAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>SGST @{bill.sgstRate}%</dt>
                      <dd>{formatIndianRupees(bill.sgstAmount)}</dd>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <dt>IGST @{bill.igstRate}%</dt>
                    <dd>{formatIndianRupees(bill.igstAmount)}</dd>
                  </div>
                )}
                {bill.roundOffAmount !== 0 && (
                  <div className="flex justify-between">
                    <dt>Round Off</dt>
                    <dd>{formatIndianRupees(bill.roundOffAmount)}</dd>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <dt>Total Amount</dt>
                  <dd>{formatIndianRupees(bill.roundedAmount)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm">
              <strong>Amount in Words:</strong> {bill.amountInWords}
            </p>
          </div>

          {/* Bank Details */}
          {currentOrganization?.bankName && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-2">Bank Details</h4>
              <dl className="text-sm space-y-1">
                <div className="flex gap-4">
                  <dt className="text-muted-foreground">Bank:</dt>
                  <dd>{currentOrganization.bankName}</dd>
                </div>
                {currentOrganization.bankAccountNo && (
                  <div className="flex gap-4">
                    <dt className="text-muted-foreground">A/C No:</dt>
                    <dd>{currentOrganization.bankAccountNo}</dd>
                  </div>
                )}
                {currentOrganization.bankIfsc && (
                  <div className="flex gap-4">
                    <dt className="text-muted-foreground">IFSC:</dt>
                    <dd>{currentOrganization.bankIfsc}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Terms & Conditions:</p>
              <p>Payment due within 30 days of invoice date.</p>
            </div>
            <div className="text-right">
              <p className="mb-8">For {currentOrganization?.name}</p>
              <p className="border-t pt-2">Authorized Signatory</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
