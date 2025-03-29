interface TransformedData {
  month: string;
  [key: string]: number | string;
}

function transformData(rows: any[], metrics: string[]): TransformedData[] {
  const transformed: TransformedData[] = [];

  rows.forEach((row) => {
    const existingEntry = transformed.find((item) => item.month === row["REPORT-DATE"]);

    if (existingEntry) {
      existingEntry[row.METRIC] = row.VALUE;
    } else {
      transformed.push({
        month: row["REPORT-DATE"],
        [row.METRIC]: row.VALUE,
      });
    }
  });

  return transformed;
}
