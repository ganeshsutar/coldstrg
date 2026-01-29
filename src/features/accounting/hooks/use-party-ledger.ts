import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPartyLedgerList,
  fetchPartyLedgerByAccount,
  fetchPartyLedgerById,
  createPartyLedger,
  deletePartyLedger,
} from "../api/party-ledger";
import type { CreatePartyLedgerInput } from "../types";

export function usePartyLedgerList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["party-ledger", organizationId],
    queryFn: () => fetchPartyLedgerList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePartyLedgerByAccount(
  organizationId: string | undefined,
  accountId: string | undefined
) {
  return useQuery({
    queryKey: ["party-ledger", "account", organizationId, accountId],
    queryFn: () => fetchPartyLedgerByAccount(organizationId!, accountId!),
    enabled: !!organizationId && !!accountId,
  });
}

export function usePartyLedgerDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["party-ledger-detail", id],
    queryFn: () => fetchPartyLedgerById(id!),
    enabled: !!id,
  });
}

export function useCreatePartyLedger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePartyLedgerInput) => createPartyLedger(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["party-ledger", variables.organizationId],
      });
      if (variables.accountId) {
        queryClient.invalidateQueries({
          queryKey: ["party-ledger", "account", variables.organizationId, variables.accountId],
        });
      }
      // Invalidate account balances
      queryClient.invalidateQueries({
        queryKey: ["accounts", variables.organizationId],
      });
    },
  });
}

export function useDeletePartyLedger(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePartyLedger(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["party-ledger", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts", organizationId],
      });
    },
  });
}
