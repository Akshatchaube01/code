"use client";

import { FC, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
} from "@/components/frame/ui/card";

import {
  ChartConfig,
  ChartContainer,
} from "@/components/frame/ui/chart";

type DataType = {
  metric: string;
  value: number;   // raw value
  fill: string;
};

type NormalizedDataType = DataType & {
  percent: number; // computed percentage for bar height
};

type DynamicBarChartProps = {
  data: DataType[];
  config: ChartConfig;
};

const DynamicBarChart: FC<DynamicBarChartProps> = ({ data, config }) => {
  // Compute max value to normalize
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);

  // Normalize data to percentage (0-100)
  const normalizedData: NormalizedDataType[] = useMemo(() => {
    return data.map(d => ({
      ...d,
      percent: maxValue > 0 ? (d.value / maxValue) * 100 : 0,
    }));
  }, [data, maxValue]);

  return (
    <Card className="items-center">
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            width={500}
            height={300}
            data={normalizedData}
            margin={{ left: 0 }}
            layout="horizontal"
          >
            <CartesianGrid stroke="#bbb" strokeDasharray="5 5" vertical={false} />
            <XAxis
              dataKey="metric"
              tickFormatter={(value) => config[value as keyof typeof config]?.label || value}
              tickLine={true}
              axisLine={true}
              tickMargin={10}
            />
            <YAxis
              domain={[0, 100]}    // Y axis fixed 0-100%
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12, fontWeight: 600 }}
              type="number"
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              // Show actual raw value in tooltip
              formatter={(value: number, name: string, props: any) => {
                // value here is the percent, get raw value from payload
                const rawVal = props.payload.value;
                return [`${rawVal}`, 'Value'];
              }}
              contentStyle={{ fontSize: 14, fontWeight: 600 }}
            />
            <Bar
              dataKey="percent"   // bar height = normalized %
              fill="#8884d8"
              radius={[5, 5, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DynamicBarChart;
