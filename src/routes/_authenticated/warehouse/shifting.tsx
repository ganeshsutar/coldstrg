import { createFileRoute } from "@tanstack/react-router";
import { ShiftingPage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/shifting")({
  component: ShiftingPage,
});
