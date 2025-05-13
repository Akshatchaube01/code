function convertFixedTableData(data: {
  column: { name: string }[];
  data: (string | number)[][];
}) {
  // Helper to clean and normalize column names
  const normalize = (name: string): string =>
    name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[()%]/g, "")
      .replace(/[^a-z0-9_]/g, ""); // Remove other special chars

  const columns = data.column.map(col => normalize(col.name));

  return data.data.map(row => {
    const obj: Record<string, string | number> = {};
    row.forEach((value, idx) => {
      const cleanedValue =
        typeof value === "string" && value.includes(",")
          ? parseFloat(value.replace(/,/g, ""))
          : value;
      obj[columns[idx]] = cleanedValue;
    });
    return obj;
  });
}
