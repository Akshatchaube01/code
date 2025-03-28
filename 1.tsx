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

  const segregateByMetric = (data: CyclicalityRow[], metric: string) => {
    return data
      .filter((row) => row.METRIC === metric)
      .sort((a, b) => new Date(a.REPORT_DATE).getTime() - new Date(b.REPORT_DATE).getTime())
      .map((row) => ({ month: row.REPORT_DATE, value: row.VALUE }));
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

        setLongRunData(segregateByMetric(longRunFiltered, "Final Cyclicality Long Run"));
        setSdData(segregateByMetric(sdFiltered, "Final Cyclicality SD"));

        setTableLongRunData(longRunFiltered);
        setTableSDData(sdFiltered);
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
        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality Long Run"
            description="Chart for Cyclicality Long Run"
            data={longRunData}
            config={chartConfig.longRun}
          />
        </div>

        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Cyclicality SD (Standard Deviation)"
            description="Chart for Cyclicality SD"
            data={sdData}
            config={chartConfig.standardDeviation}
          />
        </div>

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
