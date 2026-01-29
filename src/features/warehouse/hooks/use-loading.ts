import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLoadings,
  fetchLoadingsByChamberId,
  fetchLoadingsByAmadId,
  fetchLoading,
  createLoading,
  updateLoading,
  deleteLoading,
} from "../api/loading";
import type { CreateLoadingInput, UpdateLoadingInput } from "../types";

export function useLoadings(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["loadings", organizationId],
    queryFn: () => fetchLoadings(organizationId!),
    enabled: !!organizationId,
  });
}

export function useLoadingsByChamberId(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["loadings", "chamber", chamberId],
    queryFn: () => fetchLoadingsByChamberId(chamberId!),
    enabled: !!chamberId,
  });
}

export function useLoadingsByAmadId(amadId: string | undefined) {
  return useQuery({
    queryKey: ["loadings", "amad", amadId],
    queryFn: () => fetchLoadingsByAmadId(amadId!),
    enabled: !!amadId,
  });
}

export function useLoading(id: string | undefined) {
  return useQuery({
    queryKey: ["loading", id],
    queryFn: () => fetchLoading(id!),
    enabled: !!id,
  });
}

export function useCreateLoading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLoadingInput) => createLoading(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loadings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loadings", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loadings", "amad", variables.amadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}

export function useUpdateLoading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateLoadingInput) => updateLoading(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["loadings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loadings", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loadings", "amad", variables.amadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loading", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}

export function useDeleteLoading(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLoading(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loadings", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}
