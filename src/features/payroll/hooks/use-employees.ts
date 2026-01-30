import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployeeList,
  fetchEmployeeById,
  fetchEmployeesByPost,
  fetchActiveEmployees,
  createEmployeeFromForm,
  updateEmployee,
  deleteEmployee,
  getNextEmployeeCodeFromDb,
  getEmployeeStats,
} from "../api/employees";
import type { EmployeeFormInput, UpdateEmployeeInput } from "../types";

export function useEmployeeList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["employees", organizationId],
    queryFn: () => fetchEmployeeList(organizationId!),
    enabled: !!organizationId,
  });
}

export function useEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["employee-detail", employeeId],
    queryFn: () => fetchEmployeeById(employeeId!),
    enabled: !!employeeId,
  });
}

export function useEmployeesByPost(
  organizationId: string | undefined,
  postId: string | undefined
) {
  return useQuery({
    queryKey: ["employees-by-post", organizationId, postId],
    queryFn: () => fetchEmployeesByPost(organizationId!, postId!),
    enabled: !!organizationId && !!postId,
  });
}

export function useActiveEmployees(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["employees-active", organizationId],
    queryFn: () => fetchActiveEmployees(organizationId!),
    enabled: !!organizationId,
  });
}

export function useNextEmployeeCode(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["next-employee-code", organizationId],
    queryFn: () => getNextEmployeeCodeFromDb(organizationId!),
    enabled: !!organizationId,
  });
}

export function useEmployeeStats(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["employee-stats", organizationId],
    queryFn: () => getEmployeeStats(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      formInput,
    }: {
      organizationId: string;
      formInput: EmployeeFormInput;
    }) => createEmployeeFromForm(organizationId, formInput),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employees", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-employee-code", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["employee-stats", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payroll-stats", variables.organizationId],
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEmployeeInput) => updateEmployee(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["employee-detail", variables.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["employee-stats"],
      });
    },
  });
}

export function useDeleteEmployee(organizationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["employee-stats", organizationId],
      });
    },
  });
}
