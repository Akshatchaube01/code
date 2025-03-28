"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import LineChartComponent from "@/components/appx/lineChart_cyclicality_frame";
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
        console.log("✅ Raw API Response:", JSON.stringify(data, null, 2));

        const longRunFiltered = data["Cyclicality: Long run"]?.rows || [];
        const sdFiltered = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

        console.log("✅ Before Transformation - Long Run:", JSON.stringify(longRunFiltered, null, 2));
        console.log("✅ Before Transformation - SD:", JSON.stringify(sdFiltered, null, 2));

        // ✅ Proper transformation ensuring NO DATA LOSS
        const processDataForChart = (data, metric) => {
          return data
            .filter(row => row.METRIC === metric)
            .sort((a, b) => new Date(a.REPORT_DATE) - new Date(b.REPORT_DATE)) // Correct sorting
            .slice(-5) // Get latest 5 records
            .map(row => ({
              month: row.REPORT_DATE,
              desktop: row.VALUE, // ✅ Preserve negative values
              laptop: row.VALUE, // ✅ No manipulation
            }));
        };

        const processedLongRun = processDataForChart(longRunFiltered, "Final Cyclicality Long run");
        const processedSD = processDataForChart(sdFiltered, "Final Cyclicality SD");

        console.log("✅ Processed Chart Data - Long Run:", JSON.stringify(processedLongRun, null, 2));
        console.log("✅ Processed Chart Data - SD:", JSON.stringify(processedSD, null, 2));

        setLongRunData(processedLongRun);
        setSdData(processedSD);

        // ✅ Table transformation (preserve negative values)
        const formatTableData = (data, metric) => {
          return data
            .filter(row => row.METRIC === metric)
            .sort((a, b) => new Date(a.REPORT_DATE) - new Date(b.REPORT_DATE))
            .map(row => ({
              a: row.REPORT_DATE, // Quarter
              b: row.MODEL, // Model Cyclicality Long Run
              c: row.VALUE, // Final Cyclicality Long Run (preserves negative values)
            }));
        };

        const tableLongRun = formatTableData(longRunFiltered, "Final Cyclicality Long run");
        const tableSD = formatTableData(sdFiltered, "Final Cyclicality SD");

        console.log("✅ Table Data - Long Run:", JSON.stringify(tableLongRun, null, 2));
        console.log("✅ Table Data - SD:", JSON.stringify(tableSD, null, 2));

        setTableLongRunData(tableLongRun);
        setTableSDData(tableSD);
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
