const segregateByMetric = (data: CyclicalityRow[]) => {
  const modelCyclicality: { month: string; modelCyclicality: number }[] = [];
  const finalCyclicality: { month: string; finalCyclicality: number }[] = [];

  data
    .sort((a, b) => new Date(a.REPORT_DATE).getTime() - new Date(b.REPORT_DATE).getTime()) // Sort by date
    .slice(-5) // Keep only the last 5 entries
    .forEach((row) => {
      if (row.METRIC === "Model Cyclicality Long Run") {
        modelCyclicality.push({ month: row.REPORT_DATE, modelCyclicality: row.VALUE });
      } else if (row.METRIC === "Final Cyclicality Long Run") {
        finalCyclicality.push({ month: row.REPORT_DATE, finalCyclicality: row.VALUE });
      }
    });

  return { modelCyclicality, finalCyclicality };
};
