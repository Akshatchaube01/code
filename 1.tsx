"use client";

import React, { FC, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Legend,
  Label,
  PieLabelRenderProps,
} from "recharts";

import { Card, CardContent } from "@/components/frame/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
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

// Function to calculate percentages that sum exactly to 100
function getRoundedPercentages(data: DataType[]): number[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return data.map(() => 0);

  // Calculate raw percentages
  const rawPercentages = data.map((item) => (item.value / total) * 100);

  // Floor all percentages
  let floored = rawPercentages.map((p) => Math.floor(p));

  // Calculate how much is missing due to flooring
  let missing = 100 - floored.reduce((a, b) => a + b, 0);

  // Distribute the missing by adding 1 to the largest decimals
  // Create array of decimals with their indexes
  const decimalsWithIndex = rawPercentages
    .map((p, i) => ({ dec: p - Math.floor(p), i }))
    .sort((a, b) => b.dec - a.dec);

  for (let j = 0; j < missing; j++) {
    floored[decimalsWithIndex[j].i]++;
  }

  return floored;
}

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, config }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const totalValue = useMemo(() => {
    return data.reduce((acc, curr) => acc + Number(curr.value), 0);
  }, [data]);

  const roundedPercentages = useMemo(() => getRoundedPercentages(data), [data]);

  const renderPercentageLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: PieLabelRenderProps & { index?: number }) => {
    if (index === undefined) return null;

    const RADIAN = Math.PI / 180;
    const radius = ((Number(innerRadius) || 0) + (Number(outerRadius) || 0)) / 2;
    const x = (Number(cx) || 0) + radius * Math.cos(-midAngle * RADIAN);
    const y = (Number(cy) || 0) + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${roundedPercentages[index]}%`}
      </text>
    );
  };

  return (
    <div className={isFullScreen ? "fixed inset-0 bg-white z-50 p-6 overflow-auto" : ""}>
      <div className="flex justify-end mb-2">
        <Button onClick={() => setIsFullScreen(!isFullScreen)} variant="outline">
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
                  data={data}
                  dataKey="value"
                  nameKey="metric"
                  innerRadius={isFullScreen ? 120 : 100}
                  outerRadius={isFullScreen ? 200 : 160}
                  strokeWidth={5}
                  labelLine={false}
                  label={(props) => renderPercentageLabel({ ...props, index: props.index })}
                >
                  <Label
                    content={({ viewBox }) => {
                      const cx = typeof viewBox?.cx === "number" ? viewBox.cx : 0;
                      const cy = typeof viewBox?.cy === "number" ? viewBox.cy : 0;
                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan className="fill-foreground text-3xl font-bold">
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
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPieChart;
