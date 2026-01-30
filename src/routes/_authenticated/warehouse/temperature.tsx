import { createFileRoute } from "@tanstack/react-router";
import { TemperaturePage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/temperature")({
  component: TemperaturePage,
});
