import { useMemo } from "react";
import { AttendanceStatusCell } from "./attendance-status-cell";
import type { Employee, Attendance, AttendanceStatusValue } from "../../types";
import { getMonthDates, isWeekend, cycleAttendanceStatus } from "../../utils";

interface AttendanceCalendarGridProps {
  employees: Employee[];
  attendanceRecords: Attendance[];
  year: number;
  month: number;
  onStatusChange: (
    employeeId: string,
    date: string,
    status: AttendanceStatusValue
  ) => void;
  isLoading?: boolean;
}

export function AttendanceCalendarGrid({
  employees,
  attendanceRecords,
  year,
  month,
  onStatusChange,
  isLoading,
}: AttendanceCalendarGridProps) {
  const dates = useMemo(() => getMonthDates(year, month), [year, month]);

  const attendanceMap = useMemo(() => {
    const map: Record<string, Record<string, Attendance>> = {};
    for (const record of attendanceRecords) {
      if (!map[record.employeeId]) {
        map[record.employeeId] = {};
      }
      map[record.employeeId][record.date] = record;
    }
    return map;
  }, [attendanceRecords]);

  const handleCellClick = (employee: Employee, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const currentRecord = attendanceMap[employee.id]?.[dateStr];
    const currentStatus = currentRecord?.status || "PRESENT";
    const newStatus = cycleAttendanceStatus(currentStatus) as AttendanceStatusValue;
    onStatusChange(employee.id, dateStr, newStatus);
  };

  const today = new Date().toISOString().split("T")[0];
  const isFutureDate = (date: Date) => date.toISOString().split("T")[0] > today;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-background border-b px-3 py-2 text-left font-medium min-w-[150px]">
              Employee
            </th>
            {dates.map((date) => {
              const dayNum = date.getDate();
              const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
              const isWknd = isWeekend(date);
              return (
                <th
                  key={dayNum}
                  className={`border-b px-1 py-2 text-center font-medium min-w-[36px] ${
                    isWknd ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{dayName}</div>
                  <div>{dayNum}</div>
                </th>
              );
            })}
            <th className="border-b px-3 py-2 text-center font-medium min-w-[60px]">
              P
            </th>
            <th className="border-b px-3 py-2 text-center font-medium min-w-[60px]">
              A
            </th>
            <th className="border-b px-3 py-2 text-center font-medium min-w-[60px]">
              L
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const employeeAttendance = attendanceMap[employee.id] || {};
            let presentCount = 0;
            let absentCount = 0;
            let leaveCount = 0;

            return (
              <tr key={employee.id} className="hover:bg-muted/30">
                <td className="sticky left-0 z-10 bg-background border-b px-3 py-2">
                  <div className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {employee.code}
                  </div>
                </td>
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const record = employeeAttendance[dateStr];
                  const isWknd = isWeekend(date);
                  const isFuture = isFutureDate(date);

                  // Count for summary
                  if (record?.status === "PRESENT") presentCount++;
                  else if (record?.status === "HALF_DAY") {
                    presentCount += 0.5;
                  } else if (record?.status === "ABSENT") absentCount++;
                  else if (record?.status === "LEAVE") leaveCount++;

                  // Auto-mark weekends
                  const effectiveStatus = isWknd
                    ? "WEEKLY_OFF"
                    : record?.status;

                  return (
                    <td
                      key={dateStr}
                      className={`border-b px-1 py-1 text-center ${
                        isWknd ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex justify-center">
                        <AttendanceStatusCell
                          status={effectiveStatus}
                          onClick={() => handleCellClick(employee, date)}
                          disabled={isWknd || isFuture}
                        />
                      </div>
                    </td>
                  );
                })}
                <td className="border-b px-3 py-2 text-center font-medium text-green-600">
                  {presentCount}
                </td>
                <td className="border-b px-3 py-2 text-center font-medium text-red-600">
                  {absentCount}
                </td>
                <td className="border-b px-3 py-2 text-center font-medium text-blue-600">
                  {leaveCount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {employees.length === 0 && (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          No employees found
        </div>
      )}
    </div>
  );
}
