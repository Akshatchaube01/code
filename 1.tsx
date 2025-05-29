function getRoundedPercentages(data: DataType[]): number[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const raw = data.map((item) => (item.value / total) * 100);

  const floored = raw.map((p) => Math.floor(p));
  let sum = floored.reduce((a, b) => a + b, 0);

  // Add 1% to the largest raw percentage index if total < 100
  if (sum < 100) {
    const maxIndex = raw.findIndex((v) => v === Math.max(...raw));
    floored[maxIndex] += 1;
  }

  return floored;
}
