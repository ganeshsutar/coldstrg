import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayDeductionList,
  fetchPayDeductionById,
  createPayDeduction,
  updatePayDeduction,
  deletePayDeduction,
} from "../api/pay-deductions";
import type { CreatePayDeductionInput, UpdatePayDeductionInput } from "../types";

export function usePayDeductionList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["pay-deductions", organizationId],
    queryFn: () => fetchPayDeductionList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePayDeduction(deductionId: string | undefined) {
  return useQuery({
    queryKey: ["pay-deduction-detail", deductionId],
    queryFn: () => fetchPayDeductionById(deductionId!),
    enabled: !!deductionId,
  });
}

export function useCreatePayDeduction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePayDeductionInput) => createPayDeduction(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-deductions", variables.organizationId],
      });
    },
  });
}

export function useUpdatePayDeduction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePayDeductionInput) => updatePayDeduction(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-deductions"],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["pay-deduction-detail", variables.id],
        });
      }
    },
  });
}

export function useDeletePayDeduction(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePayDeduction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pay-deductions", organizationId],
      });
    },
  });
}
