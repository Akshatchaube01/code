"use client";

import { FC, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
} from "@/components/frame/ui/card";

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

const DynamicBarChart: FC<DynamicBarChartProps> = ({ data, config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalValue = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  const normalizedData: NormalizedDataType[] = useMemo(() => {
    return data.map(d => ({
      ...d,
      percent: totalValue > 0 ? (d.value / totalValue) * 100 : 0,
    }));
  }, [data, totalValue]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change (in case user presses ESC)
  // Update state accordingly
  React.useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  return (
    <Card className="items-center" ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          padding: '6px 12px',
          cursor: 'pointer',
          borderRadius: 4,
          border: '1px solid #888',
          background: isFullscreen ? '#eee' : '#fff',
        }}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
      <CardContent style={{ width: isFullscreen ? '100vw' : 500, height: isFullscreen ? '100vh' : 300 }}>
        <ChartContainer config={config}>
          <BarChart
            width={isFullscreen ? window.innerWidth : 500}
            height={isFullscreen ? window.innerHeight - 50 : 300} // leave some space for button
            data={normalizedData}
            margin={{ left: 0 }}
            layout="horizontal"
          >
            <CartesianGrid stroke="#bbb" strokeDasharray="5 5" vertical={false} />
            <XAxis
              dataKey="metric"
              tickFormatter={(value) => config[value as keyof typeof config]?.label || value}
              tickLine={true}
              axisLine={true}
              tickMargin={10}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              tick={{ fontSize: 12, fontWeight: 600 }}
              type="number"
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              formatter={(value: number, name: string, props: any) => {
                const rawVal = props.payload.value;
                return [`${rawVal}`, 'Value'];
              }}
              contentStyle={{ fontSize: 14, fontWeight: 600 }}
            />
            <Bar
              dataKey="percent"
              fill="#8884d8"
              radius={[5, 5, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DynamicBarChart;
