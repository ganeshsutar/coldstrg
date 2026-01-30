import { createFileRoute } from "@tanstack/react-router";
import { KataiEntryPage } from "@/features/trading";

export const Route = createFileRoute("/_authenticated/trading/katai")({
  component: KataiEntryPage,
});
