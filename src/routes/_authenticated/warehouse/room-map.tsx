import { createFileRoute } from "@tanstack/react-router";
import { RoomMapStandalonePage } from "@/features/warehouse";

export const Route = createFileRoute("/_authenticated/warehouse/room-map")({
  component: RoomMapStandalonePage,
});
