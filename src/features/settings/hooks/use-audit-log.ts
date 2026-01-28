import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAuditLogs, createAuditLog } from "../api/audit-log";
import type { CreateAuditLogInput } from "../types";

export function useAuditLogs(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["audit-logs", organizationId],
    queryFn: () => fetchAuditLogs(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateAuditLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAuditLogInput) => createAuditLog(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["audit-logs", variables.organizationId],
      });
    },
  });
}
