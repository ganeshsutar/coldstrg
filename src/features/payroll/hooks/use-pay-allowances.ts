import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayAllowanceList,
  fetchPayAllowanceById,
  createPayAllowance,
  updatePayAllowance,
  deletePayAllowance,
} from "../api/pay-allowances";
import type { CreatePayAllowanceInput, UpdatePayAllowanceInput } from "../types";

export function usePayAllowanceList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["pay-allowances", organizationId],
    queryFn: () => fetchPayAllowanceList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePayAllowance(allowanceId: string | undefined) {
  return useQuery({
    queryKey: ["pay-allowance-detail", allowanceId],
    queryFn: () => fetchPayAllowanceById(allowanceId!),
    enabled: !!allowanceId,
  });
}

export function useCreatePayAllowance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePayAllowanceInput) => createPayAllowance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-allowances", variables.organizationId],
      });
    },
  });
}

export function useUpdatePayAllowance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePayAllowanceInput) => updatePayAllowance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-allowances"],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["pay-allowance-detail", variables.id],
        });
      }
    },
  });
}

export function useDeletePayAllowance(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePayAllowance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pay-allowances", organizationId],
      });
    },
  });
}
