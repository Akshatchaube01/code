const processedData = data.map((entry) => {
  const updatedEntry: any = { month: entry.month };

  Object.keys(entry).forEach((key) => {
    if (key !== "month") {
      updatedEntry[key] = hiddenSeries[key] ? undefined : entry[key]?.value ?? 0;
    }
  });

  return updatedEntry;
});
