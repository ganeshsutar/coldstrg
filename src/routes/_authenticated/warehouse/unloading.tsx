import { createFileRoute } from "@tanstack/react-router";
import { UnloadingPage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/unloading")({
  component: UnloadingPage,
});
