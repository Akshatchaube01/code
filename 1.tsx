const extractData = (category: string): ChartData[] => {
    if (!chartData || !chartData[category] || !chartData[category].rows) {
        console.error(`Data missing for category: ${category}`, chartData);
        return []; // Return empty array to avoid breaking the chart
    }

    const rawData = chartData[category].rows.reduce((acc: Record<string, any>, row: any) => {
        const { "REPORT-DATE": date, VALUE: value, METRIC: metric } = row;
        if (!acc[date]) acc[date] = { month: date };
        acc[date][metric] = value || 0;
        return acc;
    }, {});

    return Object.values(rawData).map((entry: any) => ({
        month: entry.month,
        avg_final_pd_bt: entry["avg_final_pd_bt"] || 0,
        avg_model_pd_bt: entry["avg_model_pd_bt"] || 0,
        avg_model_modified_pd_bt: entry["avg_model_modified_pd_bt"] || 0,
        central_tendency: entry["central_tendency"] || 0,
        long_run_default_rate: entry["long_run_default_rate"] || 0,
        obv_def_rate: entry["obv_def_rate"] || 0,
    }));
};
