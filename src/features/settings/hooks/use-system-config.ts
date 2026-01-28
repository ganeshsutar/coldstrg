import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchSystemConfig, createSystemConfig, updateSystemConfig } from "../api/system-config";
import type { UpdateSystemConfigInput } from "../types";

export function useSystemConfig(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasCreated = useRef(false);

  const query = useQuery({
    queryKey: ["system-config", organizationId],
    queryFn: () => fetchSystemConfig(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-create config if none exists
  useEffect(() => {
    if (
      !hasCreated.current &&
      organizationId &&
      query.data === null &&
      !query.isLoading &&
      query.isFetched
    ) {
      hasCreated.current = true;
      createSystemConfig(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["system-config", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, query.isFetched, queryClient]);

  return query;
}

export function useUpdateSystemConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSystemConfigInput) => updateSystemConfig(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["system-config", variables.organizationId],
      });
    },
  });
}
