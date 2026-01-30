import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Employee, PayLoanFormInput } from "../../types";
import { calculateFlatEmi, formatCurrency } from "../../utils";

const loanSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  employeeName: z.string().optional(),
  loanDate: z.string().min(1, "Loan date is required"),
  loanAmount: z.coerce.number().min(1, "Loan amount is required"),
  interestRate: z.coerce.number().min(0),
  tenure: z.coerce.number().min(1, "Tenure is required"),
  startDate: z.string().min(1, "Start date is required"),
  purpose: z.string().optional(),
  narration: z.string().optional(),
});

type LoanFormData = z.infer<typeof loanSchema>;

interface LoanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSubmit: (data: PayLoanFormInput) => void;
  isSubmitting?: boolean;
}

export function LoanFormDialog({
  open,
  onOpenChange,
  employees,
  onSubmit,
  isSubmitting,
}: LoanFormDialogProps) {
  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      loanDate: new Date().toISOString().split("T")[0],
      loanAmount: 0,
      interestRate: 0,
      tenure: 12,
      startDate: new Date().toISOString().split("T")[0],
      purpose: "",
      narration: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form's watch is intentionally used for reactive values
  const watchedValues = form.watch(["loanAmount", "interestRate", "tenure"]);

  const emiAmount = useMemo(() => {
    const [amount, rate, tenure] = watchedValues;
    if (!amount || !tenure) return 0;
    return calculateFlatEmi(amount, rate || 0, tenure);
  }, [watchedValues]);

  const totalPayable = useMemo(() => {
    const [amount, rate, tenure] = watchedValues;
    if (!amount || !tenure) return 0;
    const emi = calculateFlatEmi(amount, rate || 0, tenure);
    return emi * tenure;
  }, [watchedValues]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      form.setValue("employeeId", employeeId);
      form.setValue(
        "employeeName",
        `${employee.firstName} ${employee.lastName || ""}`.trim()
      );
    }
  };

  const handleSubmit = (data: LoanFormData) => {
    onSubmit(data as PayLoanFormInput);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Staff Loan</DialogTitle>
          <DialogDescription>
            Create a new loan for an employee
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={handleEmployeeChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} ({employee.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="loanDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMI Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (% p.a.)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenure (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* EMI Calculator Display */}
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Monthly EMI</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(emiAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Payable</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(totalPayable)}
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Medical, Education" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="narration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narration</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Loan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
