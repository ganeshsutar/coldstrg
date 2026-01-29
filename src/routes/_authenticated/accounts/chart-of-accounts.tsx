import { createFileRoute } from "@tanstack/react-router";
import { ChartOfAccountsPage } from "@/features/accounting";

export const Route = createFileRoute("/_authenticated/accounts/chart-of-accounts")({
  component: ChartOfAccountsPage,
});
