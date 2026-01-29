import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUnloadings,
  fetchUnloadingsByChamberId,
  fetchUnloadingsByAmadId,
  fetchUnloading,
  createUnloading,
  updateUnloading,
  deleteUnloading,
} from "../api/unloading";
import type { CreateUnloadingInput, UpdateUnloadingInput } from "../types";

export function useUnloadings(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["unloadings", organizationId],
    queryFn: () => fetchUnloadings(organizationId!),
    enabled: !!organizationId,
  });
}

export function useUnloadingsByChamberId(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["unloadings", "chamber", chamberId],
    queryFn: () => fetchUnloadingsByChamberId(chamberId!),
    enabled: !!chamberId,
  });
}

export function useUnloadingsByAmadId(amadId: string | undefined) {
  return useQuery({
    queryKey: ["unloadings", "amad", amadId],
    queryFn: () => fetchUnloadingsByAmadId(amadId!),
    enabled: !!amadId,
  });
}

export function useUnloading(id: string | undefined) {
  return useQuery({
    queryKey: ["unloading", id],
    queryFn: () => fetchUnloading(id!),
    enabled: !!id,
  });
}

export function useCreateUnloading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUnloadingInput) => createUnloading(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["unloadings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unloadings", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unloadings", "amad", variables.amadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}

export function useUpdateUnloading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUnloadingInput) => updateUnloading(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["unloadings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unloadings", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unloadings", "amad", variables.amadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unloading", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}

export function useDeleteUnloading(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUnloading(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unloadings", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}
