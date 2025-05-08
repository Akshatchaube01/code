'use client'

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'tabulator-tables/dist/js/tabulator.min.js';
import axios from '@/components/gra-propel/CustomAxios';

interface Holiday {
  employee_name: string;
  holiday_start_date: string;
  holiday_end_date: string;
  leave_count: number;
  half_day: number;
  holiday_type: string;
  disable: boolean;
  holiday_id: number;
}

interface HolidayTableProps {
  data: Holiday[];
}

const Table = ({ data }: HolidayTableProps) => {
  const tableRef = useRef<any>(null);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/propel/register_holidays/${id}`);
      alert('Record deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete record');
    }
  };

  const handleSave = async (rowData: Holiday) => {
    try {
      const payload = {
        rec_id: rowData.holiday_id,
        psid: '', // optional: attach psid if needed
        holiday_start_date: rowData.holiday_start_date,
        holiday_end_date: rowData.holiday_end_date,
        holiday_halfday: rowData.leave_count === 0.5,
        holiday_type: rowData.holiday_type
      };
      await axios.post('/propel/register_holidays/', payload);
      alert('Record updated successfully');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to update record');
    }
  };

  const columns = [
    { title: 'Employee Name', field: 'employee_name', hozAlign: 'center', sorter: 'input', headerFilter: 'input' },
    { title: 'Start Date', field: 'holiday_start_date', sorter: 'string', hozAlign: 'center', headerFilter: 'input' },
    { title: 'End Date', field: 'holiday_end_date', sorter: 'string', hozAlign: 'center', headerFilter: 'input' },
    { title: 'Total Days', field: 'leave_count', sorter: 'number', hozAlign: 'center', headerFilter: 'input' },
    {
      title: 'Half Day',
      field: 'half_day',
      sorter: 'string',
      hozAlign: 'center',
      formatter: (cell: any) => (cell.getRow().getData().leave_count === 0.5 ? 'Half Day' : 'Full Day')
    },
    { title: 'Leave Type', field: 'holiday_type', sorter: 'string', hozAlign: 'center', headerFilter: 'input' },
    {
      title: 'Action',
      formatter: (cell: any) => {
        const row = cell.getRow().getData();
        return `
          <button ${row.disable ? '' : 'disabled'} style="margin-right: 6px; background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: ${row.disable ? 'pointer' : 'not-allowed'}">Save</button>
          <button ${row.disable ? '' : 'disabled'} style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: ${row.disable ? 'pointer' : 'not-allowed'}">Delete</button>
        `;
      },
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData();
        const clickedButton = (e.target as HTMLElement).innerText;
        if (rowData.disable) {
          if (clickedButton === 'Save') handleSave(rowData);
          else if (clickedButton === 'Delete') handleDelete(rowData.holiday_id);
        }
      },
      hozAlign: 'center'
    }
  ];

  const options: ReactTabulatorOptions = {
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 6,
    reactiveData: true,
  };

  return (
    <div>
      <ReactTabulator
        ref={tableRef}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export const TableComponent = ({ holidayData }: { holidayData: Holiday[] }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <section className='p-4 bg-white rounded shadow-lg'>
      <h2 className='font-semibold leading-relaxed tracking-wide text-2xl font-bold mb-4'>
        Holiday Records
      </h2>
      <Table data={holidayData} />
    </section>
  );
};