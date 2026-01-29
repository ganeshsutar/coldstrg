import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBardanaIssueList,
  fetchBardanaIssueById,
  fetchBardanaIssueByParty,
  fetchBardanaIssueItems,
  createBardanaIssue,
  updateBardanaIssueHeader,
  deleteBardanaIssueHeader,
  confirmBardanaIssue,
  cancelBardanaIssue,
  getNextIssueNo,
} from "../api/bardana-issue";
import type {
  BardanaIssueFormInput,
  UpdateBardanaIssueHeaderInput,
} from "../types";

export function useBardanaIssueList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-issues", organizationId],
    queryFn: () => fetchBardanaIssueList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBardanaIssueDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["bardana-issue-detail", id],
    queryFn: () => fetchBardanaIssueById(id!),
    enabled: !!id,
  });
}

export function useBardanaIssueByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["bardana-issues-party", organizationId, partyId],
    queryFn: () => fetchBardanaIssueByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useBardanaIssueItems(issueHeaderId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-issue-items", issueHeaderId],
    queryFn: () => fetchBardanaIssueItems(issueHeaderId!),
    enabled: !!issueHeaderId,
  });
}

export function useNextIssueNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-next-issue-no", organizationId],
    queryFn: () => getNextIssueNo(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateBardanaIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: BardanaIssueFormInput;
    }) => createBardanaIssue(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-issues", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-next-issue-no", variables.organizationId],
      });
    },
  });
}

export function useUpdateBardanaIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBardanaIssueHeaderInput) =>
      updateBardanaIssueHeader(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-issues", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["bardana-issue-detail", variables.id],
        });
      }
    },
  });
}

export function useDeleteBardanaIssue(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBardanaIssueHeader(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-issues", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-next-issue-no", organizationId],
      });
    },
  });
}

export function useConfirmBardanaIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      issueId,
      confirmedBy,
    }: {
      organizationId: string;
      issueId: string;
      confirmedBy: string;
    }) => confirmBardanaIssue(organizationId, issueId, confirmedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-issues", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-issue-detail", variables.issueId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock", variables.organizationId],
      });
    },
  });
}

export function useCancelBardanaIssue(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (issueId: string) => cancelBardanaIssue(issueId),
    onSuccess: (_data, issueId) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-issues", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-issue-detail", issueId],
      });
    },
  });
}
