
import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import { TabsDemo } from "@/components/tabs/page";
import { LineChartComponent } from "@/components/appx/lineChart_cyclicality_frame";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/context/SelectedOptionsContext";
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

  // Fetch JSON data from public folder
  useEffect(() => {
    fetch("/cyclicality_data.json")
      .then((res) => res.json())
      .then((data) => setJsonData(data))
      .catch((error) => console.error("Error Loading JSON:", error));
  }, []);

  // Filter and format data when jsonData or selectedOptions change
  useEffect(() => {
    if (!jsonData) return;

    const filterData = (data: any) =>
      data.rows.filter((row: any) => {
        return (
          (!selectedOptions.view || row.VIEW === selectedOptions.view) &&
          (!selectedOptions.dateRange || row.REPORT_DATE === selectedOptions.dateRange) &&
          (!selectedOptions.region || row.REGION === selectedOptions.region) &&
          (!selectedOptions.country || row.COUNTRY === selectedOptions.country) &&
          (!selectedOptions.modelName || row.MODEL === selectedOptions.modelName) &&
          (!selectedOptions.segment || row.SEGMENT === selectedOptions.segment) &&
          (!selectedOptions.scope || row.KEY.includes(selectedOptions.scope))
        );
      });

    // Process Cyclicality: Long Run
    const longRunFiltered = filterData(jsonData["Cyclicality: Long run"]);

    // Process Cyclicality: SD (Standard Deviation)
    const sdFiltered = filterData(jsonData["Cyclicality: SD (Standard Deviation)"]);

    // Function to get only the latest 5 dates
    const getLatestFiveDates = (data: any) => {
      const sortedData = [...data].sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1));
      return sortedData.slice(-5); // Get the last 5 entries
    };

    // Get latest 5 dates for both datasets
    const longRunLatest = getLatestFiveDates(longRunFiltered);
    const sdLatest = getLatestFiveDates(sdFiltered);

    // Format for charts
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

    setLongRunData(longRunChartData);
    setSdData(sdChartData);
    setTableData([...longRunFiltered, ...sdFiltered]);
  }, [jsonData, selectedOptions]);

  const chartConfig = {
    desktop: { label: "Desktop", color: "rgb(12,74,110)" },
    laptop: { label: "Laptop", color: "red" },
  };

  return (
    <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="flex flex-wrap w-full gap-4 mt-4">
        {/* First chart - Cyclicality: Long run */}
        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality: Long run"
            description="Chart for Cyclicality Long Run"
            data={longRunData}
            config={chartConfig}
          />
        </div>

        {/* Second chart - Cyclicality: SD (Standard Deviation) */}
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
          <TableComponent data={tableData} />
        </div>

        <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
          <TableComponent data={tableData} />
        </div>
      </div>
    </div>
  );
}
