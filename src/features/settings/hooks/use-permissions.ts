import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  fetchRolePermissions,
  updateRolePermission,
  seedDefaultPermissions,
} from "../api/permissions";
import type { UpdateRolePermissionInput } from "../types";

export function useRolePermissions(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  const hasSeeded = useRef(false);

  const query = useQuery({
    queryKey: ["role-permissions", organizationId],
    queryFn: () => fetchRolePermissions(organizationId!),
    enabled: !!organizationId,
  });

  // Auto-seed 3 role permission records if none exist
  useEffect(() => {
    if (
      !hasSeeded.current &&
      organizationId &&
      query.data &&
      query.data.length === 0 &&
      !query.isLoading
    ) {
      hasSeeded.current = true;
      seedDefaultPermissions(organizationId).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["role-permissions", organizationId],
        });
      });
    }
  }, [organizationId, query.data, query.isLoading, queryClient]);

  return query;
}

export function useUpdateRolePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateRolePermissionInput) => updateRolePermission(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", variables.organizationId],
      });
    },
  });
}
