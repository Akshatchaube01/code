"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import TableComponent from "@/components/appx/table_tabulator";
import BarChartFrame from "@/components/appx/barChart_frame";
import { SelectedOptionsProvider, useSelectedOptions } from "@/components/appx/context/SelectedOptionsContext";

import Component1 from "@/components/appx/lineChart_frame1";
import Component2 from "@/components/appx/lineChart_frame2";
import Component3 from "@/components/appx/lineChart_frame3";

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
    if (!selectedOptions) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.post(
          "http://127.0.0.1:8000/backtesting",
          JSON.stringify(selectedOptions),
          { headers: { "Content-Type": "application/json" } }
        );

        const data = response.data;

        setChartData1(formatChartData(data["Actual Vs Expected"].rows, [
          "Avg Final PD_BT",
          "Avg Model Modified PD_BT",
          "Avg Model PD_BT"
        ]));
        
        setChartData2(formatChartData(data["Notching Approach: Central Tendency"].rows, [
          "Central Tendency",
          "Long Run Default Rate"
        ]));
        
        setChartData3(formatChartData(data["Notching Approach: Long Run"].rows, [
          "Observed Default Rate"
        ]));
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedOptions]);

  const formatChartData = (data: any[], metrics: string[]) => {
    return data.filter(row => metrics.includes(row.METRIC))
               .map(row => ({
                 month: row.REPORT_DATE,
                 [row.METRIC]: row.VALUE
               }));
  };

  const chartTitle = [
    "Actual vs Expected TOTAL",
    "Notching Approach based on Central Tendency - TOTAL",
    "Notching Approach based on Long Run TOTAL"
  ];

  const chartDescription = "Chart description for Backtesting";

  return (
    <div className="w-full h-full flex flex-col p-2 max-w-screen overflow-hidden">
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="flex flex-wrap w-full gap-4 mt-4">
        <Component1 title={chartTitle[0]} description={chartDescription} data={chartData1} />
        <Component2 title={chartTitle[1]} description={chartDescription} data={chartData2} />
        <Component3 title={chartTitle[2]} description={chartDescription} data={chartData3} />
      </div>

      <div className="flex flex-wrap w-full gap-4 mt-4">
        <TableComponent data={chartData1} />
        <TableComponent data={chartData2} />
      </div>
    </div>
  );
}
