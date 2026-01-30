import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchKataiList,
  fetchKataiById,
  fetchKataiByParty,
  fetchKataiByAmad,
  createKataiFromForm,
  updateKatai,
  deleteKatai,
  startKatai,
  completeKatai,
  getNextKataiNumber,
  getKataiStats,
} from "../api/katai";
import type { KataiFormInput, UpdateKataiInput } from "../types";

export function useKataiList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["katais", organizationId],
    queryFn: () => fetchKataiList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useKatai(kataiId: string | undefined) {
  return useQuery({
    queryKey: ["katai-detail", kataiId],
    queryFn: () => fetchKataiById(kataiId!),
    enabled: !!kataiId,
  });
}

export function useKataiByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["katai-party", organizationId, partyId],
    queryFn: () => fetchKataiByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useKataiByAmad(
  organizationId: string | undefined,
  amadId: string | undefined
) {
  return useQuery({
    queryKey: ["katai-amad", organizationId, amadId],
    queryFn: () => fetchKataiByAmad(organizationId!, amadId!),
    enabled: !!organizationId && !!amadId,
  });
}

export function useNextKataiNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-katai-no", organizationId],
    queryFn: () => getNextKataiNumber(organizationId!),
    enabled: !!organizationId,
  });
}

export function useKataiStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["katai-stats", organizationId],
    queryFn: () => getKataiStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateKatai() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: KataiFormInput;
    }) => createKataiFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["katais", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-katai-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["katai-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateKatai() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateKataiInput) => updateKatai(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["katais", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["katai-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["katai-stats", variables.organizationId],
      });
    },
  });
}

export function useDeleteKatai(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKatai(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["katais", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-katai-no", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["katai-stats", organizationId],
      });
    },
  });
}

export function useStartKatai(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kataiId: string) => startKatai(kataiId),
    onSuccess: (_data, kataiId) => {
      queryClient.invalidateQueries({
        queryKey: ["katais", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["katai-detail", kataiId],
      });
      queryClient.invalidateQueries({
        queryKey: ["katai-stats", organizationId],
      });
    },
  });
}

export function useCompleteKatai(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kataiId: string) => completeKatai(kataiId),
    onSuccess: (_data, kataiId) => {
      queryClient.invalidateQueries({
        queryKey: ["katais", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["katai-detail", kataiId],
      });
      queryClient.invalidateQueries({
        queryKey: ["katai-stats", organizationId],
      });
    },
  });
}
