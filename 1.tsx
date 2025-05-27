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
  value: number;
  fill: string;
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
              dataKey="value"
              type="number"
              tick={{ fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `${value}%`} // Show % on Y axis
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              radius={[5, 5, 0, 0]}
              // If you want to show label on top of bars, uncomment below
              // label={{ position: "top", formatter: (value: any) => `${value}%` }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DynamicBarChart;
