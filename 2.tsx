"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import { LineChartComponent } from "@/components/appx/lineChart_cyclicality_frame";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/Sele";
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
  const [jsonData, setJsonData] = useState<any>(null);
  const [longRunData, setLongRunData] = useState<any[]>([]);
  const [sdData, setSdData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOptions) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/cyclicality",
          JSON.stringify(selectedOptions),
          { headers: { "Content-Type": "application/json" } }
        );

        setJsonData(response.data);
        console.log(response.data);

        // Extract Long Run and SD data
        const longRunFiltered = response.data["Cyclicality: Long run"]?.rows || [];
        const sdFiltered = response.data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

        // Function to get the latest five dates
        const getLatestFiveDates = (data: any) => {
          const sortedData = [...data].sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1));
          return sortedData.slice(-5);
        };

        // Get latest 5 records for Long Run and SD
        const longRunLatest = getLatestFiveDates(longRunFiltered);
        const sdLatest = getLatestFiveDates(sdFiltered);

        // Transform data for chart
        const longRunChartData = longRunLatest.map((row: any) => ({
          month: row.REPORT_DATE,
          desktop: row.VALUE,
          laptop: row.VALUE * 0.8,
        }));

        const sdChartData = sdLatest.map((row: any) => ({
          month: row.REPORT_DATE,
          desktop: row.VALUE,
          laptop: row.VALUE * 0.8,
        }));

        // Update state
        setLongRunData(longRunChartData);
        setSdData(sdChartData);
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
    standardDeviation: { label: "SD (Standard Deviation)", color: "red" },
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
            description="Chart for Cyclicality Long Run"
            title="Cyclicality: Long run"
            data={longRunData} // Only Long Run Data
            config={chartConfig.longRun}
          />
        </div>

        {/* Cyclicality: SD (Standard Deviation) */}
        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality: SD (Standard Deviation)"
            description="Chart for Cyclicality SD"
            data={sdData} // Only SD Data
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
