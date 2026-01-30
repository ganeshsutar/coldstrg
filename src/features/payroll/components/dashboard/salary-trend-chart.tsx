import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlySalaryTrend } from "../../types";

interface SalaryTrendChartProps {
  data: MonthlySalaryTrend[];
}

export function SalaryTrendChart({ data }: SalaryTrendChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.month,
      gross: Math.round(item.totalGross / 1000),
      net: Math.round(item.totalNet / 1000),
      deductions: Math.round(item.totalDeductions / 1000),
    }));
  }, [data]);

  const formatYAxis = (value: number) => `${value}K`;

  const formatTooltip = (value: number) => `₹${value}K`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Trend</CardTitle>
        <CardDescription>
          Monthly salary distribution (in thousands)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Bar
                dataKey="gross"
                name="Gross"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="net"
                name="Net"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="deductions"
                name="Deductions"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
