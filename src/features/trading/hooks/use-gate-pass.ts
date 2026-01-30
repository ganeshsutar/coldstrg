import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGatePassList,
  fetchGatePassById,
  fetchGatePassBySeller,
  fetchGatePassBySauda,
  fetchGatePassDetails,
  createGatePassFromForm,
  updateGatePass,
  deleteGatePass,
  confirmGatePass,
  markGatePassDone,
  cancelGatePass,
  getNextGatePassNumber,
  getGatePassStats,
} from "../api/gate-pass";
import type { GatePassFormInput, UpdateGatePassInput } from "../types";

export function useGatePassList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["gate-passes", organizationId],
    queryFn: () => fetchGatePassList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useGatePass(gatePassId: string | undefined) {
  return useQuery({
    queryKey: ["gate-pass-detail", gatePassId],
    queryFn: () => fetchGatePassById(gatePassId!),
    enabled: !!gatePassId,
  });
}

export function useGatePassesBySeller(
  organizationId: string | undefined,
  sellerPartyId: string | undefined
) {
  return useQuery({
    queryKey: ["gate-passes-seller", organizationId, sellerPartyId],
    queryFn: () => fetchGatePassBySeller(organizationId!, sellerPartyId!),
    enabled: !!organizationId && !!sellerPartyId,
  });
}

export function useGatePassesBySauda(
  organizationId: string | undefined,
  saudaId: string | undefined
) {
  return useQuery({
    queryKey: ["gate-passes-sauda", organizationId, saudaId],
    queryFn: () => fetchGatePassBySauda(organizationId!, saudaId!),
    enabled: !!organizationId && !!saudaId,
  });
}

export function useGatePassDetails(gatePassId: string | undefined) {
  return useQuery({
    queryKey: ["gate-pass-details", gatePassId],
    queryFn: () => fetchGatePassDetails(gatePassId!),
    enabled: !!gatePassId,
  });
}

export function useNextGpNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-gp-no", organizationId],
    queryFn: () => getNextGatePassNumber(organizationId!),
    enabled: !!organizationId,
  });
}

export function useGatePassStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["gate-pass-stats", organizationId],
    queryFn: () => getGatePassStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateGatePass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: GatePassFormInput;
    }) => createGatePassFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gate-passes", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-gp-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-stats", variables.organizationId],
      });
      // Also invalidate sauda queries since dispatch updates them
      queryClient.invalidateQueries({
        queryKey: ["saudas", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sauda-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateGatePass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateGatePassInput) => updateGatePass(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gate-passes", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["gate-pass-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-stats", variables.organizationId],
      });
    },
  });
}

export function useDeleteGatePass(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGatePass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gate-passes", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-gp-no", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-stats", organizationId],
      });
    },
  });
}

export function useConfirmGatePass(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gatePassId: string) => confirmGatePass(gatePassId),
    onSuccess: (_data, gatePassId) => {
      queryClient.invalidateQueries({
        queryKey: ["gate-passes", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-detail", gatePassId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-stats", organizationId],
      });
    },
  });
}

export function useMarkGatePassDone(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gatePassId: string) => markGatePassDone(gatePassId),
    onSuccess: (_data, gatePassId) => {
      queryClient.invalidateQueries({
        queryKey: ["gate-passes", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-detail", gatePassId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-stats", organizationId],
      });
    },
  });
}

export function useCancelGatePass(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gatePassId: string) => cancelGatePass(gatePassId),
    onSuccess: (_data, gatePassId) => {
      queryClient.invalidateQueries({
        queryKey: ["gate-passes", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-detail", gatePassId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gate-pass-stats", organizationId],
      });
    },
  });
}
