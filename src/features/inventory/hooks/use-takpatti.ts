import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTakpattiList,
  createTakpatti,
  deleteTakpatti,
} from "../api/takpatti";
import type { CreateTakpattiInput } from "../types";

export function useTakpattiList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["takpatti", organizationId],
    queryFn: () => fetchTakpattiList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateTakpatti() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTakpattiInput) => createTakpatti(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["takpatti", variables.organizationId],
      });
    },
  });
}

export function useDeleteTakpatti(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTakpatti(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["takpatti", organizationId],
      });
    },
  });
}
