"use client";

import React, { useState, useEffect } from "react";
import NavigationMenuDemo from "@/components/appx/navigationBar";
import TabsDemo from "@/components/appx/tabs";
import Component1 from "@/components/appx/lineChart_frame1";
import Component2 from "@/components/appx/lineChart_frame2";
import Component3 from "@/components/appx/lineChart_frame3";
import ThirdNav from "@/components/appx/thirdNavBar_frame";
import TableComponent from "@/components/appx/table_tabulator";
import axios from "axios";
import { SelectedOptionsProvider } from "@/components/appx/context/SelectedOptionsContext";

interface TransformedData {
  month: string;
  [key: string]: number | string;
}

async function fetchAndTransformData(): Promise<{
  chartData1: TransformedData[];
  chartData2: TransformedData[];
  chartData3: TransformedData[];
}> {
  try {
    const response = await axios.post("YOUR_API_ENDPOINT_HERE", {
      // Include any necessary request body parameters here
    });

    const apiData = response.data["Actual vs. Expected"];

    if (!apiData || !apiData.rows) {
      throw new Error("Invalid API response format");
    }

    const metrics1 = [
      "Avg Final PD_BT",
      "Avg Model Modified PD_BT",
      "Avg Model PD_BT",
      "Central Tendency",
      "Long run default rate",
      "Observed Default Rate (Last 12 months)",
    ];

    const metrics2 = [
      "Final CRR Notch Difference (Final CRR - CT)",
      "Model CRR Notch Difference (Model CRR - CT)",
      "Model Modified CRR Notch Difference (Model Modified CRR - CT)",
    ];

    const metrics3 = [
      "Final CRR Notch Difference (Final CRR - LRADR)",
      "Model CRR Notch Difference (Model CRR - LRADR)",
      "Model Modified CRR Notch Difference (Model Modified CRR - LRADR)",
    ];

    function transformData(rows: any[], metrics: string[]): TransformedData[] {
      const transformed: TransformedData[] = [];

      rows.forEach((row) => {
        if (!metrics.includes(row.METRIC)) return;

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

    return {
      chartData1: transformData(apiData.rows, metrics1),
      chartData2: transformData(apiData.rows, metrics2),
      chartData3: transformData(apiData.rows, metrics3),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { chartData1: [], chartData2: [], chartData3: [] };
  }
}

export default function Page() {
  return (
    <SelectedOptionsProvider>
      <PageContent />
    </SelectedOptionsProvider>
  );
}

function PageContent() {
  const [chartData1, setChartData1] = useState<TransformedData[]>([]);
  const [chartData2, setChartData2] = useState<TransformedData[]>([]);
  const [chartData3, setChartData3] = useState<TransformedData[]>([]);

  useEffect(() => {
    fetchAndTransformData().then(({ chartData1, chartData2, chartData3 }) => {
      setChartData1(chartData1);
      setChartData2(chartData2);
      setChartData3(chartData3);
    });
  }, []);

  return (
    <>
      <div>
        <NavigationMenuDemo />
        <TabsDemo />
      </div>
      <div className="size-screen w-full h-full flex flex-col gap-1 p-1">
        <div className='mt-0'>
          <ThirdNav />
        </div>
        <div className='flex w-full h-full flex-row pd-4 gap-x-5'>
          <Component1 title="Actual vs Expected" data={chartData1} />
          <Component2 title="Notching Approach based on Central Tendency" data={chartData2} />
          <Component3 title="Notching Approach based on Long Run" data={chartData3} />
        </div>
        <div className='pt-6'>
          <TableComponent />
        </div>
      </div>
    </>
  );
}