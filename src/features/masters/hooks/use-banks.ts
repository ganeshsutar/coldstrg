import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  fetchBanks,
  createBank,
  updateBank,
  deleteBank,
  seedBanks,
} from "../api/banks";
import type { CreateBankInput, UpdateBankInput } from "../types";

export function useBanks(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasSeeded = useRef(false);

  const query = useQuery({
    queryKey: ["banks", organizationId],
    queryFn: () => fetchBanks(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-seed banks if none exist
  useEffect(() => {
    if (
      !hasSeeded.current &&
      organizationId &&
      query.data &&
      query.data.length === 0 &&
      !query.isLoading
    ) {
      hasSeeded.current = true;
      seedBanks(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["banks", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, queryClient]);

  return query;
}

export function useCreateBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBankInput) => createBank(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["banks", variables.organizationId],
      });
    },
  });
}

export function useUpdateBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBankInput) => updateBank(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["banks", variables.organizationId],
      });
    },
  });
}

export function useDeleteBank(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["banks", organizationId],
      });
    },
  });
}
