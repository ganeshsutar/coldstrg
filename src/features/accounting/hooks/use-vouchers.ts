import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVoucherList,
  fetchVoucherById,
  fetchVouchersByType,
  fetchVouchersByDate,
  fetchVouchersByAccount,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../api/vouchers";
import type { CreateVoucherInput, UpdateVoucherInput, VoucherTypeValue } from "../types";

export function useVoucherList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["vouchers", organizationId],
    queryFn: () => fetchVoucherList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useVouchersByType(
  organizationId: string | undefined,
  voucherType: VoucherTypeValue | undefined
) {
  return useQuery({
    queryKey: ["vouchers", "type", organizationId, voucherType],
    queryFn: () => fetchVouchersByType(organizationId!, voucherType!),
    enabled: !!organizationId && !!voucherType,
  });
}

export function useVouchersByDate(
  organizationId: string | undefined,
  date: string | undefined
) {
  return useQuery({
    queryKey: ["vouchers", "date", organizationId, date],
    queryFn: () => fetchVouchersByDate(organizationId!, date!),
    enabled: !!organizationId && !!date,
  });
}

export function useVouchersByAccount(
  organizationId: string | undefined,
  accountId: string | undefined
) {
  return useQuery({
    queryKey: ["vouchers", "account", organizationId, accountId],
    queryFn: () => fetchVouchersByAccount(organizationId!, accountId!),
    enabled: !!organizationId && !!accountId,
  });
}

export function useVoucherDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["voucher-detail", id],
    queryFn: () => fetchVoucherById(id!),
    enabled: !!id,
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVoucherInput) => createVoucher(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vouchers", variables.organizationId],
      });
      // Also invalidate daybook since vouchers affect daily balances
      queryClient.invalidateQueries({
        queryKey: ["daybook", variables.organizationId],
      });
      // Invalidate account balances
      queryClient.invalidateQueries({
        queryKey: ["accounts", variables.organizationId],
      });
    },
  });
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateVoucherInput) => updateVoucher(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vouchers", variables.organizationId],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["voucher-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["daybook", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts", variables.organizationId],
      });
    },
  });
}

export function useDeleteVoucher(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vouchers", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daybook", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts", organizationId],
      });
    },
  });
}
