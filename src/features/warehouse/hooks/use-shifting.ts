import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchShiftingHeaders,
  fetchShiftingHeader,
  createShiftingHeader,
  updateShiftingHeader,
  deleteShiftingHeader,
  fetchShiftings,
  fetchShiftingsByHeaderId,
  fetchShiftingsByAmadId,
  fetchShifting,
  createShifting,
  updateShifting,
  deleteShifting,
} from "../api/shifting";
import type {
  CreateShiftingHeaderInput,
  UpdateShiftingHeaderInput,
  CreateShiftingInput,
  UpdateShiftingInput,
} from "../types";

// ShiftingHeader hooks
export function useShiftingHeaders(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["shiftingHeaders", organizationId],
    queryFn: () => fetchShiftingHeaders(organizationId!),
    enabled: !!organizationId,
  });
}

export function useShiftingHeader(id: string | undefined) {
  return useQuery({
    queryKey: ["shiftingHeader", id],
    queryFn: () => fetchShiftingHeader(id!),
    enabled: !!id,
  });
}

export function useCreateShiftingHeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShiftingHeaderInput) => createShiftingHeader(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shiftingHeaders", variables.organizationId],
      });
    },
  });
}

export function useUpdateShiftingHeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShiftingHeaderInput) => updateShiftingHeader(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shiftingHeaders", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shiftingHeader", variables.id],
      });
    },
  });
}

export function useDeleteShiftingHeader(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShiftingHeader(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shiftingHeaders", organizationId],
      });
    },
  });
}

// Shifting (detail lines) hooks
export function useShiftings(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["shiftings", organizationId],
    queryFn: () => fetchShiftings(organizationId!),
    enabled: !!organizationId,
  });
}

export function useShiftingsByHeaderId(shiftingHeaderId: string | undefined) {
  return useQuery({
    queryKey: ["shiftings", "header", shiftingHeaderId],
    queryFn: () => fetchShiftingsByHeaderId(shiftingHeaderId!),
    enabled: !!shiftingHeaderId,
  });
}

export function useShiftingsByAmadId(amadId: string | undefined) {
  return useQuery({
    queryKey: ["shiftings", "amad", amadId],
    queryFn: () => fetchShiftingsByAmadId(amadId!),
    enabled: !!amadId,
  });
}

export function useShifting(id: string | undefined) {
  return useQuery({
    queryKey: ["shifting", id],
    queryFn: () => fetchShifting(id!),
    enabled: !!id,
  });
}

export function useCreateShifting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShiftingInput) => createShifting(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shiftings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shiftings", "header", variables.shiftingHeaderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shiftings", "amad", variables.amadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}

export function useUpdateShifting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShiftingInput) => updateShifting(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shiftings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shiftings", "header", variables.shiftingHeaderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shiftings", "amad", variables.amadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shifting", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}

export function useDeleteShifting(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShifting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shiftings", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rackOccupancy"],
      });
    },
  });
}
