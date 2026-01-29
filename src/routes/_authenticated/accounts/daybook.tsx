import { createFileRoute } from "@tanstack/react-router";
import { DaybookPage } from "@/features/accounting";

export const Route = createFileRoute("/_authenticated/accounts/daybook")({
  component: DaybookPage,
});
