import { createFileRoute } from "@tanstack/react-router";
import { BardanaTypeList } from "@/features/bardana";

export const Route = createFileRoute("/_authenticated/bardana/types")({
  component: BardanaTypeList,
});
