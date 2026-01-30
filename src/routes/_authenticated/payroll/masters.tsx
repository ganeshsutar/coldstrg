import { createFileRoute } from "@tanstack/react-router";
import { PayrollMastersPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/masters")({
  component: PayrollMastersPage,
});
