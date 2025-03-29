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

        setChartData1(formatChartData(data["Metric1"]));
        setChartData2(formatChartData(data["Metric2"]));
        setChartData3(formatChartData(data["Metric3"]));
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOptions]);

  const formatChartData = (data: any) => {
    return data?.map((row: any) => ({
      month: row.REPORT_DATE,
      avg_final_pd_bt: row.VALUE1,
      avg_model_pd_bt: row.VALUE2,
      avg_model_modified_pd_bt: row.VALUE3,
    })) || [];
  };

  const chartConfig = {
    avg_final_pd_bt: { label: "Avg Final PD_BT", color: "rgb(12,74,110)" },
    avg_model_pd_bt: { label: "Avg Model PD_BT", color: "green" },
    avg_model_modified_pd_bt: { label: "Avg Model Modified PD_BT", color: "red" },
  };

  return (
    <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="flex flex-wrap w-full gap-4 mt-4">
        <Component1 title="Metric 1" description="Description 1" data={chartData1} config={chartConfig} />
        <Component2 title="Metric 2" description="Description 2" data={chartData2} config={chartConfig} />
        <Component3 title="Metric 3" description="Description 3" data={chartData3} config={chartConfig} />
      </div>

      <div className="flex flex-wrap w-full gap-4 mt-4">
        <TableComponent data={chartData1} />
        <TableComponent data={chartData2} />
      </div>
    </div>
  );
}
