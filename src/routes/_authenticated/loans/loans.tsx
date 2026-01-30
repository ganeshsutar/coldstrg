import { createFileRoute } from "@tanstack/react-router";
import { LagListPage } from "@/features/loans";

export const Route = createFileRoute("/_authenticated/loans/loans")({
  component: LagListPage,
});
