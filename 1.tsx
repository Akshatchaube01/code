"use client";

import React, { FC, useMemo } from "react";
import {
  Pie,
  PieChart,
  Legend,
  Label,
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
    const radius = ir + (or - ir) * 0.5;

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
        {Math.round(percent * 100)}%
      </text>
    );
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center max-h-[850px]">
        <ChartContainer config={config}>
          <div className="flex flex-col items-center max-h-[850px]">
            <PieChart width={350} height={450}>
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
                    if (typeof v?.cx === "number" && typeof v?.cy === "number") {
                      return (
                        <text
                          x={v.cx}
                          y={v.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={v.cx}
                            y={v.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan
                            x={v.cx}
                            y={v.cy + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            value
                          </tspan>
                        </text>
                      );
                    }
                    return null;
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
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DynamicPieChart;
