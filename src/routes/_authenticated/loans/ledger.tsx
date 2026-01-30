import { createFileRoute } from "@tanstack/react-router";
import { LoanLedgerPage } from "@/features/loans";

export const Route = createFileRoute("/_authenticated/loans/ledger")({
  component: LoanLedgerPage,
});
