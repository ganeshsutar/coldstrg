import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  fetchGstRates,
  createGstRate,
  updateGstRate,
  deleteGstRate,
  seedGstRates,
} from "../api/gst-rates";
import type { CreateGstRateInput, UpdateGstRateInput } from "../types";

export function useGstRates(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasSeeded = useRef(false);

  const query = useQuery({
    queryKey: ["gstRates", organizationId],
    queryFn: () => fetchGstRates(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-seed GST rates if none exist
  useEffect(() => {
    if (
      !hasSeeded.current &&
      organizationId &&
      query.data &&
      query.data.length === 0 &&
      !query.isLoading
    ) {
      hasSeeded.current = true;
      seedGstRates(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["gstRates", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, queryClient]);

  return query;
}

export function useCreateGstRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGstRateInput) => createGstRate(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gstRates", variables.organizationId],
      });
    },
  });
}

export function useUpdateGstRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateGstRateInput) => updateGstRate(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gstRates", variables.organizationId],
      });
    },
  });
}

export function useDeleteGstRate(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGstRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gstRates", organizationId],
      });
    },
  });
}
