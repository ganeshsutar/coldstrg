import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  fetchLaborRates,
  createLaborRate,
  deleteLaborRate,
  seedLaborRates,
} from "../api/labor-rates";
import type { CreateLaborRateInput } from "../types";

export function useLaborRates(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasSeeded = useRef(false);

  const query = useQuery({
    queryKey: ["laborRates", organizationId],
    queryFn: () => fetchLaborRates(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-seed labor rates if none exist
  useEffect(() => {
    if (
      !hasSeeded.current &&
      organizationId &&
      query.data &&
      query.data.length === 0 &&
      !query.isLoading
    ) {
      hasSeeded.current = true;
      seedLaborRates(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["laborRates", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, queryClient]);

  return query;
}

export function useCreateLaborRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLaborRateInput) => createLaborRate(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["laborRates", variables.organizationId],
      });
    },
  });
}

export function useDeleteLaborRate(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLaborRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["laborRates", organizationId],
      });
    },
  });
}
