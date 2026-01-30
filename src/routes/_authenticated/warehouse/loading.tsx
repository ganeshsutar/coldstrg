import { createFileRoute } from "@tanstack/react-router";
import { LoadingPage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/loading")({
  component: LoadingPage,
});
