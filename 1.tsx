"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import { TabsDemo } from "@/components/appx/tabs";
import { LineChartComponent } from "@/components/appx/lineChart_frame1";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptions";
import TableComponent from "@/components/appx/table_tabulator";

interface ChartData {
    month: string;
    avg_final_pd_bt: number;
    avg_model_pd_bt: number;
    avg_model_modified_pd_bt: number;
    central_tendency: number;
    long_run_default_rate: number;
    obv_def_rate: number;
}

export default function Page() {
    return (
        <SelectedOptionsProvider>
            <PageContent />
        </SelectedOptionsProvider>
    );
}

function PageContent() {
    const { selectedOptions } = useSelectedOptions();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedOptions) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post("http://127.0.0.1:8000/backtesting", selectedOptions, {
                    headers: { "Content-Type": "application/json" }
                });
                setChartData(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedOptions]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chartData) return null;

    const extractData = (category: string): ChartData[] => {
        const rawData = chartData[category]?.rows.reduce((acc: Record<string, any>, row: any) => {
            const { "REPORT-DATE": date, VALUE: value, METRIC: metric } = row;
            if (!acc[date]) acc[date] = { month: date };
            acc[date][metric] = value || 0;
            return acc;
        }, {});

        return Object.values(rawData).map((entry: any) => ({
            month: entry.month,
            avg_final_pd_bt: entry["Final PD BT"] || 0,
            avg_model_pd_bt: entry["Model PD BT"] || 0,
            avg_model_modified_pd_bt: entry["Model Modified PD BT"] || 0,
            central_tendency: entry["Central Tendency"] || 0,
            long_run_default_rate: entry["Long Run Default Rate"] || 0,
            obv_def_rate: entry["Obv Def Rate"] || 0,
        }));
    };

    const chartData1: ChartData[] = extractData("Actual vs Expected");
    const chartData2: ChartData[] = extractData("Notching Approach Based on Central Tendency");
    const chartData3: ChartData[] = extractData("Notching Approach Based on Long Run");

    const chartConfig = {
        xAxisKey: "month",
        yAxisKeys: ["avg_final_pd_bt", "avg_model_pd_bt", "avg_model_modified_pd_bt", "central_tendency", "long_run_default_rate", "obv_def_rate"],
        colors: {
            avg_final_pd_bt: "rgb(12,74,110)",
            avg_model_pd_bt: "red",
            avg_model_modified_pd_bt: "green",
            central_tendency: "blue",
            long_run_default_rate: "orange",
            obv_def_rate: "purple"
        }
    };

    return (
        <>
            <NavigationMenuDemo />
            <TabsDemo />
            <ThirdNav />
            <div className='w-full h-full flex flex-col gap-4 p-4'>
                <div className='flex flex-row gap-5'>
                    <LineChartComponent title="Actual vs Expected" description="Chart for Actual vs Expected" data={chartData1} config={chartConfig} />
                    <LineChartComponent title="Notching Approach Based on Central Tendency" description="Chart for Central Tendency" data={chartData2} config={chartConfig} />
                    <LineChartComponent title="Notching Approach Based on Long Run" description="Chart for Long Run" data={chartData3} config={chartConfig} />
                </div>
                <TableComponent />
            </div>
        </>
    );
}
