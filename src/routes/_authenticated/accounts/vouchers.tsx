import { createFileRoute } from "@tanstack/react-router";
import { VouchersPage } from "@/features/accounting";

export const Route = createFileRoute("/_authenticated/accounts/vouchers")({
  component: VouchersPage,
});
