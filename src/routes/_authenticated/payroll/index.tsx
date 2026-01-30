import { createFileRoute } from "@tanstack/react-router";
import { PayrollDashboardPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/")({
  component: PayrollDashboardPage,
});
