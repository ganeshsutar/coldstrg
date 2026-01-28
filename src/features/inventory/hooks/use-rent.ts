import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRentList,
  createRent,
  updateRent,
  deleteRent,
} from "../api/rent";
import type { CreateRentInput, UpdateRentInput } from "../types";

export function useRentList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["rent", organizationId],
    queryFn: () => fetchRentList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateRent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRentInput) => createRent(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rent", variables.organizationId],
      });
    },
  });
}

export function useUpdateRent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateRentInput) => updateRent(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rent", variables.organizationId],
      });
    },
  });
}

export function useDeleteRent(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rent", organizationId],
      });
    },
  });
}
