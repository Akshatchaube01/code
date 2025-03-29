"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NavigationMenuDemo from '@/components/appx/navigationBar';
import { TabsDemo } from '@/components/appx/tabs';
import { Component1 } from '@/components/appx/lineChart_frame1';
import { Component2 } from '@/components/appx/lineChart_frame2';
import { Component3 } from '@/components/appx/lineChart_frame3';
import { ChartConfig } from '@/components/frame/ui/chart';
import { SelectedOptionsProvider, useSelectedOptions } from '@/components/appx/context/SelectedOptions';
import ThirdNav from '@/components/appx/thirdNavBar_frame';
import TableComponent from '@/components/appx/table_tabulator';

export default function Page() {
    return (
        <SelectedOptionsProvider>
            <PageContent />
        </SelectedOptionsProvider>
    );
}

function PageContent() {
    const { selectedOptions } = useSelectedOptions();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedOptions) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post("http://127.0.0.1:8000/backtesting", selectedOptions, {
                    headers: { "Content-Type": "application/json" }
                });
                setChartData(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedOptions]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chartData) return null;

    const extractData = (category) => {
        return chartData[category]?.rows.reduce((acc, row) => {
            const { "REPORT-DATE": date, METRIC: metric, VALUE: value } = row;
            if (!acc[date]) acc[date] = { month: date };
            acc[date][metric] = value;
            return acc;
        }, {});
    };

    const chartData1 = Object.values(extractData("Actual vs Expected") || {});
    const chartData2 = Object.values(extractData("Notching Approach Based on Central Tendency") || {});
    const chartData3 = Object.values(extractData("Notching Approach Based on Long Run") || {});

    return (
        <>
            <NavigationMenuDemo />
            <TabsDemo />
            <ThirdNav />
            <div className='w-full h-full flex flex-col gap-4 p-4'>
                <div className='flex flex-row gap-5'>
                    <Component1 title="Actual vs Expected" description="Chart description" data={chartData1} />
                    <Component2 title="Notching Approach Based on Central Tendency" description="Chart description" data={chartData2} />
                    <Component3 title="Notching Approach Based on Long Run" description="Chart description" data={chartData3} />
                </div>
                <TableComponent />
            </div>
        </>
    );
}
