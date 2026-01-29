import { useQuery } from "@tanstack/react-query";
import { fetchLoadingsByChamberId } from "../api/loading";
import { fetchUnloadingsByChamberId } from "../api/unloading";
import { fetchChamberFloorsByChamberId } from "../api/chamber-floors";
import type { RackOccupancy, ChamberStats, Chamber, RackStatusValue } from "../types";

interface RackData {
  rackNumber: number;
  floorNumber: number;
  totalQuantity: number;
  amadId?: string;
  amadNo?: number;
  partyName?: string;
  commodityName?: string;
}

export function useRackOccupancy(chamberId: string | undefined) {
  return useQuery({
    queryKey: ["rackOccupancy", chamberId],
    queryFn: async () => {
      if (!chamberId) return [];

      const [loadings, unloadings, floors] = await Promise.all([
        fetchLoadingsByChamberId(chamberId),
        fetchUnloadingsByChamberId(chamberId),
        fetchChamberFloorsByChamberId(chamberId),
      ]);

      // Build a map of rack -> net quantity
      const rackMap = new Map<string, RackData>();

      // Add loadings
      for (const loading of loadings) {
        if (!loading.isActive) continue;
        const key = `${loading.floorNumber}-${loading.rackNumber}`;
        const existing = rackMap.get(key);
        if (existing) {
          existing.totalQuantity += loading.totalQuantity || 0;
        } else {
          rackMap.set(key, {
            rackNumber: loading.rackNumber,
            floorNumber: loading.floorNumber,
            totalQuantity: loading.totalQuantity || 0,
            amadId: loading.amadId,
            amadNo: loading.amadNo || undefined,
            partyName: loading.partyName || undefined,
            commodityName: loading.commodityName || undefined,
          });
        }
      }

      // Subtract unloadings
      for (const unloading of unloadings) {
        if (!unloading.isActive) continue;
        const key = `${unloading.floorNumber}-${unloading.rackNumber}`;
        const existing = rackMap.get(key);
        if (existing) {
          existing.totalQuantity -= unloading.totalQuantity || 0;
        }
      }

      // Convert to RackOccupancy array
      const occupancies: RackOccupancy[] = [];

      // Generate all racks from floors
      for (const floor of floors) {
        if (!floor.isActive) continue;
        for (let rack = floor.fromRack; rack <= floor.toRack; rack++) {
          const key = `${floor.floorNumber}-${rack}`;
          const data = rackMap.get(key);
          const quantity = data?.totalQuantity || 0;

          let status: RackStatusValue = "EMPTY";
          if (quantity > 0 && quantity < 100) {
            status = "PARTIAL";
          } else if (quantity >= 100) {
            status = "FULL";
          }

          occupancies.push({
            chamberId,
            floorNumber: floor.floorNumber,
            rackNumber: rack,
            status,
            totalQuantity: Math.max(0, quantity),
            amadId: data?.amadId,
            amadNo: data?.amadNo,
            partyName: data?.partyName,
            commodityName: data?.commodityName,
          });
        }
      }

      return occupancies;
    },
    enabled: !!chamberId,
  });
}

export function useChamberStats(chamber: Chamber | undefined) {
  const { data: occupancies = [] } = useRackOccupancy(chamber?.id);

  if (!chamber) {
    return null;
  }

  const totalRacks = occupancies.length || chamber.totalRacks || 0;
  const emptyRacks = occupancies.filter((r) => r.status === "EMPTY").length;
  const partialRacks = occupancies.filter((r) => r.status === "PARTIAL").length;
  const fullRacks = occupancies.filter((r) => r.status === "FULL").length;
  const reservedRacks = occupancies.filter((r) => r.status === "RESERVED").length;
  const maintenanceRacks = occupancies.filter((r) => r.status === "MAINTENANCE").length;
  const occupiedRacks = totalRacks - emptyRacks - maintenanceRacks;
  const totalQuantity = occupancies.reduce((sum, r) => sum + r.totalQuantity, 0);

  const stats: ChamberStats = {
    chamberId: chamber.id,
    chamberName: chamber.name,
    totalRacks,
    occupiedRacks,
    emptyRacks,
    partialRacks: partialRacks + fullRacks,
    reservedRacks,
    maintenanceRacks,
    occupancyPercentage: totalRacks > 0 ? Math.round((occupiedRacks / totalRacks) * 100) : 0,
    totalQuantity,
  };

  return stats;
}

export function useAllChambersStats(chambers: Chamber[] | undefined) {
  // This is a simplified version - in production you'd want to batch these queries
  return chambers?.map((chamber) => {
    return {
      chamberId: chamber.id,
      chamberName: chamber.name,
      totalRacks: chamber.totalRacks || 0,
      temperatureStatus: chamber.temperatureStatus,
      currentTemperature: chamber.currentTemperature,
    };
  }) || [];
}
