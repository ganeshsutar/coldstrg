import type { TemperatureStatusValue, TemperatureLog } from "../types";
import { TEMPERATURE_THRESHOLDS } from "@/config/constants";

export function getTemperatureStatus(
  temperature: number,
  targetTemp: number = -18
): TemperatureStatusValue {
  const diff = Math.abs(temperature - targetTemp);

  if (temperature > TEMPERATURE_THRESHOLDS.CRITICAL_MAX) {
    return "CRITICAL";
  }
  if (temperature > TEMPERATURE_THRESHOLDS.WARNING_MAX) {
    return "WARNING";
  }
  if (diff <= 3) {
    return "NORMAL";
  }
  if (diff <= 5) {
    return "WARNING";
  }
  return "CRITICAL";
}

export function formatTemperature(temp: number | null | undefined): string {
  if (temp === null || temp === undefined) return "N/A";
  return `${temp.toFixed(1)}°C`;
}

export function getTemperatureColor(status: TemperatureStatusValue): string {
  switch (status) {
    case "NORMAL":
      return "text-green-600 dark:text-green-400";
    case "WARNING":
      return "text-yellow-600 dark:text-yellow-400";
    case "CRITICAL":
      return "text-red-600 dark:text-red-400";
    case "OFFLINE":
      return "text-gray-400 dark:text-gray-500";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function getTemperatureBgColor(status: TemperatureStatusValue): string {
  switch (status) {
    case "NORMAL":
      return "bg-green-100 dark:bg-green-900/30";
    case "WARNING":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "CRITICAL":
      return "bg-red-100 dark:bg-red-900/30";
    case "OFFLINE":
      return "bg-gray-100 dark:bg-gray-800";
    default:
      return "bg-gray-100 dark:bg-gray-800";
  }
}

export function calculateAverageTemperature(logs: TemperatureLog[]): number | null {
  if (logs.length === 0) return null;

  const sum = logs.reduce((acc, log) => {
    const avg = log.avgTemp ?? (log.lowTemp + log.highTemp) / 2;
    return acc + avg;
  }, 0);

  return sum / logs.length;
}

export function getTemperatureTrend(
  logs: TemperatureLog[]
): "rising" | "falling" | "stable" | "unknown" {
  if (logs.length < 2) return "unknown";

  // Sort by date and time
  const sorted = [...logs].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  // Get first and last readings
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstAvg = first.avgTemp ?? (first.lowTemp + first.highTemp) / 2;
  const lastAvg = last.avgTemp ?? (last.lowTemp + last.highTemp) / 2;

  const diff = lastAvg - firstAvg;

  if (Math.abs(diff) < 0.5) return "stable";
  if (diff > 0) return "rising";
  return "falling";
}

export function getTrendIcon(trend: "rising" | "falling" | "stable" | "unknown"): string {
  switch (trend) {
    case "rising":
      return "trending-up";
    case "falling":
      return "trending-down";
    case "stable":
      return "minus";
    default:
      return "help-circle";
  }
}

export function getTrendColor(trend: "rising" | "falling" | "stable" | "unknown"): string {
  switch (trend) {
    case "rising":
      return "text-red-500"; // Rising temp is bad for cold storage
    case "falling":
      return "text-green-500"; // Falling temp is generally good
    case "stable":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
}

export function groupLogsByDate(logs: TemperatureLog[]): Map<string, TemperatureLog[]> {
  const grouped = new Map<string, TemperatureLog[]>();
  for (const log of logs) {
    const existing = grouped.get(log.date) || [];
    existing.push(log);
    grouped.set(log.date, existing);
  }
  return grouped;
}

export function getDailyStats(logs: TemperatureLog[]): {
  date: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
}[] {
  const grouped = groupLogsByDate(logs);
  const stats: { date: string; minTemp: number; maxTemp: number; avgTemp: number }[] = [];

  for (const [date, dayLogs] of grouped) {
    const minTemp = Math.min(...dayLogs.map((l) => l.lowTemp));
    const maxTemp = Math.max(...dayLogs.map((l) => l.highTemp));
    const avgTemp =
      dayLogs.reduce((sum, l) => sum + (l.avgTemp ?? (l.lowTemp + l.highTemp) / 2), 0) /
      dayLogs.length;

    stats.push({ date, minTemp, maxTemp, avgTemp: Math.round(avgTemp * 10) / 10 });
  }

  return stats.sort((a, b) => a.date.localeCompare(b.date));
}

export function isTemperatureAlert(
  currentTemp: number | null | undefined,
  minTemp: number,
  maxTemp: number
): boolean {
  if (currentTemp === null || currentTemp === undefined) return false;
  return currentTemp < minTemp || currentTemp > maxTemp;
}
