"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Amad } from "../../types";

interface AmadChartProps {
  amadList: Amad[];
}

const chartConfig = {
  inward: {
    label: "Daily Inward",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type TimeRange = "90d" | "30d" | "7d";

export function AmadChart({ amadList }: AmadChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const chartData = useMemo(() => {
    const now = new Date();
    let daysToSubtract = 30;
    if (timeRange === "90d") daysToSubtract = 90;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Group by date
    const grouped: Record<string, number> = {};
    amadList.forEach((a) => {
      const date = a.date;
      if (date && new Date(date) >= startDate) {
        grouped[date] = (grouped[date] || 0) + (a.totalPackets ?? 0);
      }
    });

    return Object.entries(grouped)
      .map(([date, inward]) => ({ date, inward }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [amadList, timeRange]);

  return (
    <Card className="@container/chart">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Inward Trend</CardTitle>
          <CardDescription>
            Daily incoming packets (Amad)
          </CardDescription>
        </div>
        <div className="flex items-center px-6 py-4">
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger
              className="w-[140px] rounded-lg"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillInward" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-inward)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-inward)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inward"
              type="natural"
              fill="url(#fillInward)"
              stroke="var(--color-inward)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
