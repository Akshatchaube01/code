'use client'

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import axios from '@/components/gra-propel/CustomAxios';

interface Holiday {
  employee_name: string;
  holiday_start_date: string;
  holiday_end_date: string;
  leave_count: number;
  half_day?: string;
  holiday_type: string;
  disable: boolean;
  holiday_id: number;
}

interface HolidayTableProps {
  data: Holiday[];
}

const Table: React.FC<HolidayTableProps> = ({ data }) => {
  const tableRef = useRef<any>(null);
  const [tableData, setTableData] = useState<Holiday[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/propel/register_holidays/${id}`);
      setTableData(prev => prev.filter(row => row.holiday_id !== id));
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
        psid: '', // add psid if needed
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
    { title: 'Start Date', field: 'holiday_start_date', hozAlign: 'center', sorter: 'string', headerFilter: 'input' },
    { title: 'End Date', field: 'holiday_end_date', hozAlign: 'center', sorter: 'string', headerFilter: 'input' },
    { title: 'Total Days', field: 'leave_count', hozAlign: 'center', sorter: 'number', headerFilter: 'input' },
    {
      title: 'Half Day',
      field: 'half_day',
      hozAlign: 'center',
      formatter: (cell: any) => {
        const row = cell.getRow().getData();
        return row.leave_count === 0.5 ? 'Half Day' : 'Full Day';
      }
    },
    { title: 'Leave Type', field: 'holiday_type', hozAlign: 'center', sorter: 'string', headerFilter: 'input' },
    {
      title: 'Action',
      hozAlign: 'center',
      formatter: (cell: any) => {
        const row = cell.getRow().getData();
        return `
          <button ${!row.disable ? 'disabled' : ''} class="btn-save" style="margin-right:6px;background:#2563eb;color:white;border:none;padding:5px 10px;border-radius:4px">Save</button>
          <button ${!row.disable ? 'disabled' : ''} class="btn-delete" style="background:#f44336;color:white;border:none;padding:5px 10px;border-radius:4px">Delete</button>
        `;
      },
      cellClick: (e: any, cell: any) => {
        const rowData: Holiday = cell.getRow().getData();
        const clickedButton = (e.target as HTMLElement).innerText;
        if (!rowData.disable) return;

        if (clickedButton === 'Save') handleSave(rowData);
        else if (clickedButton === 'Delete') handleDelete(rowData.holiday_id);
      }
    }
  ];

  const options: ReactTabulatorOptions = {
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 6,
    reactiveData: true
  };

  return (
    <div>
      <ReactTabulator
        ref={tableRef}
        data={tableData}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export const TableComponent: React.FC<{ holidayData: Holiday[] }> = ({ holidayData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <section className="p-4 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Holiday Records</h2>
      <Table data={holidayData} />
    </section>
  );
};
