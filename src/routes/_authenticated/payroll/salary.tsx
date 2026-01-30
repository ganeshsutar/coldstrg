import { createFileRoute } from "@tanstack/react-router";
import { SalaryProcessingPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/salary")({
  component: SalaryProcessingPage,
});
