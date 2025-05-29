import React, { FC, useMemo, useState } from "react";
import { PieChart, Pie, Legend, Label, PieLabelRenderProps } from "recharts";

type DataType = {
  metric: string;
  value: number;
  fill: string;
};

type DynamicPieChartProps = {
  data: DataType[];
};

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const totalValue = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  const roundedPercentages = useMemo(() => {
    if (totalValue === 0) return data.map(() => 0);

    const rawPercentages = data.map((d) => (d.value / totalValue) * 100);
    const floored = rawPercentages.map((p) => Math.floor(p));
    const sumFloored = floored.reduce((a, b) => a + b, 0);
    const leftover = 100 - sumFloored;

    if (leftover > 0) {
      let maxIndex = 0;
      let maxValue = rawPercentages[0];
      for (let i = 1; i < rawPercentages.length; i++) {
        if (rawPercentages[i] > maxValue) {
          maxValue = rawPercentages[i];
          maxIndex = i;
        }
      }
      floored[maxIndex] += leftover;
    }

    return floored;
  }, [data, totalValue]);

  const renderPercentageLabel = (props: PieLabelRenderProps & { index?: number }) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    if (index === undefined) return null;

    const RADIAN = Math.PI / 180;
    const radius = ((innerRadius || 0) + (outerRadius || 0)) / 2;
    const x = (cx || 0) + radius * Math.cos(-midAngle! * RADIAN);
    const y = (cy || 0) + radius * Math.sin(-midAngle! * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: "bold" }}
      >
        {roundedPercentages[index]}%
      </text>
    );
  };

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: "auto" }}>
      <div style={{ textAlign: "right", marginBottom: 8 }}>
        <button onClick={() => setIsFullScreen(!isFullScreen)}>
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </div>

      <PieChart width={isFullScreen ? 800 : 400} height={isFullScreen ? 800 : 400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="metric"
          cx="50%"
          cy="50%"
          innerRadius={isFullScreen ? 120 : 80}
          outerRadius={isFullScreen ? 200 : 120}
          fill="#8884d8"
          labelLine={false}
          label={renderPercentageLabel}
          stroke="#fff"
          strokeWidth={2}
        />
        <Legend verticalAlign="bottom" height={36} />
        <Label
          position="center"
          content={({ viewBox }) => {
            if (!viewBox) return null;
            const { cx, cy } = viewBox;
            return (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={24}
                fontWeight="bold"
              >
                {totalValue.toLocaleString()}
              </text>
            );
          }}
        />
      </PieChart>
    </div>
  );
};

export default DynamicPieChart;
