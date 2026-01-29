import { createFileRoute } from "@tanstack/react-router";
import { ReceiptListPage } from "@/features/bardana";

export const Route = createFileRoute("/_authenticated/bardana/receipts")({
  component: ReceiptListPage,
});
