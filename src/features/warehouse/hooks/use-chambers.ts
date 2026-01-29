import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChambers,
  fetchChamber,
  createChamber,
  updateChamber,
  deleteChamber,
} from "../api/chambers";
import type { CreateChamberInput, UpdateChamberInput } from "../types";

export function useChambers(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["chambers", organizationId],
    queryFn: () => fetchChambers(organizationId!),
    enabled: !!organizationId,
  });
}

export function useChamber(id: string | undefined) {
  return useQuery({
    queryKey: ["chamber", id],
    queryFn: () => fetchChamber(id!),
    enabled: !!id,
  });
}

export function useCreateChamber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateChamberInput) => createChamber(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chambers", variables.organizationId],
      });
    },
  });
}

export function useUpdateChamber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateChamberInput) => updateChamber(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chambers", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chamber", variables.id],
      });
    },
  });
}

export function useDeleteChamber(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChamber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chambers", organizationId],
      });
    },
  });
}
