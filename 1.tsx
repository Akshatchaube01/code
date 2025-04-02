"use client";

import { Download, TrendingUp, CartesianGrid, Line, LineChart, XAxis, Legend, Brush, YAxis } from "recharts";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/frame/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/frame/ui/dialog";
import { Expand, Shrink, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/frame/ui/card";
import { ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/frame/ui/chart";
import screenfull from "screenfull";

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
  config: ChartConfig;
  data: ChartData[];
}

export function Component1({ title, description, data, config }: LineChartProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [downloadType, setDownloadType] = useState<"svg" | "png" | "pdf">("svg");
  const [brushStartIndex, setBrushStartIndex] = useState(0);
  const [brushEndIndex, setBrushEndIndex] = useState(data.length - 1);
  const cardRef = useRef<HTMLDivElement>(null);
  const chartAreaRef = useRef<HTMLDivElement>(null);

  // Transform the data: Extract only the `value` from each key
  const formattedData = data.map(({ month, ...rest }) => {
    const entry: any = { month };
    Object.keys(rest).forEach((key) => {
      entry[key] = (rest[key] as { label: string; value: number })?.value ?? 0;
    });
    return entry;
  });

  // Extract dynamic keys from the transformed data
  const allKeys = new Set<string>();
  formattedData.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "month") allKeys.add(key);
    });
  });
  const allKeysArray = Array.from(allKeys);

  // Manage visibility of each dataset
  const [hiddenSeries, setHiddenSeries] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(allKeysArray.map((key) => [key, false]))
  );

  // Processed data - hide series if toggled off
  const processedData = formattedData.map((entry) => {
    const updatedEntry: any = { month: entry.month };
    allKeysArray.forEach((key) => {
      updatedEntry[key] = hiddenSeries[key] ? undefined : entry[key];
    });
    return updatedEntry;
  });

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center mt-4">
        {payload.map((entry: any) => {
          const isHidden = hiddenSeries[entry.value];
          return (
            <span
              key={entry.value}
              className="cursor-pointer text-sm font-medium mx-4 transition-all"
              style={{
                color: isHidden ? "gray" : entry.color,
                textDecoration: isHidden ? "line-through" : "none",
              }}
              onClick={() =>
                setHiddenSeries((prev) => ({
                  ...prev,
                  [entry.value]: !prev[entry.value],
                }))
              }
            >
              {entry.value}
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
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent ref={chartAreaRef}>
        <LineChart data={processedData} width={600} height={400} margin={{ left: 12, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis type="number" domain={["auto", "auto"]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Legend content={renderLegend} />
          {allKeysArray.map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              type="linear"
              stroke={`hsl(${(index * 360) / allKeysArray.length}, 70%, 50%)`}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
