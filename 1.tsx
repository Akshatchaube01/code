<Pie
  data={yellowData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={120}
  outerRadius={160}
  label
>
  {yellowData.map((entry, index) => (
    <Cell key={`yellow-${index}`} fill={monthColors[entry.name]} />
  ))}
</Pie>

const monthColors = useMemo(() => {
  const mapping: Record<string, string> = {};

  data?.forEach((d) => {
    if (!mapping[d.month]) { // Fix condition
      mapping[d.month] = getRandomColor();
    }
  });

  return mapping;
}, [data]); // Add `data` as a dependency
