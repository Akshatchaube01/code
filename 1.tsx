const longRunFiltered: any[] = data["Cyclicality: Long run"]?.rows || [];
const sdFiltered: any[] = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

const segregateByMetric = (data: any[]) => {
  const transformedData: Record<string, any> = {};

  data.forEach((row) => {
    if (!transformedData[row.REPORT_DATE]) {
      transformedData[row.REPORT_DATE] = { month: row.REPORT_DATE, desktop: null, laptop: null };
    }
    if (row.METRIC === "Model Cyclicality Long Run") {
      transformedData[row.REPORT_DATE].laptop = row.VALUE;
    } else if (row.METRIC === "Final Cyclicality Long Run") {
      transformedData[row.REPORT_DATE].desktop = row.VALUE;
    }
  });

  return Object.values(transformedData)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .slice(-5); // Get the latest 5 records
};

setLongRunData(segregateByMetric(longRunFiltered));
setSdData(segregateByMetric(sdFiltered));

const formatTableData = (data: any[]) => {
  const transformedData = data.map((row) => ({
    Quarter: row.REPORT_DATE,
    "Model Cyclicality Long Run": row.METRIC === "Model Cyclicality Long Run" ? row.VALUE : null,
    "Final Cyclicality Long Run": row.METRIC === "Final Cyclicality Long Run" ? row.VALUE : null,
  }));

  return transformedData.sort((a, b) => (a.Quarter > b.Quarter ? 1 : -1));
};

setTableLongRunData(formatTableData(longRunFiltered));
setTableSDData(formatTableData(sdFiltered));
