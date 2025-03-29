import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationMenuDemo from '@/components/appx/navigationBar';
import TabsDemo from '@/components/appx/tabs';
import Component1 from '@/components/appx/lineChart_frame1';
import Component2 from '@/components/appx/lineChart_frame2';
import Component3 from '@/components/appx/lineChart_frame3';
import ChartConfig from "@/components/frame/ui/chart";
import ThirdNav from '@/components/appx/thirdNavBar_frame';
import { SelectedOptionsProvider } from '@/components/appx/context/SelectedOptionsContext';
import TableComponent from '@/components/appx/table_tabulator';
import BarChartFrame from '@/components/appx/barChart_frame';

// Define the structure of the API response
interface ApiResponse {
  "Actual Vs Expected": {
    columns: string[];
    rows: ApiRow[];
  };
}

// Define each row in the response
interface ApiRow {
  REPORT_DATE: string;
  METRIC: string;
  VALUE: number;
}

// Define the structure of the chart data
interface ChartData {
  month: string;
  avg_final_pd_bt?: number;
  avg_model_modified_pd_bt?: number;
  avg_model_pd_bt?: number;
  central_tendency?: number;
  long_run_default_rate?: number;
  obv_def_rate?: number;
}

export default function Page() {
  const [chartData1, setChartData1] = useState<ChartData[]>([]);
  const [chartData2, setChartData2] = useState<ChartData[]>([]);
  const [chartData3, setChartData3] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post<ApiResponse>('/backtesting');
        const apiData = response.data["Actual Vs Expected"].rows;

        // Group data by REPORT_DATE and structure it for charts
        const formattedData1: ChartData[] = [];
        const formattedData2: ChartData[] = [];
        const formattedData3: ChartData[] = [];

        apiData.forEach((row) => {
          const metricKey = row.METRIC.toLowerCase().replace(/\s+/g, '_') as keyof ChartData;
          
          let targetArray = formattedData1; // Default to first chartData array
          if (["final_crr_ct", "model_modified_crr_ct", "model_crr_ct"].includes(metricKey)) {
            targetArray = formattedData2;
          } else if (["final_crr_lradr", "model_modified_crr_lradr", "model_crr_lradr"].includes(metricKey)) {
            targetArray = formattedData3;
          }

          const existingEntry = targetArray.find((item) => item.month === row.REPORT_DATE);
          if (existingEntry) {
            existingEntry[metricKey] = row.VALUE;
          } else {
            targetArray.push({
              month: row.REPORT_DATE,
              [metricKey]: row.VALUE,
            });
          }
        });

        setChartData1(formattedData1);
        setChartData2(formattedData2);
        setChartData3(formattedData3);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartTitleStack = [
    "Model Poisson Binomial Test Results",
    "Model Modified Poisson Binomial Test Results",
    "Final Poisson Binomial Test Results"
  ];

  const chartTitles = [
    "Actual vs Expected - TOTAL",
    "Notching Approach based on Central tendency - TOTAL",
    "Notching Approach based on long run - TOTAL"
  ];

  const chartDescription = "Chart description";

  const chartConfig1 = {
    avg_final_pd_bt: { label: "Avg Final PD_BT", color: "rgb(12, 74, 110)" },
    avg_model_modified_pd_bt: { label: "Avg Model Modified PD_BT", color: "red" },
    avg_model_pd_bt: { label: "Avg Model PD_BT", color: "green" },
    central_tendency: { label: "Central Tendency", color: "purple" },
    long_run_default_rate: { label: "Long run default rate", color: "blue" },
    obv_def_rate: { label: "Observed Default Rate (Last 12 Months)", color: "black" }
  } satisfies ChartConfig;

  const chartConfig2 = {
    final_crr_ct: { label: "Final CRR CT", color: "rgb(12, 74, 110)" },
    model_modified_crr_ct: { label: "Model Modified CRR CT", color: "red" },
    model_crr_ct: { label: "Model CRR CT", color: "green" }
  } satisfies ChartConfig;

  const chartConfig3 = {
    final_crr_lradr: { label: "Final CRR LRADR", color: "rgb(12, 74, 110)" },
    model_modified_crr_lradr: { label: "Model Modified CRR LRADR", color: "red" },
    model_crr_lradr: { label: "Model CRR LRADR", color: "green" }
  } satisfies ChartConfig;

  return (
    <>
      <div>
        <NavigationMenuDemo />
        <TabsDemo />
      </div>

      <SelectedOptionsProvider>
        <div className="size-screen w-full h-full flex flex-col gap-1 p-1">
          <div className='mt-0'>
            <ThirdNav />
          </div>

          {/* Line Charts */}
          <div className='flex w-full h-full flex-row pd-4 gap-x-5'>
            <Component1 title={chartTitles[0]} description={chartDescription} data={chartData1} config={chartConfig1} />
            <Component2 title={chartTitles[1]} description={chartDescription} data={chartData2} config={chartConfig2} />
            <Component3 title={chartTitles[2]} description={chartDescription} data={chartData3} config={chartConfig3} />
          </div>

          {/* Bar Charts */}
          <div className='flex flex-row pd-4 gap-x-5'>
            <BarChartFrame title={chartTitleStack[0]} description={chartDescription} data={chartData1} config={chartConfig1} />
            <BarChartFrame title={chartTitleStack[1]} description={chartDescription} data={chartData2} config={chartConfig2} />
            <BarChartFrame title={chartTitleStack[2]} description={chartDescription} data={chartData3} config={chartConfig3} />
          </div>

          {/* Table Component */}
          <div className='pt-6'>
            <TableComponent />
          </div>
        </div>
      </SelectedOptionsProvider>
    </>
  );
}
