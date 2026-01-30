import { createFileRoute } from "@tanstack/react-router";
import { BillPreview } from "@/features/billing";

export const Route = createFileRoute("/_authenticated/billing/$billId")({
  component: BillPreview,
});
