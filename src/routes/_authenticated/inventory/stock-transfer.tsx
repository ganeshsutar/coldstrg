import { createFileRoute } from "@tanstack/react-router";
import { StockTransferPage } from "@/features/inventory";

export const Route = createFileRoute(
  "/_authenticated/inventory/stock-transfer"
)({
  component: StockTransferPage,
});
