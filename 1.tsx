"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import { LineChartComponent } from "@/components/appx/lineChart_cyclicality_frame";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptionsContext";
import TableComponent from "@/components/appx/table_cyclicality_frame";

export default function Page() {
  return (
    <SelectedOptionsProvider>
      <PageContent />
    </SelectedOptionsProvider>
  );
}

function PageContent() {
  const selectedOptions = useSelectedOptions();
  const [longRunData, setLongRunData] = useState<any[]>([]);
  const [sdData, setSdData] = useState<any[]>([]);
  const [tableLongRunData, setTableLongRunData] = useState<any[]>([]);
  const [tableSDData, setTableSDData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOptions) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.post(
          "http://127.0.0.1:8000/cyclicality",
          JSON.stringify(selectedOptions),
          { headers: { "Content-Type": "application/json" } }
        );
        
        const data = response.data;
        
        const longRunFiltered: any[] = data["Cyclicality: Long run"].rows || [];
        const sdFiltered: any[] = data["Cyclicality: SD (Standard Deviation)"].rows || [];

        const segregateMetric = (data: any[], metricDesktop: string, metricLaptop: string) => {
          const desktopData = data.filter((row) => row.METRIC === metricDesktop);
          const laptopData = data.filter((row) => row.METRIC === metricLaptop);
          
          return desktopData.map((desktopRow) => {
            const matchingLaptopRow = laptopData.find(
              (laptopRow) => laptopRow.REPORT_DATE === desktopRow.REPORT_DATE
            );
            return {
              month: desktopRow.REPORT_DATE,
              desktop: desktopRow.VALUE,
              laptop: matchingLaptopRow ? matchingLaptopRow.VALUE : null,
            };
          }).sort((a, b) => (a.month > b.month ? 1 : -1)).slice(-3);
        };
        
        setLongRunData(segregateMetric(longRunFiltered, "Final Cyclicality Long run", "Model Cyclicality Long run"));
        setSdData(segregateMetric(sdFiltered, "Final Cyclicality SD", "Model Cyclicality SD"));
        
        const formatTableData = (data: any[], metric: string) => {
          return data
            .filter((row) => row.METRIC === metric)
            .sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1))
            .map((row) => ({
              "Quarters": row.REPORT_DATE,
              "Model Cyclicality Long Run": row.MODEL,
              "Final Cyclicality Long Run": row.VALUE,
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
            config={chartConfig}
          />
        </div>
        {/* Cyclicality: SD (Standard Deviation) */}
        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality: SD (Standard Deviation)"
            description="Chart for Cyclicality SD"
            data={sdData}
            config={chartConfig}
          />
        </div>
      </div>
      {/* Table section */}
      <div className="flex flex-wrap w-full gap-4 mt-4">
        <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
          <TableComponent data={tableLongRunData} />
        </div>
        <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
          <TableComponent data={tableSDData} />
        </div>
      </div>
    </div>
  );
}
