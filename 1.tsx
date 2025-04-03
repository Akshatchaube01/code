function transformBar(data: InputData): ChartData[] {
  if (!data || !data.rows || !Array.isArray(data.rows)) {
    console.error("Invalid data format:", data);
    return [];
  }

  return data.rows.map((row) => ({
    month: row.REPORT_DATA ?? "Unknown", // Handle missing `REPORT_DATA`
    red: (row.RED_UB_MODEL ?? 0) - (row.RED_LB_MODEL ?? 0),
    yellow: (row.AMBER_UB_MODEL ?? 0) - (row.AMBER_LB_MODEL ?? 0),
    green: (row.GREEN_UB_MODEL ?? 0) - (row.GREEN_LB_MODEL ?? 0),
  }));
}
