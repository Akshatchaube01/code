'use client';

import React from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'tabulator-tables/dist/css/tabulator.min.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

type Assignment = {
  assignment_id: number;
  psid: string;
  assigned_fte: number;
  start_date: string;
  end_date: string;
  disable: boolean;
  is_past: boolean;
};

interface AssignmentTableProps {
  data: Assignment[];
}

const columns = [
  { title: 'Assignment ID', field: 'assignment_id', sorter: 'number', headerFilter: 'input' },
  { title: 'PSID', field: 'psid', sorter: 'string', headerFilter: 'input' },
  { title: 'Assigned FTE', field: 'assigned_fte', sorter: 'number', headerFilter: 'input' },
  { title: 'Start Date', field: 'start_date', sorter: 'string', headerFilter: 'input' },
  { title: 'End Date', field: 'end_date', sorter: 'string', headerFilter: 'input' },
  { title: 'Disabled', field: 'disable', sorter: 'boolean' },
  { title: 'Is Past', field: 'is_past', sorter: 'boolean' },
];

export default function AssignmentTable({ data }: AssignmentTableProps) {
  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4 flex-wrap">
        <button className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Copy</button>
        <button className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Download CSV</button>
        <button className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Download Excel</button>
        <button className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Download PDF</button>
        <button className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Print</button>
      </div>

      <div className="border border-gray-300 rounded shadow-sm overflow-x-auto">
        <ReactTabulator
          data={data}
          columns={columns}
          layout="fitColumns"
          options={{
            pagination: true,
            paginationSize: 10,
            movableColumns: true,
            clipboard: true,
          }}
        />
      </div>
    </div>
  );
}
