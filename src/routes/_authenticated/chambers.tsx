import { createFileRoute } from "@tanstack/react-router";
import { WarehousePage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/chambers")({
  component: WarehousePage,
});
