const printChart = () => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Extract all unique keys dynamically
  const allKeys = new Set<string>();
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "month") allKeys.add(key);
    });
  });

  // Convert Set to Array
  const allKeysArray = Array.from(allKeys);

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Chart & Data</title>
        <link rel="stylesheet" href="/styles.css" />
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .chart-container { text-align: center; margin-bottom: 20px; }
          .table-container { width: 100%; margin-top: 20px; border-collapse: collapse; }
          table, th, td { border: 1px solid black; padding: 10px; text-align: center; }
          svg { filter: none !important; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>

        <div class="chart-container">
          ${cardRef.current?.querySelector("#chartArea")?.innerHTML || ""}
        </div>

        <h3>Raw Data</h3>
        <table class="table-container">
          <thead>
            <tr>
              <th>Month</th>
              ${allKeysArray
                .map((key) => (hiddenSeries[key] ? "" : `<th>${data.find((d) => d[key])?.[key]?.label || key}</th>`))
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                <td>${row.month}</td>
                ${allKeysArray
                  .map((key) =>
                    hiddenSeries[key] ? "" : `<td>${row[key] ? row[key].value : "N/A"}</td>`
                  )
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};
