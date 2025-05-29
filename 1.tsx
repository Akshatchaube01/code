"use client";

import React, { FC, useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  Legend,
  Label,
  PieLabelRenderProps,
  Tooltip,
  TooltipProps,
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

// Normalize percentages (sum = 100)
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

// Extend TooltipProps with your additional props
type CustomTooltipProps = TooltipProps & {
  originalData: DataType[];
  total: number;
};

const CustomTooltip: FC<CustomTooltipProps> = ({
  active,
  payload,
  originalData,
  total,
}) => {
  if (!active || !payload?.length) return null;

  const { name } = payload[0];
  const actual = originalData.find((d) => d.metric === name);
  if (!actual || !total) return null;

  const percent = ((actual.value / total) * 100).toFixed(1);

  return (
    <div className="bg-white shadow p-2 rounded text-sm border">
      <div className="font-medium">{actual.metric}</div>
      <div>Value: {actual.value}</div>
      <div>Percentage: {percent}%</div>
    </div>
  );
};

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, config }) => {
  const originalTotal = useMemo(
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data]
  );
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
                >
                  <Label
                    content={({ viewBox }) => {
                      const v = viewBox as { cx?: number; cy?: number } | undefined;
                      const cx = typeof v?.cx === "number" ? v.cx : 0;
                      const cy = typeof v?.cy === "number" ? v.cy : 0;

                      return (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan className="fill-foreground text-3xl font-bold">
                            100
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            percent
                          </tspan>
                        </text>
                      );
                    }}
                    wrapperStyle={{ width: "100%", textAlign: "center" }}
                  />
                </Pie>
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                <Tooltip
                  content={(props) => (
                    <CustomTooltip
                      {...props}
                      originalData={data}
                      total={originalTotal}
                    />
                  )}
                />
              </PieChart>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPieChart;
