"use client";

import React, { FC, useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  Legend,
  Label,
  PieLabelRenderProps,
  Tooltip as RechartsTooltip,
} from "recharts";

import { Card, CardContent } from "@/components/frame/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/frame/ui/chart";

import { Button } from "@/components/frame/ui/button";

type DataType = {
  metric: string;
  value: number;
  fill: string;
};

type DynamicPieChartProps = {
  data: DataType[];
  config: ChartConfig;
};

// Adjust data to make the percentage sum exactly 100
function normalizeData(data: DataType[]): DataType[] {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  if (total === 0) return data;

  const rawPercentages = data.map((item) => ({
    ...item,
    rawPercent: (item.value / total) * 100,
  }));

  const floored = rawPercentages.map((item) => ({
    ...item,
    percent: Math.floor(item.rawPercent),
  }));

  let flooredSum = floored.reduce((acc, item) => acc + item.percent, 0);
  const remaining = 100 - flooredSum;

  // Find the slice with the largest original value to give the remainder
  const maxIndex = rawPercentages.reduce(
    (maxIdx, item, idx, arr) =>
      item.value > arr[maxIdx].value ? idx : maxIdx,
    0
  );
  floored[maxIndex].percent += remaining;

  return floored.map((item) => ({
    ...item,
    value: item.percent, // now percent becomes the value
  }));
}

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, config }) => {
  const normalizedData = useMemo(() => normalizeData(data), [data]);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const renderPercentageLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    const radius = (innerRadius + outerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <div className={isFullScreen ? "fixed inset-0 bg-white z-50 p-6 overflow-auto" : ""}>
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setIsFullScreen(!isFullScreen)}
          variant="outline"
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center max-h-[850px]">
          <ChartContainer config={config}>
            <div className="flex flex-col items-center max-h-[850px]">
              <PieChart width={isFullScreen ? 800 : 350} height={isFullScreen ? 800 : 450}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Pie
                  data={normalizedData}
                  dataKey="value"
                  nameKey="metric"
                  outerRadius={isFullScreen ? 320 : 160}
                  strokeWidth={5}
                  labelLine={false}
                  label={renderPercentageLabel}
                >
                  <Label
                    content={({ viewBox }) => {
                      const { cx = 0, cy = 0 } = viewBox ?? {};
                      const total = 100;
                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan className="fill-foreground text-3xl font-bold">
                            {total}
                          </tspan>
                          <tspan x={cx} y={cy + 24} className="fill-muted-foreground text-sm">
                            value
                          </tspan>
                        </text>
                      );
                    }}
                    wrapperStyle={{ width: "100%", textAlign: "center" }}
                  />
                </Pie>
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPieChart;
