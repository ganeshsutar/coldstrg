import { createFileRoute } from "@tanstack/react-router";
import { StockSummaryPage } from "@/features/bardana";

export const Route = createFileRoute("/_authenticated/bardana/")({
  component: StockSummaryPage,
});
