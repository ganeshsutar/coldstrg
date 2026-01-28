import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  fetchCommodities,
  createCommodity,
  updateCommodity,
  deleteCommodity,
  seedCommodities,
} from "../api/commodities";
import type { CreateCommodityInput, UpdateCommodityInput } from "../types";

export function useCommodities(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasSeeded = useRef(false);

  const query = useQuery({
    queryKey: ["commodities", organizationId],
    queryFn: () => fetchCommodities(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-seed commodities if none exist
  useEffect(() => {
    if (
      !hasSeeded.current &&
      organizationId &&
      query.data &&
      query.data.length === 0 &&
      !query.isLoading
    ) {
      hasSeeded.current = true;
      seedCommodities(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["commodities", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, queryClient]);

  return query;
}

export function useCreateCommodity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommodityInput) => createCommodity(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["commodities", variables.organizationId],
      });
    },
  });
}

export function useUpdateCommodity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCommodityInput) => updateCommodity(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["commodities", variables.organizationId],
      });
    },
  });
}

export function useDeleteCommodity(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCommodity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commodities", organizationId],
      });
    },
  });
}
