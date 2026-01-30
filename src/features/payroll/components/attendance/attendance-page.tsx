import { useState, useMemo } from "react";
import { useOrganization } from "@/features/organizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";
import { MonthYearSelector } from "./month-year-selector";
import { AttendanceCalendarGrid } from "./attendance-calendar-grid";
import {
  useActiveEmployees,
  useMonthlyAttendance,
  useMarkAttendance,
  useMarkAllPresent,
} from "../../hooks";
import type { AttendanceStatusValue } from "../../types";

export function AttendancePage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: employees = [], isLoading: employeesLoading } =
    useActiveEmployees(organizationId);
  const { data: attendanceRecords = [], isLoading: attendanceLoading } =
    useMonthlyAttendance(organizationId, year, month);

  const markAttendanceMutation = useMarkAttendance();
  const markAllPresentMutation = useMarkAllPresent();

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleStatusChange = async (
    employeeId: string,
    date: string,
    status: AttendanceStatusValue
  ) => {
    if (!organizationId) return;

    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    try {
      await markAttendanceMutation.mutateAsync({
        organizationId,
        entry: {
          employeeId,
          date,
          status,
        },
      });
    } catch (error) {
      console.error("Failed to update attendance", error);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!organizationId) return;

    const today = new Date().toISOString().split("T")[0];
    const employeeIds = employees.map((e) => e.id);

    try {
      await markAllPresentMutation.mutateAsync({
        organizationId,
        employeeIds,
        date: today,
      });
      console.log("All employees marked as present");
    } catch (error) {
      console.error("Failed to mark attendance", error);
    }
  };

  const attendanceStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = attendanceRecords.filter((r) => r.date === today);

    return {
      present: todayRecords.filter((r) => r.status === "PRESENT").length,
      absent: todayRecords.filter((r) => r.status === "ABSENT").length,
      leave: todayRecords.filter((r) => r.status === "LEAVE").length,
      halfDay: todayRecords.filter((r) => r.status === "HALF_DAY").length,
    };
  }, [attendanceRecords]);

  const isLoading = employeesLoading || attendanceLoading;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Mark and track employee attendance
          </p>
        </div>
        <Button onClick={handleMarkAllPresent} disabled={isLoading}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Present Today
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {attendanceStats.present}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {attendanceStats.absent}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {attendanceStats.leave}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Half Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {attendanceStats.halfDay}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <MonthYearSelector
          year={year}
          month={month}
          onChange={handleMonthChange}
        />
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900/30" />
            <span>Half Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30" />
            <span>Leave</span>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <Card>
        <CardContent className="p-0">
          <AttendanceCalendarGrid
            employees={employees}
            attendanceRecords={attendanceRecords}
            year={year}
            month={month}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
