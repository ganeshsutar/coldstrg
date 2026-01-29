import { createFileRoute } from "@tanstack/react-router";
import { PartyLedgerPage } from "@/features/accounting";

export const Route = createFileRoute("/_authenticated/accounts/party-ledger")({
  component: PartyLedgerPage,
});
