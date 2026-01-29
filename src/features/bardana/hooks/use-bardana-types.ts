import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBardanaTypeList,
  fetchBardanaTypeById,
  createBardanaType,
  updateBardanaType,
  deleteBardanaType,
} from "../api/bardana-types";
import type { CreateBardanaTypeInput, UpdateBardanaTypeInput } from "../types";

export function useBardanaTypeList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-types", organizationId],
    queryFn: () => fetchBardanaTypeList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBardanaTypeDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["bardana-type-detail", id],
    queryFn: () => fetchBardanaTypeById(id!),
    enabled: !!id,
  });
}

export function useCreateBardanaType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBardanaTypeInput) => createBardanaType(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-types", variables.organizationId],
      });
    },
  });
}

export function useUpdateBardanaType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBardanaTypeInput) => updateBardanaType(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-types", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["bardana-type-detail", variables.id],
        });
      }
    },
  });
}

export function useDeleteBardanaType(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBardanaType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-types", organizationId],
      });
    },
  });
}
