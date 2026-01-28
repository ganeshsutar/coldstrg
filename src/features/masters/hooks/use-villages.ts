import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVillages,
  createVillage,
  updateVillage,
  deleteVillage,
} from "../api/villages";
import type { CreateVillageInput, UpdateVillageInput } from "../types";

export function useVillages(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["villages", organizationId],
    queryFn: () => fetchVillages(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateVillage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVillageInput) => createVillage(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["villages", variables.organizationId],
      });
    },
  });
}

export function useUpdateVillage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateVillageInput) => updateVillage(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["villages", variables.organizationId],
      });
    },
  });
}

export function useDeleteVillage(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVillage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["villages", organizationId],
      });
    },
  });
}
