import React, { useEffect, useState } from 'react';
import NavigationMenuDemo from '@/components/appx/navigationBar';
import { TabsDemo } from '@/components/appx/tabs';
import { Component } from '@/components/appx/lineChart_frame';
import { ChartConfig } from '@/components/frame/ui/chart';
import ThirdNav from '@/components/appx/thirdNavBar_frame';
import { SelectedOptionsProvider } from '@/components/appx/context/SelectedOptionsContext';
import TableComponent from '@/components/appx/table_tabulator';
import { BarChartFrame } from '@/components/appx/barChart_frame';

export default function Page() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('YOUR_BACKEND_API_URL', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // Include request body if needed
                    }),
                });

                const result = await response.json();

                // Process API response to extract the required chart data
                const actualVsExpectedData = result["Actual Vs Expected"]?.rows || [];

                const formattedData = actualVsExpectedData.reduce((acc, row) => {
                    const { REPORT_DATE, METRIC, VALUE } = row;

                    // Find existing entry for this REPORT_DATE
                    let existingEntry = acc.find(item => item.month === REPORT_DATE);
                    if (!existingEntry) {
                        existingEntry = { month: REPORT_DATE };
                        acc.push(existingEntry);
                    }

                    // Map metrics dynamically
                    existingEntry[METRIC] = VALUE;
                    return acc;
                }, []);

                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const chartTitle = [
        "Actual vs Expected - TOTAL",
        "Notching Approach based on Central Tendency TOTAL",
        "Notching Approach based on Long Run TOTAL"
    ];

    const chartDescription = "Chart description";

    const chartConfig: ChartConfig = {
        "Avg Final PD_BT": { label: "Avg Final PD_BT", color: "blue" },
        "Avg Model Modified PD_BT": { label: "Avg Model Modified PD_BT", color: "red" },
        "Avg Model PD_BT": { label: "Avg Model PD_BT", color: "green" },
        "Central Tendency": { label: "Central Tendency", color: "purple" },
        "Long run default rate": { label: "Long Run Default Rate", color: "orange" },
        "Observed Default Rate (Last 12 months)": { label: "Observed Default Rate", color: "brown" }
    };

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

                    <div className='flex w-full h-full flex-row pd-4 gap-x-5'>
                        <Component title={chartTitle[0]} description={chartDescription} data={chartData} config={chartConfig} />
                        <Component title={chartTitle[1]} description={chartDescription} data={chartData} config={chartConfig} />
                        <Component title={chartTitle[2]} description={chartDescription} data={chartData} config={chartConfig} />
                    </div>

                    <div className='pt-6'>
                        <TableComponent />
                    </div>
                </div>
            </SelectedOptionsProvider>
        </>
    );
}
