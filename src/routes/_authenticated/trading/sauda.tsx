import { createFileRoute } from "@tanstack/react-router";
import { SaudaListPage } from "@/features/trading";

export const Route = createFileRoute("/_authenticated/trading/sauda")({
  component: SaudaListPage,
});
