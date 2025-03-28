"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import { LineChartComponent } from "@/components/appx/lineChart_cyclicality_frame";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptions";
import TableComponent from "@/components/appx/table_cyclicality_frame";

export default function Page() {
    return (
        <SelectedOptionsProvider>
            <PageContent />
        </SelectedOptionsProvider>
    );
}

function PageContent() {
    const { selectedOptions } = useSelectedOptions();
    const [longRunData, setLongRunData] = useState<any[]>([]);
    const [sdData, setSdData] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedOptions) return;

            setLoading(true);
            try {
                setError(null);
                const response = await axios.post(
                    "http://127.0.0.1:8000/cyclicality",
                    JSON.stringify(selectedOptions),
                    { headers: { "Content-Type": "application/json" } }
                );
                
                const data = response.data;
                
                const longRunFiltered: any[] = data["Cyclicality: Long run"]?.rows || [];
                const sdFiltered: any[] = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];
                
                const segregateByMetric = (data: any[], metric: string) => {
                    return data
                        .filter((row: any) => row.METRIC === metric)
                        .sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1))
                        .slice(-5) // Get latest 5 records
                        .map((row: any) => ({
                            month: row.REPORT_DATE,
                            desktop: row.VALUE,
                            laptop: row.VALUE * 0.8
                        }));
                };

                setLongRunData(segregateByMetric(longRunFiltered, "Final Cyclicality Long run"));
                setSdData(segregateByMetric(sdFiltered, "Final Cyclicality SD"));
                setTableData([...longRunFiltered, ...sdFiltered]);
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedOptions]);

    const chartConfig = {
        longRun: { label: "Cyclicality Long Run", color: "rgb(12,74,110)" },
        standardDeviation: { label: "SD (Standard Deviation)", color: "red" }
    };

    return (
        <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
            <NavigationMenuDemo />
            <TabsDemo />
            <ThirdNav />

            <div className="flex flex-wrap w-full gap-4 mt-4">
                {/* Cyclicality: Long run */}
                <div className="w-full sm:w-[49%] max-w-full">
                    <LineChartComponent
                        title="Cyclicality: Long run"
                        description="Chart for Cyclicality Long Run"
                        data={longRunData}
                        config={chartConfig.longRun}
                    />
                </div>
                {/* Cyclicality: SD (Standard Deviation) */}
                <div className="w-full sm:w-[49%] max-w-full">
                    <LineChartComponent
                        title="Cyclicality: SD (Standard Deviation)"
                        description="Chart for Cyclicality SD"
                        data={sdData}
                        config={chartConfig.standardDeviation}
                    />
                </div>
            </div>

            {/* Table section */}
            <div className="flex flex-wrap w-full gap-4 mt-4">
                <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
                    <TableComponent data={tableData} />
                </div>
                <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
                    <TableComponent data={tableData} />
                </div>
            </div>
        </div>
    );
}