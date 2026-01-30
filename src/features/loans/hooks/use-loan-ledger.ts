import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLoanLedger,
  fetchLoanLedgerByDateRange,
  getPartyLoanBalance,
  getLedgerSummary,
  recordDisbursement,
  recordRepaymentLedger,
  recordInterestLedger,
} from "../api/loan-ledger";

export function useLoanLedger(
  organizationId: string | undefined,
  partyId?: string
) {
  return useQuery({
    queryKey: ["loan-ledger", organizationId, partyId],
    queryFn: () => fetchLoanLedger(organizationId!, partyId),
    enabled: !!organizationId,
  });
}

export function useLoanLedgerByDateRange(
  organizationId: string | undefined,
  partyId: string | undefined,
  fromDate: string | undefined,
  toDate: string | undefined
) {
  return useQuery({
    queryKey: ["loan-ledger-range", organizationId, partyId, fromDate, toDate],
    queryFn: () =>
      fetchLoanLedgerByDateRange(organizationId!, partyId!, fromDate!, toDate!),
    enabled: !!organizationId && !!partyId && !!fromDate && !!toDate,
  });
}

export function usePartyLoanBalance(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["party-loan-balance", organizationId, partyId],
    queryFn: () => getPartyLoanBalance(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useLedgerSummary(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["loan-ledger-summary", organizationId, partyId],
    queryFn: () => getLedgerSummary(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useRecordDisbursement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      partyId,
      date,
      amount,
      currentBalance,
      options,
    }: {
      organizationId: string;
      partyId: string;
      date: string;
      amount: number;
      currentBalance: number;
      options?: {
        interestRate?: number;
        amadId?: string;
        advanceId?: string;
        loanAmountId?: string;
        narration?: string;
      };
    }) =>
      recordDisbursement(
        organizationId,
        partyId,
        date,
        amount,
        currentBalance,
        options
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["party-loan-balance", variables.organizationId, variables.partyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger-summary", variables.organizationId, variables.partyId],
      });
    },
  });
}

export function useRecordRepaymentLedger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      partyId,
      date,
      amount,
      currentBalance,
      options,
    }: {
      organizationId: string;
      partyId: string;
      date: string;
      amount: number;
      currentBalance: number;
      options?: {
        loanAmountId?: string;
        narration?: string;
      };
    }) =>
      recordRepaymentLedger(
        organizationId,
        partyId,
        date,
        amount,
        currentBalance,
        options
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["party-loan-balance", variables.organizationId, variables.partyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger-summary", variables.organizationId, variables.partyId],
      });
    },
  });
}

export function useRecordInterestLedger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      partyId,
      date,
      interestAmount,
      currentBalance,
      interestRate,
      options,
    }: {
      organizationId: string;
      partyId: string;
      date: string;
      interestAmount: number;
      currentBalance: number;
      interestRate: number;
      options?: {
        narration?: string;
      };
    }) =>
      recordInterestLedger(
        organizationId,
        partyId,
        date,
        interestAmount,
        currentBalance,
        interestRate,
        options
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["party-loan-balance", variables.organizationId, variables.partyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger-summary", variables.organizationId, variables.partyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["interest-chart"],
      });
    },
  });
}
