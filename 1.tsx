function getRoundedPercentages(data: DataType[]): number[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const rawPercentages = data.map((item) => (item.value / total) * 100);

  // Round all
  let rounded = rawPercentages.map((p) => Math.round(p));

  // Compute error
  const diff = 100 - rounded.reduce((a, b) => a + b, 0);

  if (diff !== 0) {
    // Adjust the value with the largest original remainder
    const deltas = rawPercentages.map((p, i) => ({
      index: i,
      error: p - rounded[i],
    }));

    // Sort descending if diff > 0, ascending if diff < 0
    deltas.sort((a, b) => (diff > 0 ? b.error - a.error : a.error - b.error));

    for (let i = 0; i < Math.abs(diff); i++) {
      rounded[deltas[i].index] += diff > 0 ? 1 : -1;
    }
  }

  return rounded;
}
