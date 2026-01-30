import { createFileRoute } from "@tanstack/react-router";
import { GatePassListPage } from "@/features/trading";

export const Route = createFileRoute("/_authenticated/trading/gate-pass")({
  component: GatePassListPage,
});
