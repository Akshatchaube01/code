'use client';

import React, { useRef } from 'react';
import { ReactTabulator } from 'react-tabulator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
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

const AssignmentTable: React.FC<AssignmentTableProps> = ({ data }) => {
  const tableRef = useRef(null);

  const columns = [
    {
      title: 'Assignment ID',
      field: 'assignment_id',
      sorter: 'number',
      headerFilter: 'input',
    },
    {
      title: 'PSID',
      field: 'psid',
      sorter: 'string',
      headerFilter: 'input',
    },
    {
      title: 'Assigned FTE',
      field: 'assigned_fte',
      sorter: 'number',
      headerFilter: 'input',
      editable: function (cell) {
        return !cell.getRow().getData().disable;
      },
    },
    {
      title: 'Start Date',
      field: 'start_date',
      sorter: 'string',
      headerFilter: 'input',
      editable: function (cell) {
        return !cell.getRow().getData().disable;
      },
    },
    {
      title: 'End Date',
      field: 'end_date',
      sorter: 'string',
      headerFilter: 'input',
      formatter: function (cell) {
        const value = cell.getValue();
        const row = cell.getRow().getData();
        return `<div style="background-color:${
          row.is_past ? 'red' : 'transparent'
        }; color:${row.is_past ? 'white' : 'black'}; padding: 4px;">${value}</div>`;
      },
    },
  ];

  const handleCopy = () => {
    tableRef.current?.copyToClipboard();
  };

  const handleDownloadCSV = () => {
    tableRef.current?.download('csv', 'assignment_data.csv');
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assignments');
    XLSX.writeFile(wb, 'assignment_data.xlsx');
  };

  const handleDownloadPDF = () => {
    html2canvas(document.querySelector('.tabulator')).then((canvas) => {
      const pdf = new jsPDF();
      const img = canvas.toDataURL('image/png');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, width, height);
      pdf.save('assignment_data.pdf');
    });
  };

  const handlePrint = () => {
    tableRef.current?.print(false, true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4 flex-wrap">
        <button onClick={handleCopy} className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Copy</button>
        <button onClick={handleDownloadCSV} className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Download CSV</button>
        <button onClick={handleDownloadExcel} className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Download Excel</button>
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Download PDF</button>
        <button onClick={handlePrint} className="px-4 py-2 bg-blue-100 text-gray-800 rounded hover:bg-blue-300 transition">Print</button>
      </div>
      <div className="border border-gray-300 rounded shadow-sm overflow-x-auto">
        <ReactTabulator
          ref={tableRef}
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
};

export default AssignmentTable;
