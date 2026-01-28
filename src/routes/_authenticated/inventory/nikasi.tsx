import { createFileRoute } from "@tanstack/react-router";
import { RentListPage } from "@/features/inventory";

export const Route = createFileRoute("/_authenticated/inventory/nikasi")({
  component: RentListPage,
});
