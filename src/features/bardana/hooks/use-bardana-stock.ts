import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBardanaStockList,
  fetchBardanaStockByParty,
  fetchBardanaStockByType,
  createBardanaStock,
  updateBardanaStock,
} from "../api/bardana-stock";
import type { CreateBardanaStockInput, UpdateBardanaStockInput } from "../types";

export function useBardanaStockList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-stock", organizationId],
    queryFn: () => fetchBardanaStockList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBardanaStockByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["bardana-stock-party", organizationId, partyId],
    queryFn: () => fetchBardanaStockByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useBardanaStockByType(
  organizationId: string | undefined,
  bardanaTypeId: string | undefined
) {
  return useQuery({
    queryKey: ["bardana-stock-type", organizationId, bardanaTypeId],
    queryFn: () => fetchBardanaStockByType(organizationId!, bardanaTypeId!),
    enabled: !!organizationId && !!bardanaTypeId,
  });
}

export function useCreateBardanaStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBardanaStockInput) => createBardanaStock(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock-party", variables.organizationId, variables.partyId],
      });
    },
  });
}

export function useUpdateBardanaStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBardanaStockInput) => updateBardanaStock(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock", variables.organizationId],
      });
      if (variables.partyId) {
        queryClient.invalidateQueries({
          queryKey: ["bardana-stock-party", variables.organizationId, variables.partyId],
        });
      }
    },
  });
}
