import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdvanceList,
  fetchAdvanceById,
  fetchAdvancesByParty,
  fetchPendingAdvancesByParty,
  createAdvanceFromForm,
  updateAdvance,
  deleteAdvance,
  convertAdvanceToLoan,
  adjustAdvance,
  closeAdvance,
  getNextAdvanceNumber,
  getAdvanceStats,
} from "../api/advances";
import type { AdvanceFormInput, UpdateAdvanceInput } from "../types";

export function useAdvanceList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["advances", organizationId],
    queryFn: () => fetchAdvanceList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useAdvance(advanceId: string | undefined) {
  return useQuery({
    queryKey: ["advance-detail", advanceId],
    queryFn: () => fetchAdvanceById(advanceId!),
    enabled: !!advanceId,
  });
}

export function useAdvancesByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["advances-party", organizationId, partyId],
    queryFn: () => fetchAdvancesByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function usePendingAdvancesByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["advances-party-pending", organizationId, partyId],
    queryFn: () => fetchPendingAdvancesByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useNextAdvanceNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-advance-no", organizationId],
    queryFn: () => getNextAdvanceNumber(organizationId!),
    enabled: !!organizationId,
  });
}

export function useAdvanceStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["advance-stats", organizationId],
    queryFn: () => getAdvanceStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateAdvance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: AdvanceFormInput;
    }) => createAdvanceFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["advances", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-advance-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["loan-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateAdvance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAdvanceInput) => updateAdvance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["advances", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["advance-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["advance-stats", variables.organizationId],
      });
    },
  });
}

export function useDeleteAdvance(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdvance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["advances", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-advance-no", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-stats", organizationId],
      });
    },
  });
}

export function useConvertAdvance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      advanceId,
      amadId,
    }: {
      organizationId: string;
      advanceId: string;
      amadId: string;
    }) => convertAdvanceToLoan(advanceId, amadId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["advances", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-detail", variables.advanceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-stats", variables.organizationId],
      });
    },
  });
}

export function useAdjustAdvance(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (advanceId: string) => adjustAdvance(advanceId),
    onSuccess: (_data, advanceId) => {
      queryClient.invalidateQueries({
        queryKey: ["advances", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-detail", advanceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-stats", organizationId],
      });
    },
  });
}

export function useCloseAdvance(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (advanceId: string) => closeAdvance(advanceId),
    onSuccess: (_data, advanceId) => {
      queryClient.invalidateQueries({
        queryKey: ["advances", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-detail", advanceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["advance-stats", organizationId],
      });
    },
  });
}
