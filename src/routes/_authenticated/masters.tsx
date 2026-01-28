import { createFileRoute } from "@tanstack/react-router";
import { MastersPage } from "@/features/masters";

export const Route = createFileRoute("/_authenticated/masters")({
  component: MastersPage,
});
