const maxLabelLength = useMemo(() => {
  return data.reduce((max, d) => {
    const label = config[d.metric as keyof typeof config]?.label || d.metric;
    return Math.max(max, label.length);
  }, 0);
}, [data, config]);

const axisHeight = Math.min(20 + maxLabelLength * 7, 120);  // Cap height to avoid extreme cases
const labelFontSize = maxLabelLength > 10 ? 10 : 12;

<XAxis
  dataKey="metric"
  tickFormatter={(value) => config[value as keyof typeof config]?.label || value}
  tickLine={true}
  axisLine={true}
  tickMargin={10}
  interval={0}
  height={axisHeight} // Dynamically adjusted height
  tick={{
    angle: -90,
    textAnchor: "end",
    fontSize: labelFontSize,
    fontWeight: 500,
  }}
/>

