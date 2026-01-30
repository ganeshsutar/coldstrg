import { createFileRoute } from "@tanstack/react-router";
import { EmployeeListPage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/employees")({
  component: EmployeeListPage,
});
