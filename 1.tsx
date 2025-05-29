"use client";

import React, { FC, useMemo, useState } from "react";
import { Pie, PieChart, Legend, Label, PieLabelRenderProps } from "recharts";
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

// Util: Round percentages so that total = 100%
function getRoundedPercentages(data: DataType[]): number[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const rawPercents = data.map((item) => (item.value / total) * 100);

  const floored = rawPercents.map((p) => Math.floor(p));
  const totalFloored = floored.reduce((sum, p) => sum + p, 0);
  let remainder = 100 - totalFloored;

  const remainders = rawPercents.map((p, i) => ({
    index: i,
    diff: p - floored[i],
  }));

  remainders.sort((a, b) => b.diff - a.diff); // prioritize slices with largest remainder

  for (let i = 0; i < remainder; i++) {
    floored[remainders[i].index]++;
  }

  return floored;
}

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, config }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const totalValue = useMemo(
    () => data.reduce((acc, curr) => acc + Number(curr.value), 0),
    [data]
  );

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
    const radius = (Number(innerRadius) + Number(outerRadius)) / 2;
    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

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
                  outerRadius={isFullScreen ? 180 : 140}
                  strokeWidth={5}
                  labelLine={false}
                  label={(props) => renderPercentageLabel({ ...props, index: props.index })}
                >
                  <Label
                    content={({ viewBox }) => {
                      const { cx = 0, cy = 0 } = viewBox || {};
                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan className="fill-foreground text-3xl font-bold">
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan x={cx} y={cy + 24} className="fill-muted-foreground text-sm">
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
