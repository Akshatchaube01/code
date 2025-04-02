const renderChart = (width: number, height: number) => {
  return (
    <LineChart width={width} height={height} data={processedData} margin={{ left: 12, right: 12 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 10)} />
      <YAxis type="number" domain={["auto", "auto"]} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Legend content={renderLegend} />

      {/* Dynamically generate Line components for each key */}
      {allKeysArray.map((key, index) => (
        <Line
          key={key}
          dataKey={key}
          type="linear"
          stroke={`hsl(${(index * 360) / allKeysArray.length}, 70%, 50%)`} // Unique color per line
          strokeWidth={2}
          label={({ x, y, value, index, viewBox }) => {
            const { height } = viewBox;
            const isAbove = index === 0 || y < height / 2;
            return (
              <text x={x} y={isAbove ? y + 15 : y - 15} fill="black" fontSize={12} textAnchor="middle">
                {value}
              </text>
            );
          }}
        />
      ))}

      <Brush
        dataKey="month"
        height={20}
        stroke="gray"
        startIndex={brushStartIndex}
        endIndex={brushEndIndex}
        onChange={(range) => {
          setBrushStartIndex(range.startIndex ?? 0);
          setBrushEndIndex(range.endIndex ?? data.length - 1);
        }}
      />
    </LineChart>
  );
};
