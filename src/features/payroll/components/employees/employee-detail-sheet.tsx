import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";
import type { Employee } from "../../types";
import { formatCurrency, formatDate } from "../../utils";

interface EmployeeDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onEdit: () => void;
}

export function EmployeeDetailSheet({
  open,
  onOpenChange,
  employee,
  onEdit,
}: EmployeeDetailSheetProps) {
  if (!employee) return null;

  const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
    ACTIVE: "default",
    ON_LEAVE: "secondary",
    RESIGNED: "destructive",
    TERMINATED: "destructive",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>
                {employee.firstName} {employee.lastName}
              </SheetTitle>
              <SheetDescription>
                {employee.code} | {employee.postName || "No designation"}
              </SheetDescription>
            </div>
            <Badge variant={statusVariants[employee.status]}>
              {employee.status?.replace("_", " ")}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="bank">Bank & PF</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Name (Hindi)" value={employee.nameHindi} />
                <DetailItem label="Father's Name" value={employee.fatherName} />
                <DetailItem
                  label="Date of Birth"
                  value={employee.dateOfBirth && formatDate(employee.dateOfBirth)}
                />
                <DetailItem
                  label="Gender"
                  value={
                    employee.gender === "M"
                      ? "Male"
                      : employee.gender === "F"
                      ? "Female"
                      : employee.gender
                  }
                />
                <DetailItem label="Phone" value={employee.phone} />
                <DetailItem label="Email" value={employee.email} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Address
              </h4>
              <DetailItem label="Address" value={employee.address} />
              <div className="grid grid-cols-3 gap-4">
                <DetailItem label="City" value={employee.city} />
                <DetailItem label="State" value={employee.state} />
                <DetailItem label="Pincode" value={employee.pincode} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Identity
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Aadhar No" value={employee.aadharNo} />
                <DetailItem label="PAN No" value={employee.panNo} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Employment
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Designation" value={employee.postName} />
                <DetailItem
                  label="Joining Date"
                  value={formatDate(employee.joiningDate)}
                />
                <DetailItem
                  label="Confirmation Date"
                  value={
                    employee.confirmationDate &&
                    formatDate(employee.confirmationDate)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="salary" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Salary Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Basic Salary"
                  value={formatCurrency(employee.basicSalary)}
                />
                <DetailItem
                  label="Gross Salary"
                  value={formatCurrency(employee.grossSalary)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Statutory Deductions
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="PF Applicable"
                  value={employee.pfApplicable ? "Yes" : "No"}
                />
                <DetailItem
                  label="ESI Applicable"
                  value={employee.esiApplicable ? "Yes" : "No"}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Leave Balance
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <DetailItem
                  label="Casual Leave"
                  value={String(employee.casualLeaveBalance)}
                />
                <DetailItem
                  label="Sick Leave"
                  value={String(employee.sickLeaveBalance)}
                />
                <DetailItem
                  label="Earned Leave"
                  value={String(employee.earnedLeaveBalance)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Bank Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Bank Name" value={employee.bankName} />
                <DetailItem label="Account No" value={employee.bankAccountNo} />
                <DetailItem label="IFSC Code" value={employee.bankIfsc} />
                <DetailItem label="Branch" value={employee.bankBranch} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                PF & ESI Details
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <DetailItem label="PF Number" value={employee.pfNo} />
                <DetailItem label="ESI Number" value={employee.esiNo} />
                <DetailItem label="UAN Number" value={employee.uanNo} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}
