import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import LineChartComponent from "@/components/appx/lineChart_cyclicality_frame";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptionsContext";
import TableComponent from "@/components/appx/table_cyclicality_frame";

// Define types
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
  const [tableLongRunData, setTableLongRunData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Corrected Data Transformation
  const segregateByMetric = (data: CyclicalityRow[]) => {
    const modelCyclicality: { month: string; modelCyclicality: number }[] = [];
    const finalCyclicality: { month: string; finalCyclicality: number }[] = [];

    data
      .sort((a, b) => new Date(a.REPORT_DATE).getTime() - new Date(b.REPORT_DATE).getTime())
      .slice(-5)
      .forEach((row) => {
        if (row.METRIC === "Model Cyclicality Long Run") {
          modelCyclicality.push({ month: row.REPORT_DATE, modelCyclicality: row.VALUE });
        } else if (row.METRIC === "Final Cyclicality Long Run") {
          finalCyclicality.push({ month: row.REPORT_DATE, finalCyclicality: row.VALUE });
        }
      });

    return { modelCyclicality, finalCyclicality };
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

        const { modelCyclicality, finalCyclicality } = segregateByMetric(longRunFiltered);

        // ✅ Fix for chart data
        setLongRunData(
          modelCyclicality.map((row, index) => ({
            month: row.month,
            modelCyclicality: row.modelCyclicality,
            finalCyclicality: finalCyclicality[index]?.finalCyclicality ?? null,
          }))
        );

        // ✅ Fix for table data
        setTableLongRunData(
          longRunFiltered.map((row) => ({
            a: row.REPORT_DATE,
            b: row.METRIC === "Model Cyclicality Long Run" ? row.VALUE : null,
            c: row.METRIC === "Final Cyclicality Long Run" ? row.VALUE : null,
          }))
        );
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
    model: { label: "Model Cyclicality Long Run", color: "rgb(12,74,110)" },
    final: { label: "Final Cyclicality Long Run", color: "red" },
  };

  return (
    <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="flex flex-wrap w-full gap-4 mt-4">
        {/* Cyclicality: Long Run */}
        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Model Cyclicality Long Run"
            description="Chart for Model Cyclicality Long Run"
            data={longRunData}
            config={chartConfig}
          />
        </div>

        <div className="w-full sm:w-[49%] max-w-full">
          <LineChartComponent
            title="Final Cyclicality Long Run"
            description="Chart for Final Cyclicality Long Run"
            data={longRunData}
            config={chartConfig}
          />
        </div>

        {/* Table Section */}
        <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
          <TableComponent data={tableLongRunData} />
        </div>
      </div>
    </div>
  );
}
