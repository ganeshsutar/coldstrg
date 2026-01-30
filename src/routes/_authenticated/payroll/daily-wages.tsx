import { createFileRoute } from "@tanstack/react-router";
import { DailyWagesPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/daily-wages")({
  component: DailyWagesPage,
});
