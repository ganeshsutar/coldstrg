import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../api/dashboard";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}
