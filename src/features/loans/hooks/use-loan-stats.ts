import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateInterestChart,
  postInterest,
  getInterestSummary,
  getAccumulatedInterest,
} from "../api/interest-calc";
import { getAdvanceStats } from "../api/advances";
import { getLoanStats } from "../api/loan-amounts";
import { getLedgerSummary } from "../api/loan-ledger";
import type { LoanStats, InterestChartEntry } from "../types";

export function useLoanStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["loan-combined-stats", organizationId],
    queryFn: async (): Promise<LoanStats> => {
      const [advanceStats, loanStats] = await Promise.all([
        getAdvanceStats(organizationId!),
        getLoanStats(organizationId!),
      ]);

      return {
        totalAdvances: advanceStats.pendingAmount,
        advanceCount: advanceStats.pendingCount,
        activeLoans: loanStats.totalOutstanding,
        loanCount: loanStats.activeCount,
        interestAccrued: 0, // Would need interest calculation
        overdueAmount: loanStats.overdueAmount,
        overdueCount: loanStats.overdueCount,
      };
    },
    enabled: !!organizationId,
  });
}

export function usePartyLoanSummary(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["party-loan-summary", organizationId, partyId],
    queryFn: () => getLedgerSummary(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useInterestChart(
  organizationId: string | undefined,
  fromDate: string | undefined,
  toDate: string | undefined,
  ratePerMonth: number
) {
  return useQuery({
    queryKey: ["interest-chart", organizationId, fromDate, toDate, ratePerMonth],
    queryFn: () =>
      generateInterestChart(organizationId!, fromDate!, toDate!, ratePerMonth),
    enabled: !!organizationId && !!fromDate && !!toDate && ratePerMonth > 0,
  });
}

export function useInterestSummary(
  organizationId: string | undefined,
  fromDate: string | undefined,
  toDate: string | undefined,
  ratePerMonth: number
) {
  return useQuery({
    queryKey: ["interest-summary", organizationId, fromDate, toDate, ratePerMonth],
    queryFn: () =>
      getInterestSummary(organizationId!, fromDate!, toDate!, ratePerMonth),
    enabled: !!organizationId && !!fromDate && !!toDate && ratePerMonth > 0,
  });
}

export function useAccumulatedInterest(
  organizationId: string | undefined,
  partyId: string | undefined,
  partyName: string | undefined,
  ratePerMonth: number
) {
  return useQuery({
    queryKey: ["accumulated-interest", organizationId, partyId, ratePerMonth],
    queryFn: () =>
      getAccumulatedInterest(organizationId!, partyId!, partyName!, ratePerMonth),
    enabled: !!organizationId && !!partyId && !!partyName && ratePerMonth > 0,
  });
}

export function usePostInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      entries,
      postDate,
    }: {
      organizationId: string;
      entries: InterestChartEntry[];
      postDate: string;
    }) => postInterest(organizationId, entries, postDate),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["interest-chart"],
      });
      queryClient.invalidateQueries({
        queryKey: ["interest-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-combined-stats", variables.organizationId],
      });
    },
  });
}
