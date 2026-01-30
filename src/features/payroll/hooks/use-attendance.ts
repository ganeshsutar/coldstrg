import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAttendanceList,
  fetchAttendanceByEmployee,
  fetchAttendanceByEmployeeForMonth,
  fetchMonthlyAttendance,
  markAttendance,
  markBulkAttendance,
  markAllPresent,
  getAttendanceSummaryForMonth,
  getTodayAttendanceStats,
} from "../api/attendance";
import type { AttendanceEntry } from "../types";

export function useAttendanceList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", organizationId],
    queryFn: () => fetchAttendanceList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useAttendanceByEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["attendance-employee", employeeId],
    queryFn: () => fetchAttendanceByEmployee(employeeId!),
    enabled: !!employeeId,
  });
}

export function useAttendanceByEmployeeForMonth(
  employeeId: string | undefined,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: ["attendance-employee-month", employeeId, year, month],
    queryFn: () => fetchAttendanceByEmployeeForMonth(employeeId!, year, month),
    enabled: !!employeeId && !!year && !!month,
  });
}

export function useMonthlyAttendance(
  organizationId: string | undefined,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: ["attendance-monthly", organizationId, year, month],
    queryFn: () => fetchMonthlyAttendance(organizationId!, year, month),
    enabled: !!organizationId && !!year && !!month,
  });
}

export function useAttendanceSummary(
  employeeId: string | undefined,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: ["attendance-summary", employeeId, year, month],
    queryFn: () => getAttendanceSummaryForMonth(employeeId!, year, month),
    enabled: !!employeeId && !!year && !!month,
  });
}

export function useTodayAttendanceStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["attendance-today-stats", organizationId],
    queryFn: () => getTodayAttendanceStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      entry,
      markedBy,
    }: {
      organizationId: string;
      entry: AttendanceEntry;
      markedBy?: string;
    }) => markAttendance(organizationId, entry, markedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-employee", variables.entry.employeeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-monthly", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-today-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payroll-stats", variables.organizationId],
      });
    },
  });
}

export function useMarkBulkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      entries,
      markedBy,
    }: {
      organizationId: string;
      entries: AttendanceEntry[];
      markedBy?: string;
    }) => markBulkAttendance(organizationId, entries, markedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-monthly", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-today-stats", variables.organizationId],
      });
    },
  });
}

export function useMarkAllPresent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      employeeIds,
      date,
      markedBy,
    }: {
      organizationId: string;
      employeeIds: string[];
      date: string;
      markedBy?: string;
    }) => markAllPresent(organizationId, employeeIds, date, markedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-monthly", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-today-stats", variables.organizationId],
      });
    },
  });
}
