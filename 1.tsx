import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import LineChartComponent from "@/components/appx/lineChart_cyclicality_frame";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptionsContext";
import TableComponent from "@/components/appx/table_cyclicality_frame";

interface CyclicalityRow {
  REPORT_DATE: string;
  METRIC: string;
  VALUE: number;
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
  const [longRunData, setLongRunData] = useState<any[]>([]);
  const [sdData, setSdData] = useState<any[]>([]);
  const [tableLongRunData, setTableLongRunData] = useState<any[]>([]);
  const [tableSDData, setTableSDData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const segregateByMetric = (data: CyclicalityRow[]) => {
    const transformedData: Record<string, any> = {};

    data.forEach((row) => {
      if (!transformedData[row.REPORT_DATE]) {
        transformedData[row.REPORT_DATE] = { month: row.REPORT_DATE, desktop: null, laptop: null };
      }
      if (row.METRIC === "Model Cyclicality Long Run") {
        transformedData[row.REPORT_DATE].laptop = row.VALUE;
      } else if (row.METRIC === "Final Cyclicality Long Run") {
        transformedData[row.REPORT_DATE].desktop = row.VALUE;
      }
    });

    return Object.values(transformedData)
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-5);
  };

  const formatTableData = (data: CyclicalityRow[]) => {
    const transformedData: Record<string, any> = {};

    data.forEach((row) => {
      if (!transformedData[row.REPORT_DATE]) {
        transformedData[row.REPORT_DATE] = { Quarter: row.REPORT_DATE, "Model Cyclicality Long Run": null, "Final Cyclicality Long Run": null };
      }
      if (row.METRIC === "Model Cyclicality Long Run") {
        transformedData[row.REPORT_DATE]["Model Cyclicality Long Run"] = row.VALUE;
      } else if (row.METRIC === "Final Cyclicality Long Run") {
        transformedData[row.REPORT_DATE]["Final Cyclicality Long Run"] = row.VALUE;
      }
    });

    return Object.values(transformedData).sort((a, b) => new Date(a.Quarter).getTime() - new Date(b.Quarter).getTime());
  };

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
        const longRunFiltered: CyclicalityRow[] = data["Cyclicality: Long run"]?.rows || [];
        const sdFiltered: CyclicalityRow[] = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

        setLongRunData(segregateByMetric(longRunFiltered));
        setSdData(segregateByMetric(sdFiltered));
        setTableLongRunData(formatTableData(longRunFiltered));
        setTableSDData(formatTableData(sdFiltered));
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOptions]);

  const chartConfigLongRun = {
    model: { label: "Model Cyclicality Long Run", color: "rgb(12,74,110)" },
    final: { label: "Final Cyclicality Long Run", color: "red" },
  };

  const chartConfigSD = {
    model: { label: "Model Cyclicality SD", color: "blue" },
    final: { label: "Final Cyclicality SD", color: "green" },
  };

  return (
    <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="flex flex-wrap w-full gap-4 mt-4">
        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality Long Run"
            description="Model and Final Cyclicality Long Run"
            data={longRunData}
            config={chartConfigLongRun}
          />
        </div>

        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality SD"
            description="Model and Final Cyclicality SD"
            data={sdData}
            config={chartConfigSD}
          />
        </div>
      </div>

      <div className="flex flex-wrap w-full gap-4 mt-4">
        <div className="w-full sm:w-[49%] max-w-full">
          <TableComponent data={tableLongRunData} />
        </div>
        <div className="w-full sm:w-[49%] max-w-full">
          <TableComponent data={tableSDData} />
        </div>
      </div>
    </div>
  );
}