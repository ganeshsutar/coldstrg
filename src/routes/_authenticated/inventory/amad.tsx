import { createFileRoute } from "@tanstack/react-router";
import { AmadListPage } from "@/features/inventory";

export const Route = createFileRoute("/_authenticated/inventory/amad")({
  component: AmadListPage,
});
