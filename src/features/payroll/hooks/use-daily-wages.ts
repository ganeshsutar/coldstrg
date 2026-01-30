import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDWageList,
  fetchDWageById,
  fetchDWageByDate,
  fetchDWageByDateRange,
  fetchUnpaidDWages,
  createDWageFromForm,
  updateDWage,
  deleteDWage,
  markDWageAsPaid,
  markBulkDWageAsPaid,
  getDWageStats,
  getDailyWagesSummary,
} from "../api/daily-wages";
import type { DWageFormInput, UpdateDWageInput } from "../types";

export function useDWageList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["daily-wages", organizationId],
    queryFn: () => fetchDWageList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useDWage(wageId: string | undefined) {
  return useQuery({
    queryKey: ["daily-wage-detail", wageId],
    queryFn: () => fetchDWageById(wageId!),
    enabled: !!wageId,
  });
}

export function useDWageByDate(
  organizationId: string | undefined,
  date: string | undefined
) {
  return useQuery({
    queryKey: ["daily-wages-date", organizationId, date],
    queryFn: () => fetchDWageByDate(organizationId!, date!),
    enabled: !!organizationId && !!date,
  });
}

export function useDWageByDateRange(
  organizationId: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined
) {
  return useQuery({
    queryKey: ["daily-wages-range", organizationId, startDate, endDate],
    queryFn: () => fetchDWageByDateRange(organizationId!, startDate!, endDate!),
    enabled: !!organizationId && !!startDate && !!endDate,
  });
}

export function useUnpaidDWages(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["daily-wages-unpaid", organizationId],
    queryFn: () => fetchUnpaidDWages(organizationId!),
    enabled: !!organizationId,
  });
}

export function useDWageStats(
  organizationId: string | undefined,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["daily-wages-stats", organizationId, startDate, endDate],
    queryFn: () => getDWageStats(organizationId!, startDate, endDate),
    enabled: !!organizationId,
  });
}

export function useDailyWagesSummary(
  organizationId: string | undefined,
  date: string | undefined
) {
  return useQuery({
    queryKey: ["daily-wages-summary", organizationId, date],
    queryFn: () => getDailyWagesSummary(organizationId!, date!),
    enabled: !!organizationId && !!date,
  });
}

export function useCreateDWage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: DWageFormInput;
    }) => createDWageFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-wages", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-unpaid", variables.organizationId],
      });
    },
  });
}

export function useUpdateDWage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateDWageInput) => updateDWage(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-wages"],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["daily-wage-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-stats"],
      });
    },
  });
}

export function useDeleteDWage(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDWage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["daily-wages", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-stats", organizationId],
      });
    },
  });
}

export function useMarkDWageAsPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      wageId,
      paymentMode,
      paymentRef,
    }: {
      organizationId: string;
      wageId: string;
      paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI";
      paymentRef?: string;
    }) => markDWageAsPaid(wageId, paymentMode, paymentRef),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-wages", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wage-detail", variables.wageId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-unpaid", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-stats", variables.organizationId],
      });
    },
  });
}

export function useMarkBulkDWageAsPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      wageIds,
      paymentMode,
      paymentRef,
    }: {
      organizationId: string;
      wageIds: string[];
      paymentMode?: "CASH" | "CHEQUE" | "BANK" | "UPI";
      paymentRef?: string;
    }) => markBulkDWageAsPaid(wageIds, paymentMode, paymentRef),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-wages", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-unpaid", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-wages-stats", variables.organizationId],
      });
    },
  });
}
