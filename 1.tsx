<Bar
  dataKey="percent"
  fill="#8884d8"
  radius={[5, 5, 0, 0]}
  isAnimationActive={false}
  label={{
    position: "top",
    formatter: (value: number) => `${value.toFixed(0)}%`,
    fontSize: 12,
    fontWeight: 500,
    fill: "#333"
  }}
/>
