"use client";

import React, { FC, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
} from "@/components/frame/ui/card";

import {
  ChartConfig,
  ChartContainer,
} from "@/components/frame/ui/chart";

import { Button } from "@/components/ui/button"; // Adjust path as needed

type DataType = {
  metric: string;
  value: number;   // raw value
  fill: string;
};

type NormalizedDataType = DataType & {
  percent: number; // percentage of total sum (0-100)
};

type DynamicBarChartProps = {
  data: DataType[];
  config: ChartConfig;
};

const DynamicBarChart: FC<DynamicBarChartProps> = ({ data, config }) => {
  // Compute total sum to normalize
  const totalValue = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  // Normalize data to percentage (0-100)
  const normalizedData: NormalizedDataType[] = useMemo(() => {
    return data.map(d => ({
      ...d,
      percent: totalValue > 0 ? (d.value / totalValue) * 100 : 0,
    }));
  }, [data, totalValue]);

  // Fullscreen state toggle
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fixed chart size in normal mode
  const chartWidth = 500;
  const chartHeight = 300;

  return (
    <>
      {isFullScreen ? (
        <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto flex flex-col">
          {/* Exit Fullscreen button fixed on top */}
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsFullScreen(false)} variant="outline">
              Exit Full Screen
            </Button>
          </div>

          <Card className="flex-grow">
            <CardContent className="flex flex-col items-center max-h-[90vh]">
              <ChartContainer config={config}>
                <div className="w-full h-[80vh]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
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
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        type="number"
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.1)" }}
                        formatter={(value: number, name: string, props: any) => {
                          const rawVal = props.payload.value;
                          return [`${rawVal}`, "Value"];
                        }}
                        contentStyle={{ fontSize: 14, fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="percent"
                        fill="#8884d8"
                        radius={[5, 5, 0, 0]}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Fullscreen toggle button in normal mode */}
          <div className="flex justify-end mb-2">
            <Button onClick={() => setIsFullScreen(true)} variant="outline">
              Full Screen
            </Button>
          </div>

          <Card className="items-center">
            <CardContent>
              <ChartContainer config={config}>
                <BarChart
                  width={chartWidth}
                  height={chartHeight}
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
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                    tick={{ fontSize: 12, fontWeight: 600 }}
                    type="number"
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    formatter={(value: number, name: string, props: any) => {
                      const rawVal = props.payload.value;
                      return [`${rawVal}`, "Value"];
                    }}
                    contentStyle={{ fontSize: 14, fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="percent"
                    fill="#8884d8"
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default DynamicBarChart;
