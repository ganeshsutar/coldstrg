import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLoanList,
  fetchLoanById,
  fetchLoansByParty,
  fetchLoansByAmad,
  fetchActiveLoans,
  fetchOverdueLoans,
  createLoanFromForm,
  updateLoan,
  deleteLoan,
  recordRepayment,
  markLoanOverdue,
  closeLoan,
  getNextLoanNumber,
  getLoanStats,
  getTotalLoanOnAmad,
} from "../api/loan-amounts";
import type { LoanAgainstGoodsFormInput, UpdateLoanAmountInput } from "../types";

export function useLoanList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["loans", organizationId],
    queryFn: () => fetchLoanList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useLoan(loanId: string | undefined) {
  return useQuery({
    queryKey: ["loan-detail", loanId],
    queryFn: () => fetchLoanById(loanId!),
    enabled: !!loanId,
  });
}

export function useLoansByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["loans-party", organizationId, partyId],
    queryFn: () => fetchLoansByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useLoansByAmad(
  organizationId: string | undefined,
  amadId: string | undefined
) {
  return useQuery({
    queryKey: ["loans-amad", organizationId, amadId],
    queryFn: () => fetchLoansByAmad(organizationId!, amadId!),
    enabled: !!organizationId && !!amadId,
  });
}

export function useActiveLoans(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["loans-active", organizationId],
    queryFn: () => fetchActiveLoans(organizationId!),
    enabled: !!organizationId,
  });
}

export function useOverdueLoans(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["loans-overdue", organizationId],
    queryFn: () => fetchOverdueLoans(organizationId!),
    enabled: !!organizationId,
  });
}

export function useNextLoanNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-loan-no", organizationId],
    queryFn: () => getNextLoanNumber(organizationId!),
    enabled: !!organizationId,
  });
}

export function useLoanStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["loan-stats", organizationId],
    queryFn: () => getLoanStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useTotalLoanOnAmad(
  organizationId: string | undefined,
  amadId: string | undefined
) {
  return useQuery({
    queryKey: ["loan-on-amad", organizationId, amadId],
    queryFn: () => getTotalLoanOnAmad(organizationId!, amadId!),
    enabled: !!organizationId && !!amadId,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: LoanAgainstGoodsFormInput;
    }) => createLoanFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loans", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-loan-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-on-amad", variables.organizationId, variables.formInput.amadId],
      });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateLoanAmountInput) => updateLoan(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loans", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["loan-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", variables.organizationId],
      });
    },
  });
}

export function useDeleteLoan(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loans", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-loan-no", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", organizationId],
      });
    },
  });
}

export function useRecordRepayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      loanId,
      amount,
    }: {
      organizationId: string;
      loanId: string;
      amount: number;
    }) => recordRepayment(loanId, amount),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loans", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-detail", variables.loanId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-ledger"],
      });
    },
  });
}

export function useMarkLoanOverdue(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => markLoanOverdue(loanId),
    onSuccess: (_data, loanId) => {
      queryClient.invalidateQueries({
        queryKey: ["loans", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-detail", loanId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", organizationId],
      });
    },
  });
}

export function useCloseLoan(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => closeLoan(loanId),
    onSuccess: (_data, loanId) => {
      queryClient.invalidateQueries({
        queryKey: ["loans", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-detail", loanId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", organizationId],
      });
    },
  });
}
