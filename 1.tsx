const processedData = data.map((entry) => {
  const updatedEntry: any = { month: entry.month };

  Object.keys(entry).forEach((key) => {
    if (key !== "month") {
      const field = entry[key]; // Could be a string or an object
      updatedEntry[key] = hiddenSeries[key] ? undefined : (typeof field === "object" && "value" in field ? field.value : 0);
    }
  });

  return updatedEntry;
});
