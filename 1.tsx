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
  Brush,
  Text,
} from "recharts";

import { Card, CardContent } from "@/components/frame/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/frame/ui/chart";

type DataType = {
  metric: string;
  value: number;
  fill: string;
};

type NormalizedDataType = DataType & {
  percent: number;
};

type DynamicBarChartProps = {
  data: DataType[];
  config: ChartConfig;
};

const renderWrappedTick = (props: any) => {
  const { x, y, payload, width = 80 } = props;
  const words = (payload.value || "").toString().split(/\s+/);
  const lineHeight = 12;

  return (
    <Text x={x} y={y + 10} width={width} textAnchor="middle" verticalAnchor="start">
      {words.map((word: string, index: number) => (
        <tspan x={x} dy={index === 0 ? 0 : lineHeight} key={index}>
          {word}
        </tspan>
      ))}
    </Text>
  );
};

const DynamicBarChart: FC<DynamicBarChartProps> = ({ data, config }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const totalValue = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  const normalizedData: NormalizedDataType[] = useMemo(() => {
    return data.map((d) => ({
      ...d,
      percent: totalValue > 0 ? (d.value / totalValue) * 100 : 0,
    }));
  }, [data, totalValue]);

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
            <div className={isFullScreen ? "w-full h-[80vh]" : "w-[700px] h-[450px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={normalizedData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <CartesianGrid stroke="#bbb" strokeDasharray="5 5" vertical={false} />
                  <XAxis
                    dataKey="metric"
                    tick={renderWrappedTick}
                    interval={0}
                    height={60}
                    tickMargin={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                    tick={{ fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => {
                      const rawVal = props.payload.value;
                      return [`${rawVal}`, "Value"];
                    }}
                    cursor={{ fill: "rgba(0,0,0,0.1)" }}
                  />
                  <Bar
                    dataKey="percent"
                    fill="#8884d8"
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Brush dataKey="metric" height={20} stroke="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicBarChart;
