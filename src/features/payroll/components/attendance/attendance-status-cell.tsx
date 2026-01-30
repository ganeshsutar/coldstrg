import { cn } from "@/lib/utils";
import type { AttendanceStatusValue } from "../../types";
import { getAttendanceStatusLabel } from "../../utils";

interface AttendanceStatusCellProps {
  status?: AttendanceStatusValue | null;
  onClick?: () => void;
  disabled?: boolean;
}

export function AttendanceStatusCell({
  status,
  onClick,
  disabled,
}: AttendanceStatusCellProps) {
  const statusInfo = status ? getAttendanceStatusLabel(status) : null;

  const colorClasses: Record<string, string> = {
    green: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
    red: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
    yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
    gray: "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded text-xs font-semibold transition-colors",
        statusInfo
          ? colorClasses[statusInfo.color]
          : "bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-500",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      title={statusInfo?.label || "Not marked"}
    >
      {statusInfo?.short || "-"}
    </button>
  );
}
