import { useQuery } from "@tanstack/react-query";
import { fetchBillingStats, fetchBillingTrend } from "../api/rent-bills";

export function useBillingStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["billing-stats", organizationId],
    queryFn: () => fetchBillingStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBillingTrend(
  organizationId: string | undefined,
  months: number = 6
) {
  return useQuery({
    queryKey: ["billing-trend", organizationId, months],
    queryFn: () => fetchBillingTrend(organizationId!, months),
    enabled: !!organizationId,
  });
}
