import { createFileRoute } from "@tanstack/react-router";
import { MeterReadingPage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/meter-reading")({
  component: MeterReadingPage,
});
