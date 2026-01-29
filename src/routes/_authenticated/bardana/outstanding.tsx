import { createFileRoute } from "@tanstack/react-router";
import { PartyOutstandingPage } from "@/features/bardana";

export const Route = createFileRoute("/_authenticated/bardana/outstanding")({
  component: PartyOutstandingPage,
});
