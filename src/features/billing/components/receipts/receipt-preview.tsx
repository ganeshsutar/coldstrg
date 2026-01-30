import { ArrowLeft, Printer } from "lucide-react";
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
import type { Receipt, ReceiptAllocation } from "../../types";
import { formatIndianRupees } from "../../utils";

interface ReceiptPreviewProps {
  receipt: Receipt;
  allocations: ReceiptAllocation[];
  onBack?: () => void;
}

export function ReceiptPreview({
  receipt,
  allocations,
  onBack,
}: ReceiptPreviewProps) {
  const { currentOrganization } = useOrganization();

  function handlePrint() {
    window.print();
  }

  const paymentModeLabel = {
    CASH: "Cash",
    CHEQUE: "Cheque",
    BANK: "Bank Transfer",
    UPI: "UPI",
  }[receipt.paymentMode || "CASH"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Receipt #{receipt.receiptNo}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(receipt.receiptDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge
            variant={
              receipt.status === "CONFIRMED"
                ? "default"
                : receipt.status === "CANCELLED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {receipt.status}
          </Badge>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1" />
          Print
        </Button>
      </div>

      {/* Print-ready Receipt */}
      <Card className="print:shadow-none print:border-none">
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
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">RECEIPT VOUCHER</h3>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold mb-2">Received From:</h4>
              <p className="font-medium">{receipt.partyName}</p>
            </div>
            <div className="text-right">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-end gap-2">
                  <dt className="text-muted-foreground">Receipt No:</dt>
                  <dd className="font-medium">{receipt.receiptNo}</dd>
                </div>
                <div className="flex justify-end gap-2">
                  <dt className="text-muted-foreground">Date:</dt>
                  <dd>
                    {new Date(receipt.receiptDate).toLocaleDateString("en-IN")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Payment Details */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <dt className="text-muted-foreground">Payment Mode:</dt>
                    <dd className="font-medium">{paymentModeLabel}</dd>
                  </div>
                  {receipt.paymentMode === "CHEQUE" && receipt.chequeNo && (
                    <>
                      <div className="flex gap-4">
                        <dt className="text-muted-foreground">Cheque No:</dt>
                        <dd>{receipt.chequeNo}</dd>
                      </div>
                      {receipt.chequeDate && (
                        <div className="flex gap-4">
                          <dt className="text-muted-foreground">Cheque Date:</dt>
                          <dd>
                            {new Date(receipt.chequeDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </dd>
                        </div>
                      )}
                      {receipt.bankName && (
                        <div className="flex gap-4">
                          <dt className="text-muted-foreground">Bank:</dt>
                          <dd>
                            {receipt.bankName}
                            {receipt.branchName && `, ${receipt.branchName}`}
                          </dd>
                        </div>
                      )}
                    </>
                  )}
                  {receipt.paymentMode === "UPI" && receipt.upiRef && (
                    <div className="flex gap-4">
                      <dt className="text-muted-foreground">UPI Ref:</dt>
                      <dd>{receipt.upiRef}</dd>
                    </div>
                  )}
                  {receipt.paymentMode === "BANK" && receipt.bankRef && (
                    <div className="flex gap-4">
                      <dt className="text-muted-foreground">Bank Ref:</dt>
                      <dd>{receipt.bankRef}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {formatIndianRupees(receipt.amount)}
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-3 bg-muted rounded-md mb-6">
            <p className="text-sm">
              <strong>Amount in Words:</strong> {receipt.amountInWords}
            </p>
          </div>

          {/* Bill Allocations */}
          {allocations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Bill Adjustment</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill No</TableHead>
                    <TableHead className="text-right">Allocated Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell>{allocation.billNo}</TableCell>
                      <TableCell className="text-right">
                        {formatIndianRupees(allocation.allocatedAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Narration */}
          {receipt.narration && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Narration</h4>
              <p className="text-sm">{receipt.narration}</p>
            </div>
          )}

          <Separator className="my-4" />

          {/* Footer */}
          <div className="mt-8 pt-4 flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Received with thanks.</p>
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
