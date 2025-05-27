"use client";

import { FC } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
} from "@/components/frame/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/frame/ui/chart";

type DataType = {
  metric: string;
  value: number; // actual value
  fill: string;
  percent: number; // percentage value for bar height (0-100)
};

type DynamicBarChartProps = {
  data: DataType[];
  config: ChartConfig;
};

const DynamicBarChart: FC<DynamicBarChartProps> = ({ data, config }) => {
  return (
    <Card className="items-center">
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ left: 0 }}
            width={500}
            height={300}
          >
            <CartesianGrid vertical={false} stroke="#bbb" strokeDasharray="5 5" />
            <XAxis
              dataKey="metric"
              type="category"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) =>
                config[value as keyof typeof config]?.label || value
              }
            />
            <YAxis
              type="number"
              domain={[0, 100]}  // fixed from 0 to 100
              tick={{ fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={true}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const actualValue = payload[0].payload.value;
                return (
                  <ChartTooltipContent>
                    {`Value: ${actualValue}`}
                  </ChartTooltipContent>
                );
              }}
            />
            <Bar
              dataKey="percent"  // bar height based on percentage
              radius={[5, 5, 0, 0]}
              fill="#8884d8"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DynamicBarChart;
