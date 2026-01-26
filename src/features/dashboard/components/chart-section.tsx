"use client";

import { useState, useMemo } from "react";
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
  ChartLegend,
  ChartLegendContent,
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
import type { ChartDataPoint } from "../types";

interface ChartSectionProps {
  data: ChartDataPoint[];
}

const chartConfig = {
  amad: {
    label: "Amad (Incoming)",
    color: "var(--chart-1)",
  },
  nikasi: {
    label: "Nikasi (Outgoing)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type TimeRange = "90d" | "30d" | "7d";

export function ChartSection({ data }: ChartSectionProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const filteredData = useMemo(() => {
    const now = new Date();
    let daysToSubtract = 30;
    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [data, timeRange]);

  return (
    <Card className="@container/chart">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Stock Activity</CardTitle>
          <CardDescription>
            Daily incoming (Amad) and outgoing (Nikasi) stock trends
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAmad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amad)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amad)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNikasi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-nikasi)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-nikasi)"
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
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="nikasi"
              type="natural"
              fill="url(#fillNikasi)"
              stroke="var(--color-nikasi)"
              stackId="a"
            />
            <Area
              dataKey="amad"
              type="natural"
              fill="url(#fillAmad)"
              stroke="var(--color-amad)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
