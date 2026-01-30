import { createFileRoute } from "@tanstack/react-router";
import { ReceiptListPage } from "@/features/billing";

export const Route = createFileRoute("/_authenticated/billing/receipts")({
  component: ReceiptListPage,
});
