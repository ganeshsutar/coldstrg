import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRentBillList,
  fetchRentBillById,
  fetchRentBillByParty,
  fetchUnpaidBillsByParty,
  fetchRentBillItems,
  fetchPriceBreakups,
  getNextRentBillNo,
  createRentBill,
  updateRentBillHeader,
  deleteRentBillHeader,
  confirmRentBill,
  cancelRentBill,
  fetchBillableAmads,
} from "../api/rent-bills";
import type { RentBillFormInput, UpdateRentBillHeaderInput } from "../types";

export function useRentBillList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["rent-bills", organizationId],
    queryFn: () => fetchRentBillList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useRentBillDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["rent-bill-detail", id],
    queryFn: () => fetchRentBillById(id!),
    enabled: !!id,
  });
}

export function useRentBillByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["rent-bills-party", organizationId, partyId],
    queryFn: () => fetchRentBillByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useUnpaidBillsByParty(
  organizationId: string | undefined,
  partyId: string | undefined
) {
  return useQuery({
    queryKey: ["unpaid-bills-party", organizationId, partyId],
    queryFn: () => fetchUnpaidBillsByParty(organizationId!, partyId!),
    enabled: !!organizationId && !!partyId,
  });
}

export function useRentBillItems(rentBillId: string | undefined) {
  return useQuery({
    queryKey: ["rent-bill-items", rentBillId],
    queryFn: () => fetchRentBillItems(rentBillId!),
    enabled: !!rentBillId,
  });
}

export function usePriceBreakups(rentBillId: string | undefined) {
  return useQuery({
    queryKey: ["price-breakups", rentBillId],
    queryFn: () => fetchPriceBreakups(rentBillId!),
    enabled: !!rentBillId,
  });
}

export function useNextRentBillNo(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-rent-bill-no", organizationId],
    queryFn: () => getNextRentBillNo(organizationId!),
    enabled: !!organizationId,
  });
}

export function useBillableAmads(
  organizationId: string | undefined,
  partyId?: string
) {
  return useQuery({
    queryKey: ["billable-amads", organizationId, partyId],
    queryFn: () => fetchBillableAmads(organizationId!, partyId),
    enabled: !!organizationId,
  });
}

export function useCreateRentBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: RentBillFormInput;
    }) => createRentBill(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rent-bills", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-rent-bill-no", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billable-amads", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateRentBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateRentBillHeaderInput) =>
      updateRentBillHeader(input),
    onSuccess: (_data, variables) => {
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["rent-bill-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["rent-bills"],
      });
    },
  });
}

export function useDeleteRentBill(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRentBillHeader(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rent-bills", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-rent-bill-no", organizationId],
      });
    },
  });
}

export function useConfirmRentBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, confirmedBy }: { id: string; confirmedBy: string }) =>
      confirmRentBill(id, confirmedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rent-bill-detail", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["rent-bills"],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-stats"],
      });
    },
  });
}

export function useCancelRentBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      cancelledBy,
      cancelReason,
    }: {
      id: string;
      cancelledBy: string;
      cancelReason?: string;
    }) => cancelRentBill(id, cancelledBy, cancelReason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rent-bill-detail", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["rent-bills"],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-stats"],
      });
    },
  });
}
