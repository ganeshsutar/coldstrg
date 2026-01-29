import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBardanaReceiptList,
  fetchBardanaReceiptById,
  fetchBardanaReceiptByParty,
  fetchBardanaReceiptItems,
  createBardanaReceipt,
  updateBardanaReceiptHeader,
  deleteBardanaReceiptHeader,
  confirmBardanaReceipt,
  cancelBardanaReceipt,
  getNextReceiptNo,
} from "../api/bardana-receipt";
import type {
  BardanaReceiptFormInput,
  UpdateBardanaReceiptHeaderInput,
} from "../types";

export function useBardanaReceiptList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-receipts", organizationId],
    queryFn: () => fetchBardanaReceiptList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBardanaReceiptDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["bardana-receipt-detail", id],
    queryFn: () => fetchBardanaReceiptById(id!),
    enabled: !!id,
  });
}

export function useBardanaReceiptByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["bardana-receipts-party", organizationId, partyId],
    queryFn: () => fetchBardanaReceiptByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useBardanaReceiptItems(receiptHeaderId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-receipt-items", receiptHeaderId],
    queryFn: () => fetchBardanaReceiptItems(receiptHeaderId!),
    enabled: !!receiptHeaderId,
  });
}

export function useNextReceiptNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["bardana-next-receipt-no", organizationId],
    queryFn: () => getNextReceiptNo(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateBardanaReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: BardanaReceiptFormInput;
    }) => createBardanaReceipt(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipts", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-next-receipt-no", variables.organizationId],
      });
    },
  });
}

export function useUpdateBardanaReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBardanaReceiptHeaderInput) =>
      updateBardanaReceiptHeader(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipts", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["bardana-receipt-detail", variables.id],
        });
      }
    },
  });
}

export function useDeleteBardanaReceipt(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBardanaReceiptHeader(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipts", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-next-receipt-no", organizationId],
      });
    },
  });
}

export function useConfirmBardanaReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      receiptId,
      confirmedBy,
    }: {
      organizationId: string;
      receiptId: string;
      confirmedBy: string;
    }) => confirmBardanaReceipt(organizationId, receiptId, confirmedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipts", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipt-detail", variables.receiptId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-stock", variables.organizationId],
      });
    },
  });
}

export function useCancelBardanaReceipt(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receiptId: string) => cancelBardanaReceipt(receiptId),
    onSuccess: (_data, receiptId) => {
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipts", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bardana-receipt-detail", receiptId],
      });
    },
  });
}
