'use client'

import React, { useRef } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import axios from '@/components/gra-propel/CustomAxios';

interface Holiday {
  employee_name: string;
  holiday_start_date: string;
  holiday_end_date: string;
  leave_count: number;
  half_day: string;
  holiday_type: string;
  disable: boolean;
  holiday_id: number;
  holiday_halfday: boolean;
}

interface HolidayTableProps {
  holidayData: Holiday[];
}

export const TableComponent: React.FC<HolidayTableProps> = ({ holidayData }) => {
  const tableRef = useRef<any>(null);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/propel/register_holidays/${id}`);
      alert('Deleted successfully');
      window.location.reload(); // or trigger fetch from parent
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSave = async (rowData: Holiday) => {
    try {
      const payload = {
        rec_id: rowData.holiday_id,
        psid: '', // Add psid if needed
        holiday_start_date: rowData.holiday_start_date,
        holiday_end_date: rowData.holiday_end_date,
        holiday_halfday: rowData.holiday_halfday,
        holiday_type: rowData.holiday_type
      };

      await axios.post('/propel/register_holidays/', payload);
      alert('Saved successfully');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const columns = [
    { title: 'Employee Name', field: 'employee_name', hozAlign: 'center' },
    { title: 'Start Date', field: 'holiday_start_date', hozAlign: 'center' },
    { title: 'End Date', field: 'holiday_end_date', hozAlign: 'center' },
    { title: 'Total Days', field: 'leave_count', hozAlign: 'center' },
    { title: 'Half Day', field: 'half_day', hozAlign: 'center' },
    { title: 'Leave Type', field: 'holiday_type', hozAlign: 'center' },
    {
      title: 'Actions',
      field: 'actions',
      hozAlign: 'center',
      formatter: (_cell: any, row: any) => {
        const data: Holiday = row.getData();
        return `
          <button class="btn-save" ${!data.disable ? 'disabled' : ''}>Save</button>
          <button class="btn-delete" ${!data.disable ? 'disabled' : ''}>Delete</button>
        `;
      },
      cellClick: (e: any, cell: any) => {
        const rowData: Holiday = cell.getRow().getData();
        if (e.target.classList.contains('btn-save') && rowData.disable) {
          handleSave(rowData);
        }
        if (e.target.classList.contains('btn-delete') && rowData.disable) {
          handleDelete(rowData.holiday_id);
        }
      }
    }
  ];

  return (
    <section className='p-4 bg-white rounded shadow-lg'>
      <h2 className='font-semibold text-2xl mb-4'>Holiday Records</h2>
      <ReactTabulator
        ref={tableRef}
        data={holidayData}
        columns={columns}
        options={{
          layout: 'fitColumns',
          pagination: true,
          paginationSize: 6,
          reactiveData: true
        }}
      />
    </section>
  );
};
