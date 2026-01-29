import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDaybookList,
  fetchDaybookByDate,
  fetchDaybookById,
  createDaybook,
  updateDaybook,
  deleteDaybook,
  getOrCreateDaybook,
} from "../api/daybook";
import type { CreateDaybookInput } from "../types";

export function useDaybookList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["daybook", organizationId],
    queryFn: () => fetchDaybookList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useDaybookByDate(
  organizationId: string | undefined,
  date: string | undefined
) {
  return useQuery({
    queryKey: ["daybook", "date", organizationId, date],
    queryFn: () => fetchDaybookByDate(organizationId!, date!),
    enabled: !!organizationId && !!date,
  });
}

export function useDaybookDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["daybook-detail", id],
    queryFn: () => fetchDaybookById(id!),
    enabled: !!id,
  });
}

export function useCreateDaybook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDaybookInput) => createDaybook(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daybook", variables.organizationId],
      });
    },
  });
}

export function useUpdateDaybook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      variables: Partial<CreateDaybookInput> & { id: string; organizationId: string }
    ) => {
      const { id, organizationId, ...input } = variables;
      void organizationId; // Used in onSuccess for cache invalidation
      return updateDaybook(id, input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daybook", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daybook-detail", variables.id],
      });
    },
  });
}

export function useDeleteDaybook(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDaybook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["daybook", organizationId],
      });
    },
  });
}

export function useGetOrCreateDaybook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      date,
    }: {
      organizationId: string;
      date: string;
    }) => getOrCreateDaybook(organizationId, date),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daybook", variables.organizationId],
      });
    },
  });
}
