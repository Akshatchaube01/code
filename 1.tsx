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

interface ChartData {
    month: string;
    avg_final_pd_bt: number;
    avg_model_pd_bt: number;
    avg_model_modified_pd_bt: number;
    central_tendency: number;
    long_run_default_rate: number;
    obv_def_rate: number;
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<Record<string, any> | null>(null);

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

    const extractData = (category: string): ChartData[] => {
        const rawData = chartData[category]?.rows.reduce((acc: Record<string, any>, row: any) => {
            const date = row["REPORT-DATE"] || "Unknown";
            if (!acc[date]) {
                acc[date] = {
                    month: date,
                    avg_final_pd_bt: 0,
                    avg_model_pd_bt: 0,
                    avg_model_modified_pd_bt: 0,
                    central_tendency: 0,
                    long_run_default_rate: 0,
                    obv_def_rate: 0,
                };
            }
            acc[date][row.METRIC] = row.VALUE || 0;
            return acc;
        }, {});

        return Object.values(rawData) as ChartData[];
    };

    const chartData1: ChartData[] = extractData("Actual vs Expected");
    const chartData2: ChartData[] = extractData("Notching Approach Based on Central Tendency");
    const chartData3: ChartData[] = extractData("Notching Approach Based on Long Run");

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
