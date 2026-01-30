import { useRef } from "react";
import { useSearch } from "@tanstack/react-router";
import { useOrganization } from "@/features/organizations";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { PayslipPreview } from "./payslip-preview";
import { usePaySATTN } from "../../hooks";

export function PayslipPage() {
  const { currentOrganization } = useOrganization();
  const printRef = useRef<HTMLDivElement>(null);

  // Get salary ID from URL params
  const search = useSearch({ strict: false }) as { id?: string };
  const salaryId = search.id;

  const { data: salary, isLoading } = usePaySATTN(salaryId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    // For now, just trigger print which allows saving as PDF
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!salaryId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No payslip selected</p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pay Slip</h1>
          <p className="text-sm text-muted-foreground">
            View and print employee pay slip
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : salary ? (
        <div className="border rounded-lg shadow-sm print:border-0 print:shadow-none">
          <PayslipPreview
            ref={printRef}
            salary={salary}
            companyName={currentOrganization?.name}
            companyAddress={currentOrganization?.address || undefined}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Payslip not found</p>
        </div>
      )}
    </div>
  );
}
