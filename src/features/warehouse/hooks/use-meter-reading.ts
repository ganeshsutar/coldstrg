import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMeterReadings,
  fetchMeterReadingsByChamberId,
  fetchMeterReading,
  createMeterReading,
  updateMeterReading,
  deleteMeterReading,
  getLatestMeterReading,
  calculateConsumption,
} from "../api/meter-reading";
import type { CreateMeterReadingInput, UpdateMeterReadingInput } from "../types";

export function useMeterReadings(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["meterReadings", organizationId],
    queryFn: () => fetchMeterReadings(organizationId!),
    enabled: !!organizationId,
  });
}

export function useMeterReadingsByChamberId(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["meterReadings", "chamber", chamberId],
    queryFn: () => fetchMeterReadingsByChamberId(chamberId!),
    enabled: !!chamberId,
  });
}

export function useMeterReading(id: string | undefined) {
  return useQuery({
    queryKey: ["meterReading", id],
    queryFn: () => fetchMeterReading(id!),
    enabled: !!id,
  });
}

export function useLatestMeterReading(organizationId: string | undefined, chamberId?: string) {
  return useQuery({
    queryKey: ["meterReadings", "latest", organizationId, chamberId],
    queryFn: () => getLatestMeterReading(organizationId!, chamberId),
    enabled: !!organizationId,
  });
}

export function useConsumptionCalculation(
  organizationId: string | undefined,
  startDate: string,
  endDate: string,
  chamberId?: string
) {
  return useQuery({
    queryKey: ["meterReadings", "consumption", organizationId, startDate, endDate, chamberId],
    queryFn: () => calculateConsumption(organizationId!, startDate, endDate, chamberId),
    enabled: !!organizationId && !!startDate && !!endDate,
  });
}

export function useCreateMeterReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMeterReadingInput) => createMeterReading(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", "latest", variables.organizationId],
      });
    },
  });
}

export function useUpdateMeterReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMeterReadingInput) => updateMeterReading(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meterReading", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", "latest", variables.organizationId],
      });
    },
  });
}

export function useDeleteMeterReading(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMeterReading(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meterReadings", organizationId],
      });
    },
  });
}
