import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  Attendance,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  AttendanceEntry,
  AttendanceSummary,
} from "../types";

const client = generateClient<Schema>();

// ==================== Attendance CRUD ====================

export async function fetchAttendanceList(
  organizationId: string
): Promise<Attendance[]> {
  const { data, errors } =
    await client.models.Attendance.listAttendanceByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (a) => a.isActive !== false
  ) as unknown as Attendance[];
}

export async function fetchAttendanceById(id: string): Promise<Attendance> {
  const { data, errors } = await client.models.Attendance.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Attendance record not found");
  }

  return data as unknown as Attendance;
}

export async function fetchAttendanceByEmployee(
  employeeId: string
): Promise<Attendance[]> {
  const { data, errors } =
    await client.models.Attendance.listAttendanceByEmployeeId({
      employeeId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter(
    (a) => a.isActive !== false
  ) as unknown as Attendance[];
}

export async function fetchAttendanceByEmployeeForMonth(
  employeeId: string,
  year: number,
  month: number
): Promise<Attendance[]> {
  const attendances = await fetchAttendanceByEmployee(employeeId);

  // Filter for the specific month
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  return attendances.filter(
    (a) => a.date >= startDate && a.date < endDate
  );
}

export async function fetchAttendanceForDate(
  organizationId: string,
  date: string
): Promise<Attendance[]> {
  const attendances = await fetchAttendanceList(organizationId);
  return attendances.filter((a) => a.date === date);
}

export async function fetchMonthlyAttendance(
  organizationId: string,
  year: number,
  month: number
): Promise<Attendance[]> {
  const attendances = await fetchAttendanceList(organizationId);

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  return attendances.filter(
    (a) => a.date >= startDate && a.date < endDate
  );
}

export async function createAttendance(
  input: CreateAttendanceInput
): Promise<Attendance> {
  const { data, errors } = await client.models.Attendance.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create attendance");
  }

  return data as unknown as Attendance;
}

export async function updateAttendance(
  input: UpdateAttendanceInput
): Promise<Attendance> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Attendance.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update attendance");
  }

  return data as unknown as Attendance;
}

export async function deleteAttendance(id: string): Promise<void> {
  const { errors } = await client.models.Attendance.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Bulk Operations ====================

export async function markAttendance(
  organizationId: string,
  entry: AttendanceEntry,
  markedBy?: string
): Promise<Attendance> {
  // Check if attendance already exists for this employee and date
  const existingList = await fetchAttendanceByEmployee(entry.employeeId);
  const existing = existingList.find((a) => a.date === entry.date);

  if (existing) {
    return updateAttendance({
      id: existing.id,
      status: entry.status,
      leaveType: entry.leaveType,
      remarks: entry.remarks,
      markedBy,
    });
  }

  return createAttendance({
    organizationId,
    employeeId: entry.employeeId,
    date: entry.date,
    status: entry.status,
    leaveType: entry.leaveType,
    remarks: entry.remarks,
    markedBy,
  });
}

export async function markBulkAttendance(
  organizationId: string,
  entries: AttendanceEntry[],
  markedBy?: string
): Promise<Attendance[]> {
  const results: Attendance[] = [];

  for (const entry of entries) {
    const result = await markAttendance(organizationId, entry, markedBy);
    results.push(result);
  }

  return results;
}

export async function markAllPresent(
  organizationId: string,
  employeeIds: string[],
  date: string,
  markedBy?: string
): Promise<Attendance[]> {
  const entries: AttendanceEntry[] = employeeIds.map((employeeId) => ({
    employeeId,
    date,
    status: "PRESENT" as const,
  }));

  return markBulkAttendance(organizationId, entries, markedBy);
}

// ==================== Statistics ====================

export async function getAttendanceSummaryForMonth(
  employeeId: string,
  year: number,
  month: number
): Promise<AttendanceSummary> {
  const attendances = await fetchAttendanceByEmployeeForMonth(
    employeeId,
    year,
    month
  );

  const summary = {
    employeeId,
    employeeName: attendances[0]?.employeeName || "",
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    leaveDays: 0,
    effectiveDays: 0,
  };

  for (const att of attendances) {
    switch (att.status) {
      case "PRESENT":
        summary.presentDays++;
        break;
      case "ABSENT":
        summary.absentDays++;
        break;
      case "HALF_DAY":
        summary.halfDays++;
        break;
      case "LEAVE":
        summary.leaveDays++;
        break;
    }
  }

  summary.effectiveDays =
    summary.presentDays + summary.halfDays * 0.5 + summary.leaveDays;

  return summary;
}

export async function getTodayAttendanceStats(
  organizationId: string
): Promise<{
  present: number;
  absent: number;
  halfDay: number;
  leave: number;
  notMarked: number;
  total: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const attendances = await fetchAttendanceForDate(organizationId, today);

  const stats = {
    present: 0,
    absent: 0,
    halfDay: 0,
    leave: 0,
    notMarked: 0,
    total: attendances.length,
  };

  for (const att of attendances) {
    switch (att.status) {
      case "PRESENT":
        stats.present++;
        break;
      case "ABSENT":
        stats.absent++;
        break;
      case "HALF_DAY":
        stats.halfDay++;
        break;
      case "LEAVE":
        stats.leave++;
        break;
    }
  }

  return stats;
}
