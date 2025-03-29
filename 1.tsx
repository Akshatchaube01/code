import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationMenuDemo from '@/components/appx/navigationBar';
import TabsDemo from '@/components/appx/tabs';
import Component1 from '@/components/appx/lineChart_frame1';
import Component2 from '@/components/appx/lineChart_frame2';
import Component3 from '@/components/appx/lineChart_frame3';
import { ChartConfig } from '@/components/frame/ui/chart';
import ThirdNav from '@/components/appx/thirdNavBar_frame';
import { SelectedOptionsProvider } from '@/components/appx/context/SelectedOptionsContext';
import TableComponent from '@/components/appx/table_tabulator';

export default function Page() {
    const [chartData1, setChartData1] = useState([]);
    const [chartData2, setChartData2] = useState([]);
    const [chartData3, setChartData3] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('YOUR_BACKEND_API_URL/backtesting', {});
                const data = response.data;
                
                const formattedData1 = [];
                const formattedData2 = [];
                const formattedData3 = [];

                data.forEach((item) => {
                    const { REPORT_DATE, METRIC, VALUE } = item;
                    
                    if (METRIC.includes("PD_BT")) {
                        let entry = formattedData1.find(d => d.month === REPORT_DATE);
                        if (!entry) {
                            entry = { month: REPORT_DATE };
                            formattedData1.push(entry);
                        }
                        entry[METRIC] = VALUE;
                    } else if (METRIC.includes("CRR_CT")) {
                        let entry = formattedData2.find(d => d.month === REPORT_DATE);
                        if (!entry) {
                            entry = { month: REPORT_DATE };
                            formattedData2.push(entry);
                        }
                        entry[METRIC] = VALUE;
                    } else if (METRIC.includes("CRR_LRADR")) {
                        let entry = formattedData3.find(d => d.month === REPORT_DATE);
                        if (!entry) {
                            entry = { month: REPORT_DATE };
                            formattedData3.push(entry);
                        }
                        entry[METRIC] = VALUE;
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

    const chartTitle = [
        "Actual vs Expected - TOTAL",
        "Notching Approach based on Central Tendency - TOTAL",
        "Notching Approach based on Long Run - TOTAL"
    ];

    const chartDescription = "Chart description";

    const chartConfig1 = {
        "Avg Final PD_BT": { label: "Avg Final PD_BT", color: "rgb(12, 74, 110)" },
        "Avg Model Modified PD_BT": { label: "Avg Model Modified PD_BT", color: "red" },
        "Avg Model PD_BT": { label: "Avg Model PD_BT", color: "green" }
    } satisfies ChartConfig;

    const chartConfig2 = {
        "Final_CRR_CT": { label: "Final CRR CT", color: "rgb(12, 74, 110)" },
        "Model_Modified_CRR_CT": { label: "Model Modified CRR CT", color: "red" },
        "Model_CRR_CT": { label: "Model CRR CT", color: "green" }
    } satisfies ChartConfig;

    const chartConfig3 = {
        "Final_CRR_LRADR": { label: "Final CRR LRADR", color: "rgb(12, 74, 110)" },
        "Model_Modified_CRR_LRADR": { label: "Model Modified CRR LRADR", color: "red" },
        "Model_CRR_LRADR": { label: "Model CRR LRADR", color: "green" }
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

                    <div className='flex w-full h-full flex-row pd-4 gap-x-5'>
                        <Component1 title={chartTitle[0]} description={chartDescription} data={chartData1} config={chartConfig1} />
                        <Component2 title={chartTitle[1]} description={chartDescription} data={chartData2} config={chartConfig2} />
                        <Component3 title={chartTitle[2]} description={chartDescription} data={chartData3} config={chartConfig3} />
                    </div>

                    <div className='pt-6'>
                        <TableComponent />
                    </div>
                </div>
            </SelectedOptionsProvider>
        </>
    );
}