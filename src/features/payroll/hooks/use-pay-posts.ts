import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayPostList,
  fetchPayPostById,
  createPayPost,
  updatePayPost,
  deletePayPost,
} from "../api/pay-posts";
import type { CreatePayPostInput, UpdatePayPostInput } from "../types";

export function usePayPostList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["pay-posts", organizationId],
    queryFn: () => fetchPayPostList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePayPost(postId: string | undefined) {
  return useQuery({
    queryKey: ["pay-post-detail", postId],
    queryFn: () => fetchPayPostById(postId!),
    enabled: !!postId,
  });
}

export function useCreatePayPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePayPostInput) => createPayPost(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-posts", variables.organizationId],
      });
    },
  });
}

export function useUpdatePayPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePayPostInput) => updatePayPost(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-posts"],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["pay-post-detail", variables.id],
        });
      }
    },
  });
}

export function useDeletePayPost(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePayPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pay-posts", organizationId],
      });
    },
  });
}
