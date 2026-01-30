import { createFileRoute } from "@tanstack/react-router";
import { PayslipPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/payslip")({
  component: PayslipPage,
});
