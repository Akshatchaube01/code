const segregateByMetric = (data: any[], metricDesktop: string, metricLaptop: string) => {
    const desktopData = data.filter((row) => row.METRIC === metricDesktop);
    const laptopData = data.filter((row) => row.METRIC === metricLaptop);

    return desktopData
        .map((desktopRow) => {
            const matchingLaptopRow = laptopData.find((laptopRow) => laptopRow.REPORT_DATE === desktopRow.REPORT_DATE);
            return {
                month: desktopRow.REPORT_DATE,
                desktop: desktopRow.VALUE,
                laptop: matchingLaptopRow ? matchingLaptopRow.VALUE : null
            };
        })
        .sort((a, b) => (a.month > b.month ? 1 : -1))
        .slice(-5); // Get latest 5 records
};

setLongRunData(segregateByMetric(longRunFiltered, "Final Cyclicality Long run", "Model Cyclicality Long run"));
setSdData(segregateByMetric(sdFiltered, "Final Cyclicality SD", "Model Cyclicality SD"));
