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
} from "recharts";
import { Card, CardContent } from "@/components/frame/ui/card";
import { ChartConfig, ChartContainer } from "@/components/frame/ui/chart";
import { Button } from "@/components/frame/ui/button";

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

const DynamicBarChart: FC<DynamicBarChartProps> = ({ data, config }) => {
  const [isFullscreen, setIsFullScreen] = useState(false);

  const totalValue = useMemo(
    () => data.reduce((acc, d) => acc + d.value, 0),
    [data]
  );

  const normalizedData: NormalizedDataType[] = useMemo(() => {
    return data.map((d) => ({
      ...d,
      percent: totalValue > 0 ? (d.value / totalValue) * 100 : 0,
    }));
  }, [data, totalValue]);

  const chartWidth = 800;
  const chartHeight = 500;

  const maxLabelLength = useMemo(() => {
    return data.reduce((max, d) => {
      const rawLabel =
        config[d.metric as keyof typeof config]?.label || d.metric;
      const label = String(rawLabel);
      return Math.max(max, label.length);
    }, 0);
  }, [data, config]);

  const axisHeight = Math.min(20 + maxLabelLength * 7, 340);
  const labelFontSize = maxLabelLength > 10 ? 10 : 12;

  const renderChart = (width: number | string, height: number | string) => (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={normalizedData}
        margin={{ top: 40, left: 0 }}
        layout="horizontal"
      >
        <CartesianGrid stroke="#bbb" strokeDasharray="5 5" vertical={false} />
        <XAxis
          dataKey="metric"
          tickFormatter={(value) =>
            config[value as keyof typeof config]?.label || value
          }
          tickLine
          angle={-90}
          axisLine
          tickMargin={10}
          textAnchor="end"
          height={axisHeight}
          tick={{ fontSize: 12, fontWeight: 700 }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value.toFixed(0)}%`}
          tick={{ fontSize: 12, fontWeight: 600 }}
          type="number"
        />
        <Brush dataKey="metric" height={30} stroke="#8884d8" />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.1)" }}
          formatter={(value: number, name: string, props: any) => {
            const rawValue = props?.payload?.value;
            return [rawValue.toFixed(2), "Actual Value"];
          }}
          contentStyle={{ fontSize: 14, fontWeight: 600 }}
        />
        <Bar
          dataKey="percent"
          fill="#8884d8"
          radius={[5, 5, 0, 0]}
          isAnimationActive={false}
          label={{
            position: "top",
            angle: -90,
            dy: -20,
            formatter: (value: number) => `${value.toFixed(2)}%`,
            fontSize: labelFontSize,
            fontWeight: 500,
            fill: "#333",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {isFullscreen ? (
        <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto flex flex-col">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsFullScreen(false)} variant="outline">
              Exit Full Screen
            </Button>
          </div>
          <Card className="flex-grow">
            <CardContent className="flex flex-col items-center max-h-[100vh]">
              <ChartContainer config={config}>
                <div className="w-full h-[88vh]">{renderChart("100%", "100%")}</div>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-2">
            <Button onClick={() => setIsFullScreen(true)} variant="outline">
              Full Screen
            </Button>
          </div>
          <Card className="items-center">
            <CardContent>
              <ChartContainer config={config}>
                {renderChart(chartWidth, chartHeight)}
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default DynamicBarChart;
