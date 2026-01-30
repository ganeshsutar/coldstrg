import { createFileRoute } from "@tanstack/react-router";
import { ChambersPage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/chambers")({
  component: ChambersPage,
});
