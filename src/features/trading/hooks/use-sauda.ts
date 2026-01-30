import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSaudaList,
  fetchSaudaById,
  fetchSaudaBySeller,
  fetchSaudaByBuyer,
  fetchOpenSaudas,
  createSaudaFromForm,
  updateSauda,
  deleteSauda,
  cancelSauda,
  completeSauda,
  getNextSaudaNumber,
  getSaudaStats,
} from "../api/sauda";
import type { SaudaFormInput, UpdateSaudaInput } from "../types";

export function useSaudaList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["saudas", organizationId],
    queryFn: () => fetchSaudaList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useSauda(saudaId: string | undefined) {
  return useQuery({
    queryKey: ["sauda-detail", saudaId],
    queryFn: () => fetchSaudaById(saudaId!),
    enabled: !!saudaId,
  });
}

export function useSaudasBySeller(
  organizationId: string | undefined,
  sellerPartyId: string | undefined
) {
  return useQuery({
    queryKey: ["saudas-seller", organizationId, sellerPartyId],
    queryFn: () => fetchSaudaBySeller(organizationId!, sellerPartyId!),
    enabled: !!organizationId && !!sellerPartyId,
  });
}

export function useSaudasByBuyer(
  organizationId: string | undefined,
  buyerPartyId: string | undefined
) {
  return useQuery({
    queryKey: ["saudas-buyer", organizationId, buyerPartyId],
    queryFn: () => fetchSaudaByBuyer(organizationId!, buyerPartyId!),
    enabled: !!organizationId && !!buyerPartyId,
  });
}

export function useOpenSaudas(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["saudas-open", organizationId],
    queryFn: () => fetchOpenSaudas(organizationId!),
    enabled: !!organizationId,
  });
}

export function useNextSaudaNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-sauda-no", organizationId],
    queryFn: () => getNextSaudaNumber(organizationId!),
    enabled: !!organizationId,
  });
}

export function useSaudaStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["sauda-stats", organizationId],
    queryFn: () => getSaudaStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateSauda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: SaudaFormInput;
    }) => createSaudaFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["saudas", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-sauda-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateSauda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSaudaInput) => updateSauda(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["saudas", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["sauda-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["sauda-stats", variables.organizationId],
      });
    },
  });
}

export function useDeleteSauda(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSauda(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["saudas", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-sauda-no", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-stats", organizationId],
      });
    },
  });
}

export function useCancelSauda(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saudaId: string) => cancelSauda(saudaId),
    onSuccess: (_data, saudaId) => {
      queryClient.invalidateQueries({
        queryKey: ["saudas", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-detail", saudaId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-stats", organizationId],
      });
    },
  });
}

export function useCompleteSauda(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saudaId: string) => completeSauda(saudaId),
    onSuccess: (_data, saudaId) => {
      queryClient.invalidateQueries({
        queryKey: ["saudas", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-detail", saudaId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-stats", organizationId],
      });
    },
  });
}
