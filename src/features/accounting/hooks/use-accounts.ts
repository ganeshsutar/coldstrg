import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  fetchAccountList,
  fetchAccountById,
  fetchPartyAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  seedAccounts,
} from "../api/accounts";
import type { CreateAccountInput, UpdateAccountInput } from "../types";

export function useAccountList(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasSeeded = useRef(false);

  const query = useQuery({
    queryKey: ["accounts", organizationId],
    queryFn: () => fetchAccountList(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-seed accounts if none exist
  useEffect(() => {
    if (
      !hasSeeded.current &&
      organizationId &&
      query.data &&
      query.data.length === 0 &&
      !query.isLoading
    ) {
      hasSeeded.current = true;
      seedAccounts(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["accounts", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, queryClient]);

  return query;
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
