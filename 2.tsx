"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const [tableLongRunData, setTableLongRunData] = useState<any[]>([]);
    const [tableSDData, setTableSDData] = useState<any[]>([]);
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
                const longRunFiltered = data["Cyclicality: Long run"]?.rows || [];
                const sdFiltered = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

                const formatTableData = (data: any[], metric: string) => {
                    return data
                        .filter((row) => row.METRIC === metric)
                        .sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1))
                        .map((row) => ({
                            quarter: row.REPORT_DATE,
                            model: row.MODEL,
                            final: row.VALUE
                        }));
                };

                setTableLongRunData(formatTableData(longRunFiltered, "Final Cyclicality Long run"));
                setTableSDData(formatTableData(sdFiltered, "Final Cyclicality SD"));
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedOptions]);

    return (
        <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
            <NavigationMenuDemo />
            <TabsDemo />
            <ThirdNav />

            {/* Table section */}
            <div className="flex flex-wrap w-full gap-4 mt-4">
                <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
                    <TableComponent data={tableLongRunData} title="Cyclicality Long Run" />
                </div>
                <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
                    <TableComponent data={tableSDData} title="Cyclicality SD (Standard Deviation)" />
                </div>
            </div>
        </div>
    );
}
