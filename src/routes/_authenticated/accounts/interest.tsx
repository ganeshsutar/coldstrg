import { createFileRoute } from "@tanstack/react-router";
import { InterestPage } from "@/features/accounting";

export const Route = createFileRoute("/_authenticated/accounts/interest")({
  component: InterestPage,
});
