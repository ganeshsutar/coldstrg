import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayLoanList,
  fetchPayLoanById,
  fetchPayLoansByEmployee,
  fetchActivePayLoansByEmployee,
  createPayLoanFromForm,
  updatePayLoan,
  deletePayLoan,
  getNextPayLoanNo,
  recordEmiPayment,
  cancelPayLoan,
  getPayLoanStats,
  getEmployeeLoanSummary,
} from "../api/pay-loans";
import type { PayLoanFormInput, UpdatePayLoanInput } from "../types";

export function usePayLoanList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["pay-loans", organizationId],
    queryFn: () => fetchPayLoanList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePayLoan(loanId: string | undefined) {
  return useQuery({
    queryKey: ["pay-loan-detail", loanId],
    queryFn: () => fetchPayLoanById(loanId!),
    enabled: !!loanId,
  });
}

export function usePayLoansByEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["pay-loans-employee", employeeId],
    queryFn: () => fetchPayLoansByEmployee(employeeId!),
    enabled: !!employeeId,
  });
}

export function useActivePayLoansByEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["pay-loans-employee-active", employeeId],
    queryFn: () => fetchActivePayLoansByEmployee(employeeId!),
    enabled: !!employeeId,
  });
}

export function useNextPayLoanNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-pay-loan-no", organizationId],
    queryFn: () => getNextPayLoanNo(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePayLoanStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["pay-loan-stats", organizationId],
    queryFn: () => getPayLoanStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useEmployeeLoanSummary(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["employee-loan-summary", employeeId],
    queryFn: () => getEmployeeLoanSummary(employeeId!),
    enabled: !!employeeId,
  });
}

export function useCreatePayLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: PayLoanFormInput;
    }) => createPayLoanFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-loans", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-pay-loan-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payroll-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdatePayLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePayLoanInput) => updatePayLoan(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-loans"],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["pay-loan-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-stats"],
      });
    },
  });
}

export function useDeletePayLoan(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePayLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pay-loans", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-stats", organizationId],
      });
    },
  });
}

export function useRecordEmiPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      loanId,
      amount,
      paymentDate,
    }: {
      organizationId: string;
      loanId: string;
      amount: number;
      paymentDate: string;
    }) => recordEmiPayment(loanId, amount, paymentDate),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-loans", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-detail", variables.loanId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-stats", variables.organizationId],
      });
    },
  });
}

export function useCancelPayLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      loanId,
    }: {
      organizationId: string;
      loanId: string;
    }) => cancelPayLoan(loanId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-loans", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-detail", variables.loanId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-loan-stats", variables.organizationId],
      });
    },
  });
}
