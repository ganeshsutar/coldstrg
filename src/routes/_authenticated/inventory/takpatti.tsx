import { createFileRoute } from "@tanstack/react-router";
import { TakpattiPage } from "@/features/inventory";

export const Route = createFileRoute("/_authenticated/inventory/takpatti")({
  component: TakpattiPage,
});
