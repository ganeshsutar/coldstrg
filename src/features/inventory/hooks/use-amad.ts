import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAmadList,
  fetchAmadById,
  createAmad,
  updateAmad,
  deleteAmad,
} from "../api/amad";
import type { CreateAmadInput, UpdateAmadInput } from "../types";

export function useAmadList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["amad", organizationId],
    queryFn: () => fetchAmadList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useAmadDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["amad-detail", id],
    queryFn: () => fetchAmadById(id!),
    enabled: !!id,
  });
}

export function useCreateAmad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAmadInput) => createAmad(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["amad", variables.organizationId],
      });
    },
  });
}

export function useUpdateAmad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAmadInput) => updateAmad(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["amad", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["amad-detail", variables.id],
        });
      }
    },
  });
}

export function useDeleteAmad(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAmad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["amad", organizationId],
      });
    },
  });
}
