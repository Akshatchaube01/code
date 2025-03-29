const extractData = (category: string): ChartData[] => {
    const rawData = chartData[category]?.rows || [];

    const filteredData = rawData.filter(row => {
        const quarter = row["REPORT_DATE"];
        return quarter >= "2023 Q4" && quarter <= "2024 Q4";
    });

    const formattedData: Record<string, any> = {};

    filteredData.forEach(row => {
        const month = row["REPORT_DATE"];
        const metric = row["METRIC"];
        const value = row["VALUE"] ?? 0;

        if (!formattedData[month]) {
            formattedData[month] = { month };
        }
        formattedData[month][metric] = value;
    });

    return Object.values(formattedData).map(entry => ({
        month: entry.month,
        avg_final_pd_bt: entry["avg_final_pd_bt"] ?? 0,
        avg_model_pd_bt: entry["avg_model_pd_bt"] ?? 0,
        avg_model_modified_pd_bt: entry["avg_model_modified_pd_bt"] ?? 0,
        central_tendency: entry["central_tendency"] ?? 0,
        long_run_default_rate: entry["long_run_default_rate"] ?? 0,
        obv_def_rate: entry["obv_def_rate"] ?? 0,
    }));
};
