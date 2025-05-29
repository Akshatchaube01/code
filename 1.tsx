const parseNum = (value: string | number) =>
  typeof value === "number" ? value : parseFloat(value);

const inner = parseNum(innerRadius);
const outer = parseNum(outerRadius);
const radius = (inner + outer) / 2;

const x = cx + radius * Math.cos(-midAngle * RADIAN);
const y = cy + radius * Math.sin(-midAngle * RADIAN);
