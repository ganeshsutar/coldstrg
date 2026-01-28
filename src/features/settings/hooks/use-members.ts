import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrgMembers, updateMember } from "../api/members";
import type { UpdateMemberInput } from "../types";

export function useOrgMembers(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["org-members", organizationId],
    queryFn: () => fetchOrgMembers(organizationId!),
    enabled: !!organizationId,
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMemberInput) => updateMember(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["org-members", variables.organizationId],
      });
    },
  });
}
