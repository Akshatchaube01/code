"use client";

import React, { FC, useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  PieLabelRenderProps,
} from "recharts";

import { Card, CardContent } from "@/components/frame/ui/card";
import {
  ChartConfig,
  ChartContainer,
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

// Normalize values to sum to 100
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

  const maxIndex = rawPercentages.reduce(
    (maxIdx, item, idx, arr) =>
      item.value > arr[maxIdx].value ? idx : maxIdx,
    0
  );
  floored[maxIndex].percent += remaining;

  return floored.map((item) => ({
    metric: item.metric,
    value: item.percent,
    fill: item.fill,
  }));
}

// Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  originalData,
  total,
}: {
  active?: boolean;
  payload?: any[];
  originalData: DataType[];
  total: number;
}) => {
  if (!active || !payload?.length) return null;

  const { name } = payload[0];
  const actual = originalData.find((d) => d.metric === name);
  if (!actual) return null;

  const percent = ((actual.value / total) * 100).toFixed(1);

  return (
    <div className="bg-white border p-2 rounded shadow text-sm">
      <div className="font-semibold">{actual.metric}</div>
      <div>Value: {actual.value}</div>
      <div>Percentage: {percent}%</div>
    </div>
  );
};

// Custom Legend
const CustomLegend = ({
  data,
  originalData,
  total,
}: {
  data: DataType[];
  originalData: DataType[];
  total: number;
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 mt-4 w-full max-w-md">
      {data.map((item) => {
        const original = originalData.find((d) => d.metric === item.metric);
        const percent = original && total ? ((original.value / total) * 100).toFixed(1) : "0";

        return (
          <div
            key={item.metric}
            className="flex items-center justify-between border p-2 rounded shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }} />
              <span className="font-medium text-sm">{item.metric}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {original?.value} ({percent}%)
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, config }) => {
  const originalTotal = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);
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

  const pieSize = {
    width: isFullScreen ? 800 : 350,
    height: isFullScreen ? 800 : 450,
    outerRadius: isFullScreen ? 200 : 120,
    innerRadius: isFullScreen ? 100 : 60,
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
              <PieChart width={pieSize.width} height={pieSize.height}>
                <Pie
                  data={normalizedData}
                  dataKey="value"
                  nameKey="metric"
                  outerRadius={pieSize.outerRadius}
                  innerRadius={pieSize.innerRadius}
                  strokeWidth={5}
                  labelLine={false}
                  label={renderPercentageLabel}
                />
                <RechartsTooltip
                  content={(props) => (
                    <CustomTooltip
                      {...props}
                      originalData={data}
                      total={originalTotal}
                    />
                  )}
                />
              </PieChart>

              <CustomLegend
                data={normalizedData}
                originalData={data}
                total={originalTotal}
              />
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPieChart;
