function convertProjectStatusToMetrics(data: Record<string, number>) {
  const colorVars = [
    "var(--color-chrome)",
    "var(--color-safari)",
    "var(--color-firefox)",
    "var(--color-edge)",
    "var(--color-opera)",
    "var(--color-brave)",
    "var(--color-vivaldi)",
  ];

  const entries = Object.entries(data);
  
  return entries.map(([status, value], index) => ({
    metric: status,
    value,
    fill: colorVars[index % colorVars.length],
  }));
}
