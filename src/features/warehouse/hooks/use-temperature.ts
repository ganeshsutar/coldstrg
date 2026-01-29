import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTemperatureLogs,
  fetchTemperatureLogsByChamberId,
  fetchTemperatureLog,
  createTemperatureLog,
  updateTemperatureLog,
  deleteTemperatureLog,
  fetchRecentTemperatureLogs,
  getLatestTemperatureByChamberId,
} from "../api/temperature";
import type { CreateTemperatureLogInput, UpdateTemperatureLogInput } from "../types";

export function useTemperatureLogs(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["temperatureLogs", organizationId],
    queryFn: () => fetchTemperatureLogs(organizationId!),
    enabled: !!organizationId,
  });
}

export function useTemperatureLogsByChamberId(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["temperatureLogs", "chamber", chamberId],
    queryFn: () => fetchTemperatureLogsByChamberId(chamberId!),
    enabled: !!chamberId,
  });
}

export function useTemperatureLog(id: string | undefined) {
  return useQuery({
    queryKey: ["temperatureLog", id],
    queryFn: () => fetchTemperatureLog(id!),
    enabled: !!id,
  });
}

export function useRecentTemperatureLogs(organizationId: string | undefined, days: number = 7) {
  return useQuery({
    queryKey: ["temperatureLogs", "recent", organizationId, days],
    queryFn: () => fetchRecentTemperatureLogs(organizationId!, days),
    enabled: !!organizationId,
  });
}

export function useLatestTemperature(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["temperatureLogs", "latest", chamberId],
    queryFn: () => getLatestTemperatureByChamberId(chamberId!),
    enabled: !!chamberId,
  });
}

export function useCreateTemperatureLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTemperatureLogInput) => createTemperatureLog(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", "recent", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", "latest", variables.chamberId],
      });
    },
  });
}

export function useUpdateTemperatureLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTemperatureLogInput) => updateTemperatureLog(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLog", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", "recent", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", "latest", variables.chamberId],
      });
    },
  });
}

export function useDeleteTemperatureLog(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTemperatureLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["temperatureLogs", organizationId],
      });
    },
  });
}
