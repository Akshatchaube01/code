"use client";

import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import Component1 from "@/components/appx/lineChart_frame1";
import Component2 from "@/components/appx/lineChart_frame2";
import Component3 from "@/components/appx/lineChart_frame3";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import { SelectedOptionsProvider } from "@/components/appx/context/SelectedOptionsContext";
import TableComponent from "@/components/appx/table_tabulator";
import axios from "axios";

export default function Page() {
  return (
    <SelectedOptionsProvider>
      <PageContent />
    </SelectedOptionsProvider>
  );
}

function PageContent() {
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/backtesting"); // Adjust API path if needed
        const data = response.data;

        // Transform Data
        const transformedData1 = transformData(
          data["Actual vs Expected"].rows,
          [
            "Avg Final PD_BT",
            "Avg Model Modified PD_BT",
            "Avg Model PD_BT",
            "Central Tendency",
            "Long run default rate",
            "Observed Default Rate (Last 12 months)",
          ]
        );

        const transformedData2 = transformData(
          data["Notching Approach Based on Central Tendency"].rows,
          [
            "Final CRR Notch Difference (Final CRR - CT)",
            "Model CRR Notch Difference (Model CRR - CT)",
            "Model Modified CRR Notch Difference (Model Modified CRR - CT)",
          ]
        );

        const transformedData3 = transformData(
          data["Notching Approach Based on Long Run"].rows,
          [
            "Final CRR Notch Difference (Final CRR - LRADR)",
            "Model CRR Notch Difference (Model CRR - LRADR)",
            "Model Modified CRR Notch Difference (Model Modified CRR - LRADR)",
          ]
        );

        setChartData1(transformedData1);
        setChartData2(transformedData2);
        setChartData3(transformedData3);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Transformation function to format data
  function transformData(rows, metrics) {
    const transformed = [];

    rows.forEach((row) => {
      const existingEntry = transformed.find((item) => item.month === row["REPORT-DATE"]);

      if (existingEntry) {
        existingEntry[row.METRIC] = row.VALUE;
      } else {
        transformed.push({
          month: row["REPORT-DATE"],
          [row.METRIC]: row.VALUE,
        });
      }
    });

    return transformed;
  }

  const chartTitle = [
    "Actual vs Expected TOTAL",
    "Notching Approach Based on Central Tendency - TOTAL",
    "Notching Approach Based on Long Run TOTAL",
  ];

  const chartDescription = "Chart description";

  return (
    <>
      <NavigationMenuDemo />
      <TabsDemo />
      <ThirdNav />

      <div className="size-screen w-full h-full flex flex-col gap-1 p-1">
        <div className="flex w-full h-full flex-row p-4 gap-x-5">
          <Component1
            title={chartTitle[0]}
            description={chartDescription}
            data={chartData1}
          />
          <Component2
            title={chartTitle[1]}
            description={chartDescription}
            data={chartData2}
          />
          <Component3
            title={chartTitle[2]}
            description={chartDescription}
            data={chartData3}
          />
        </div>

        <div className="pt-6">
          <TableComponent />
        </div>
      </div>
    </>
  );
}
