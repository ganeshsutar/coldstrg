import { createFileRoute } from "@tanstack/react-router";
import { AttendancePage } from "@/features/payroll";

export const Route = createFileRoute("/_authenticated/payroll/attendance")({
  component: AttendancePage,
});
