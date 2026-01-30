import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReceiptList,
  fetchReceiptById,
  fetchReceiptByParty,
  fetchReceiptAllocations,
  getNextReceiptNumber,
  createReceiptWithAllocations,
  updateReceipt,
  deleteReceipt,
  confirmReceipt,
  cancelReceipt,
  fetchPartyOutstanding,
  fetchAllPartiesOutstanding,
} from "../api/receipts";
import type { ReceiptFormInput, UpdateReceiptInput } from "../types";

export function useReceiptList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["receipts", organizationId],
    queryFn: () => fetchReceiptList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useReceiptDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["receipt-detail", id],
    queryFn: () => fetchReceiptById(id!),
    enabled: !!id,
  });
}

export function useReceiptByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["receipts-party", organizationId, partyId],
    queryFn: () => fetchReceiptByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useReceiptAllocations(receiptId: string | undefined) {
  return useQuery({
    queryKey: ["receipt-allocations", receiptId],
    queryFn: () => fetchReceiptAllocations(receiptId!),
    enabled: !!receiptId,
  });
}

export function useNextReceiptNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-receipt-no", organizationId],
    queryFn: () => getNextReceiptNumber(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePartyOutstanding(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["party-outstanding", organizationId, partyId],
    queryFn: () => fetchPartyOutstanding(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useAllPartiesOutstanding(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["all-parties-outstanding", organizationId],
    queryFn: () => fetchAllPartiesOutstanding(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: ReceiptFormInput;
    }) => createReceiptWithAllocations(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["receipts", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-receipt-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateReceiptInput) => updateReceipt(input),
    onSuccess: (_data, variables) => {
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["receipt-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["receipts"],
      });
    },
  });
}

export function useDeleteReceipt(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["receipts", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-receipt-no", organizationId],
      });
    },
  });
}

export function useConfirmReceipt() {
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
    }) => confirmReceipt(organizationId, receiptId, confirmedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["receipt-detail", variables.receiptId],
      });
      queryClient.invalidateQueries({
        queryKey: ["receipts", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rent-bills", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["party-outstanding", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-parties-outstanding", variables.organizationId],
      });
    },
  });
}

export function useCancelReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      receiptId,
      cancelledBy,
      cancelReason,
    }: {
      organizationId: string;
      receiptId: string;
      cancelledBy: string;
      cancelReason?: string;
    }) => cancelReceipt(organizationId, receiptId, cancelledBy, cancelReason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["receipt-detail", variables.receiptId],
      });
      queryClient.invalidateQueries({
        queryKey: ["receipts", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rent-bills", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["party-outstanding", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-parties-outstanding", variables.organizationId],
      });
    },
  });
}
