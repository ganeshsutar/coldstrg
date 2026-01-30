import { createFileRoute } from "@tanstack/react-router";
import { StaffLoansPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/loans")({
  component: StaffLoansPage,
});
