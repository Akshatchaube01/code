"use client";

import React, { FC, useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  Legend,
  Label,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

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

import { Button } from "@/components/ui/button"; // Adjust this import path if needed

type DataType = {
  metric: string;
  value: number;
  fill: string;
};

type DynamicPieChartProps = {
  data: DataType[];
  config: ChartConfig;
};

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, config }) => {
  const totalValue = useMemo(() => {
    return data.reduce((acc, curr) => acc + Number(curr.value), 0);
  }, [data]);

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

    const ir = typeof innerRadius === "number" ? innerRadius : parseFloat(innerRadius);
    const or = typeof outerRadius === "number" ? outerRadius : parseFloat(outerRadius);
    const cxNum = typeof cx === "number" ? cx : parseFloat(cx);
    const cyNum = typeof cy === "number" ? cy : parseFloat(cy);
    const radius = ir + (or - ir) * 0.5;

    const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {Math.round(percent * 100)}%
      </text>
    );
  };

  return (
    <div
      className={
        isFullScreen
          ? "fixed inset-0 bg-white z-50 p-6 overflow-hidden h-screen m-0"
          : ""
      }
    >
      <div className="flex justify-end mb-2">
        <Button onClick={() => setIsFullScreen(!isFullScreen)} variant="outline">
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center max-h-[850px]">
          <ChartContainer config={config}>
            <div
              className={
                isFullScreen
                  ? "w-screen h-screen"
                  : "w-[350px] h-[450px]"
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="metric"
                    innerRadius={100}
                    outerRadius={160}
                    strokeWidth={5}
                    labelLine={false}
                    label={renderPercentageLabel}
                  >
                    <Label
                      content={({ viewBox }) => {
                        const v = viewBox as { cx?: number; cy?: number };
                        const cx = typeof v.cx === "number" ? v.cx : 0;
                        const cy = typeof v.cy === "number" ? v.cy : 0;

                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={cx}
                              y={cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalValue.toLocaleString()}
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 24}
                              className="fill-muted-foreground text-sm"
                            >
                              value
                            </tspan>
                          </text>
                        );
                      }}
                    />
                  </Pie>
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ width: "100%", textAlign: "center" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPieChart;
