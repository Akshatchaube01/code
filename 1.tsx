"use client";

import React, { FC, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Legend } from "recharts";

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
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={config}>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[450px] aspect-square">
              <PieChart width={450} height={450}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="metric"
                  innerRadius={100}
                  outerRadius={160}
                  strokeWidth={5}
                  labelLine={false}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                              y={(viewBox.cy || 0) + 24}
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
              </PieChart>
            </div>

            {/* Legend below the chart */}
            <div className="w-full max-w-[450px] mt-4">
              <PieChart width={450} height={100}>
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="middle"
                  wrapperStyle={{ width: "100%", textAlign: "center" }}
                />
              </PieChart>
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DynamicPieChart;
