"use client";

import { CartesianGrid, Line, LineChart, XAxis, Legend, YAxis } from "recharts";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/frame/ui/card";
import { ChartTooltip, ChartTooltipContent } from "@/components/frame/ui/chart";

export const description = "A linear line chart";

// Define ChartData interface
interface ChartData {
  month: string;
  [key: string]: { label: string; value: number } | string;
}

// Props for the LineChart component
interface LineChartProps {
  title: string;
  description: string;
  data: ChartData[];
}

export function Component1({ title, description, data }: LineChartProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const chartAreaRef = useRef<HTMLDivElement>(null);

  // Extract labels and values
  const formattedData = data.map(({ month, ...rest }) => {
    const entry: any = { month };
    Object.keys(rest).forEach((key) => {
      entry[key] = (rest[key] as { label: string; value: number })?.value ?? 0;
    });
    return entry;
  });

  // Map keys to labels
  const keyToLabelMap: { [key: string]: string } = {};
  data.forEach(({ month, ...rest }) => {
    Object.keys(rest).forEach((key) => {
      keyToLabelMap[key] = (rest[key] as { label: string; value: number })?.label ?? key;
    });
  });

  // Extract all keys dynamically
  const allKeys = Object.keys(keyToLabelMap);

  // Manage visibility of each dataset
  const [hiddenSeries, setHiddenSeries] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(allKeys.map((key) => [key, false]))
  );

  // Processed data - hide series if toggled off
  const processedData = formattedData.map((entry) => {
    const updatedEntry: any = { month: entry.month };
    allKeys.forEach((key) => {
      updatedEntry[key] = hiddenSeries[key] ? undefined : entry[key];
    });
    return updatedEntry;
  });

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center mt-4">
        {payload.map((entry: any) => {
          const key = entry.value;
          const label = keyToLabelMap[key];
          const isHidden = hiddenSeries[key];

          return (
            <span
              key={key}
              className="cursor-pointer text-sm font-medium mx-4 transition-all"
              style={{
                color: isHidden ? "gray" : entry.color,
                textDecoration: isHidden ? "line-through" : "none",
              }}
              onClick={() =>
                setHiddenSeries((prev) => ({
                  ...prev,
                  [key]: !prev[key],
                }))
              }
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <Card ref={cardRef} className="p-4 w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent ref={chartAreaRef}>
        <LineChart data={processedData} width={600} height={400} margin={{ left: 12, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis type="number" domain={["auto", "auto"]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Legend content={renderLegend} />
          {allKeys.map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              type="linear"
              stroke={`hsl(${(index * 360) / allKeys.length}, 70%, 50%)`}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
