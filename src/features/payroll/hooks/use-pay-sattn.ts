import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaySATTNList,
  fetchPaySATTNById,
  fetchPaySATTNByEmployee,
  fetchPaySATTNForMonth,
  processSalaryForEmployee,
  processSalaryForAllEmployees,
  approveSalary,
  markSalaryPaid,
  cancelSalary,
  getMonthlySalaryStats,
} from "../api/pay-sattn";
import type { Employee } from "../types";

export function usePaySATTNList(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["pay-sattn", organizationId],
    queryFn: () => fetchPaySATTNList(organizationId!),
    enabled: !!organizationId,
  });
}

export function usePaySATTN(salaryId: string | undefined) {
  return useQuery({
    queryKey: ["pay-sattn-detail", salaryId],
    queryFn: () => fetchPaySATTNById(salaryId!),
    enabled: !!salaryId,
  });
}

export function usePaySATTNByEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["pay-sattn-employee", employeeId],
    queryFn: () => fetchPaySATTNByEmployee(employeeId!),
    enabled: !!employeeId,
  });
}

export function usePaySATTNForMonth(
  organizationId: string | undefined,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: ["pay-sattn-month", organizationId, year, month],
    queryFn: () => fetchPaySATTNForMonth(organizationId!, year, month),
    enabled: !!organizationId && !!year && !!month,
  });
}

export function useMonthlySalaryStats(
  organizationId: string | undefined,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: ["salary-stats-month", organizationId, year, month],
    queryFn: () => getMonthlySalaryStats(organizationId!, year, month),
    enabled: !!organizationId && !!year && !!month,
  });
}

export function useProcessSalary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      employee,
      year,
      month,
      processedBy,
    }: {
      organizationId: string;
      employee: Employee;
      year: number;
      month: number;
      processedBy?: string;
    }) => processSalaryForEmployee(organizationId, employee, year, month, processedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn-month", variables.organizationId, variables.year, variables.month],
      });
      queryClient.invalidateQueries({
        queryKey: ["salary-stats-month", variables.organizationId, variables.year, variables.month],
      });
      queryClient.invalidateQueries({
        queryKey: ["payroll-stats", variables.organizationId],
      });
    },
  });
}

export function useProcessAllSalaries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      employees,
      year,
      month,
      processedBy,
    }: {
      organizationId: string;
      employees: Employee[];
      year: number;
      month: number;
      processedBy?: string;
    }) => processSalaryForAllEmployees(organizationId, employees, year, month, processedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn-month", variables.organizationId, variables.year, variables.month],
      });
      queryClient.invalidateQueries({
        queryKey: ["salary-stats-month", variables.organizationId, variables.year, variables.month],
      });
      queryClient.invalidateQueries({
        queryKey: ["payroll-stats", variables.organizationId],
      });
    },
  });
}

export function useApproveSalary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      salaryId,
      approvedBy,
    }: {
      organizationId: string;
      salaryId: string;
      approvedBy: string;
    }) => approveSalary(salaryId, approvedBy),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn-detail", variables.salaryId],
      });
    },
  });
}

export function useMarkSalaryPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      salaryId,
      paidBy,
      paymentMode,
      paymentRef,
    }: {
      organizationId: string;
      salaryId: string;
      paidBy: string;
      paymentMode?: string;
      paymentRef?: string;
    }) => markSalaryPaid(salaryId, paidBy, paymentMode, paymentRef),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn-detail", variables.salaryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payroll-stats", variables.organizationId],
      });
    },
  });
}

export function useCancelSalary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      salaryId,
    }: {
      organizationId: string;
      salaryId: string;
    }) => cancelSalary(salaryId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pay-sattn-detail", variables.salaryId],
      });
    },
  });
}
