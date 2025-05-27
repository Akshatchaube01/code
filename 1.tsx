"use client";

import React, { FC, useMemo } from "react";
import { Pie, PieChart, Legend, Label, PieLabelRenderProps } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelRenderProps) => {
    if (
      typeof cx !== "number" ||
      typeof cy !== "number" ||
      typeof innerRadius !== "number" ||
      typeof outerRadius !== "number"
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
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
                    if (
                      viewBox &&
                      typeof viewBox.cx === "number" &&
                      typeof viewBox.cy === "number"
                    ) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 24}
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
