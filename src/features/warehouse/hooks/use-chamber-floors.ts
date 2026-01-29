import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChamberFloors,
  fetchChamberFloorsByChamberId,
  fetchChamberFloor,
  createChamberFloor,
  updateChamberFloor,
  deleteChamberFloor,
  createFloorsForChamber,
} from "../api/chamber-floors";
import type { CreateChamberFloorInput, UpdateChamberFloorInput } from "../types";

export function useChamberFloors(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["chamberFloors", organizationId],
    queryFn: () => fetchChamberFloors(organizationId!),
    enabled: !!organizationId,
  });
}

export function useChamberFloorsByChamberId(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["chamberFloors", "chamber", chamberId],
    queryFn: () => fetchChamberFloorsByChamberId(chamberId!),
    enabled: !!chamberId,
  });
}

export function useChamberFloor(id: string | undefined) {
  return useQuery({
    queryKey: ["chamberFloor", id],
    queryFn: () => fetchChamberFloor(id!),
    enabled: !!id,
  });
}

export function useCreateChamberFloor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateChamberFloorInput) => createChamberFloor(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", "chamber", variables.chamberId],
      });
    },
  });
}

export function useUpdateChamberFloor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateChamberFloorInput) => updateChamberFloor(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", "chamber", variables.chamberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chamberFloor", variables.id],
      });
    },
  });
}

export function useDeleteChamberFloor(organizationId: string | undefined, chamberId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChamberFloor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", "chamber", chamberId],
      });
    },
  });
}

export function useCreateFloorsForChamber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      chamberId,
      totalFloors,
      totalRacks,
      racksPerRow,
    }: {
      organizationId: string;
      chamberId: string;
      totalFloors: number;
      totalRacks: number;
      racksPerRow: number;
    }) => createFloorsForChamber(organizationId, chamberId, totalFloors, totalRacks, racksPerRow),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chamberFloors", "chamber", variables.chamberId],
      });
    },
  });
}
