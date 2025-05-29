const renderPercentageLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
}: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;

  // Helper to parse string | number into number safely
  const parseNum = (val: string | number) =>
    typeof val === "number" ? val : parseFloat(val);

  const inner = parseNum(innerRadius);
  const outer = parseNum(outerRadius);

  const radius = (inner + outer) / 2;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {/* Display percentage as rounded */}
      {`${Math.round((outer - inner) / (outer + inner) * 100)}%`}
    </text>
  );
};
