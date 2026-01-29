import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAccountList,
  fetchAccountById,
  fetchPartyAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../api/accounts";
import type { CreateAccountInput, UpdateAccountInput } from "../types";

export function useAccountList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["accounts", organizationId],
    queryFn: () => fetchAccountList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePartyAccounts(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["accounts", "parties", organizationId],
    queryFn: () => fetchPartyAccounts(organizationId!),
    enabled: !!organizationId,
  });
}

export function useAccountDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["account-detail", id],
    queryFn: () => fetchAccountById(id!),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAccountInput) => createAccount(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", variables.organizationId],
      });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAccountInput) => updateAccount(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["account-detail", variables.id],
        });
      }
    },
  });
}

export function useDeleteAccount(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", organizationId],
      });
    },
  });
}
