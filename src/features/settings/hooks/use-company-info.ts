import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrganizationDetails, updateCompanyInfo, type UpdateCompanyInfoInput } from "../api/company-info";

export function useCompanyInfo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["company-info", organizationId],
    queryFn: () => fetchOrganizationDetails(organizationId!),
    enabled: !!organizationId,
  });
}

export function useUpdateCompanyInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCompanyInfoInput) => updateCompanyInfo(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["company-info", variables.id],
      });
    },
  });
}
