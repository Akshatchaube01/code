const resetChart = () => {
  setBrushStartIndex(0);
  setBrushEndIndex(data.length - 1);

  // Extract all unique keys dynamically
  const allKeys = new Set<string>();
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "month") allKeys.add(key);
    });
  });

  // Reset hidden series dynamically
  setHiddenSeries(
    Object.fromEntries(Array.from(allKeys).map((key) => [key, false]))
  );
};
