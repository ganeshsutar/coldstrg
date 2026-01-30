import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/billing/")({
  component: BillingIndex,
});

function BillingIndex() {
  // Redirect to rent-bills by default
  return <Navigate to="/billing/rent-bills" replace />;
}
