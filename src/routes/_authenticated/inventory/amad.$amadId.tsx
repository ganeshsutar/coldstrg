import { createFileRoute } from "@tanstack/react-router";
import { AmadDetailPage } from "@/features/inventory";

export const Route = createFileRoute("/_authenticated/inventory/amad/$amadId")({
  component: AmadDetailPage,
});
