function getRoundedPercentages(data: DataType[]): number[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const rawPercents = data.map((item) => (item.value / total) * 100);

  const rounded = rawPercents.map((p) => Math.floor(p));
  let sumRounded = rounded.reduce((sum, p) => sum + p, 0);
  let remainder = Math.round(100 - sumRounded);

  // Calculate remainders (differences from floor) to distribute the leftover 1% chunks
  const diffs = rawPercents.map((p, index) => ({
    index,
    diff: p - Math.floor(p),
  }));

  // Sort in descending order of decimal leftover
  diffs.sort((a, b) => b.diff - a.diff);

  for (let i = 0; i < remainder; i++) {
    rounded[diffs[i].index]++;
  }

  return rounded;
}
