import { createFileRoute } from "@tanstack/react-router";
import { InterestChartPage } from "@/features/loans";

export const Route = createFileRoute("/_authenticated/loans/interest-chart")({
  component: InterestChartPage,
});
