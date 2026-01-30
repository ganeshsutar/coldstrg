import { createFileRoute } from "@tanstack/react-router";
import { BillGenerationWizard } from "@/features/billing";

export const Route = createFileRoute("/_authenticated/billing/new-bill")({
  component: BillGenerationWizard,
});
