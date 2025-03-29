"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import Component1 from "@/components/appx/lineChart_frame1";
import Component2 from "@/components/appx/lineChart_frame2";
import Component3 from "@/components/appx/lineChart_frame3";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptionsContext";
import TableComponent from "@/components/appx/table_tabulator";
import BarChartFrame from "@/components/appx/barChart_frame";

export default function Page() {
  return (
    <SelectedOptionsProvider>
      <PageContent />
    </SelectedOptionsProvider>
  );
}

function PageContent() {
  const selectedOptions = useSelectedOptions();

  const [chartData1, setChartData1] = useState<any[]>([]);
  const [chartData2, setChartData2] = useState<any[]>([]);
  const [chartData3, setChartData3] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOptions) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          "http://127.0.0.1:8000/backtesting",
          JSON.stringify(selectedOptions),
          { headers: { "Content-Type": "application/json" } }
        );

        const data = response.data;

        // Extracting and structuring the required data
        const chart1Filtered = data["Metric1"]?.rows || [];
        const chart2Filtered = data["Metric2"]?.rows || [];
        const chart3Filtered = data["Metric3"]?.rows || [];

        setChartData1(formatChartData(chart1Filtered, "avg_final_pd_bt", "avg_model_pd_bt", "avg_model_modified_pd_bt"));
        setChartData2(formatChartData(chart2Filtered, "Final_CRR_CT", "Model_Modified_CRR_CT", "Model_CRR_CT"));
        setChartData3(formatChartData(chart3Filtered, "Final_CRR_LRADR", "Model_Modified_CRR_LRADR", "Model_CRR_LRADR"));

        setTableData(formatTableData(chart1Filtered, "avg_final_pd_bt"));
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOptions]);

  const formatChartData = (data: any[], metric1: string, metric2: string, metric3: string) => {
    return data
      .map((row) => ({
        month: row.REPORT_DATE,
        [metric1]: row[metric1],
        [metric2]: row[metric2],
        [metric3]: row[metric3],
      }))
      .sort((a, b) => (a.month > b.month ? 1 : -1));
  };

  const formatTableData = (data: any[], metric: string) => {
    return data.map((row) => ({
      month: row.REPORT_DATE,
      value: row[metric],
    }));
  };

  const chartConfig1 = {
    avg_final_pd_bt: { label: "Avg Final PD_BT", color: "rgb(12, 74, 110)" },
    avg_model_pd_bt: { label: "Avg Model PD_BT", color: "green" },
    avg_model_modified_pd_bt: { label: "Avg Model Modified PD_BT", color: "red" },
  };

  const chartConfig2 = {
    Final_CRR_CT: { label: "Final CRR CT", color: "rgb(12, 74, 110)" },
    Model_Modified_CRR_CT: { label: "Model Modified CRR CT", color: "red" },
    Model_CRR_CT: { label: "Model CRR CT", color: "green" },
  };

  const chartConfig3 = {
    Final_CRR_LRADR: { label: "Final CRR LRADR", color: "rgb(12, 74, 110)" },
    Model_Modified_CRR_LRADR: { label: "Model Modified CRR LRADR", color: "red" },
    Model_CRR_LRADR: { label: "Model CRR LRADR", color: "green" },
  };

  return (
    <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="flex flex-wrap w-full gap-4 mt-4">
        {/* Chart 1 */}
        <div className="w-full sm:w-[49%] max-w-full">
          <Component1 title="Chart 1" description="Description for Chart 1" data={chartData1} config={chartConfig1} />
        </div>

        {/* Chart 2 */}
        <div className="w-full sm:w-[49%] max-w-full">
          <Component2 title="Chart 2" description="Description for Chart 2" data={chartData2} config={chartConfig2} />
        </div>

        {/* Chart 3 */}
        <div className="w-full sm:w-[49%] max-w-full">
          <Component3 title="Chart 3" description="Description for Chart 3" data={chartData3} config={chartConfig3} />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-wrap w-full gap-4 mt-4">
        <div className="w-full sm:w-[49%] max-w-full overflow-hidden">
          <TableComponent data={tableData} />
        </div>
      </div>
    </div>
  );
}
