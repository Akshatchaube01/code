const roundedPercentages = useMemo(() => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return data.map(() => 0);

  const rawPercentages = data.map((item) => (item.value / total) * 100);
  const floored = rawPercentages.map((p) => Math.floor(p));
  const sumFloored = floored.reduce((a, b) => a + b, 0);
  let remainder = 100 - sumFloored;

  const decimalsWithIndex = rawPercentages
    .map((p, i) => ({ dec: p - Math.floor(p), i }))
    .sort((a, b) => b.dec - a.dec);

  for (let j = 0; j < remainder; j++) {
    floored[decimalsWithIndex[j].i]++;
  }

  return floored;
}, [data]);
