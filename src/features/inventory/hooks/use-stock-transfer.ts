import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStockTransferList,
  createStockTransfer,
  deleteStockTransfer,
} from "../api/stock-transfer";
import type { CreateStockTransferInput } from "../types";

export function useStockTransferList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["stock-transfer", organizationId],
    queryFn: () => fetchStockTransferList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateStockTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStockTransferInput) => createStockTransfer(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["stock-transfer", variables.organizationId],
      });
    },
  });
}

export function useDeleteStockTransfer(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStockTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-transfer", organizationId],
      });
    },
  });
}
