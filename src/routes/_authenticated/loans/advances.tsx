import { createFileRoute } from "@tanstack/react-router";
import { AdvanceListPage } from "@/features/loans";

export const Route = createFileRoute("/_authenticated/loans/advances")({
  component: AdvanceListPage,
});
