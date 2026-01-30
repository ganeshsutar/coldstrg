import { createFileRoute } from "@tanstack/react-router";
import { RentBillListPage } from "@/features/billing";

export const Route = createFileRoute("/_authenticated/billing/rent-bills")({
  component: RentBillListPage,
});
