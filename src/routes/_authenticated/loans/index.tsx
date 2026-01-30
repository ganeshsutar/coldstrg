import { createFileRoute } from "@tanstack/react-router";
import { LoanDashboardPage } from "@/features/loans";

export const Route = createFileRoute("/_authenticated/loans/")({
  component: LoanDashboardPage,
});
