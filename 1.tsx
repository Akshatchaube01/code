'use client';

import React from 'react';
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
  const generateHTMLTable = (title = 'Assignment Table') => {
    const headerRow = columns.map(col => `<th>${col.title}</th>`).join('');
    const dataRows = data.map(row =>
      `<tr>${columns.map(col => `<td>${String(row[col.field])}</td>`).join('')}</tr>`
    ).join('');

    return `
      <h2 style="font-family: Arial; margin-bottom: 10px;">${title}</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead style="background: #f2f2f2;"><tr>${headerRow}</tr></thead>
        <tbody>${dataRows}</tbody>
      </table>
    `;
  };

  const handleCopy = async () => {
    const headers = columns.map((col) => col.title).join('\t');
    const rows = data.map((row) =>
      columns.map((col) => String(row[col.field])).join('\t')
    );
    const text = [headers, ...rows].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Table copied to clipboard!');
    } catch (err) {
      console.error('Copy failed', err);
      alert('Failed to copy table.');
    }
  };

  const handleDownloadCSV = () => {
    const headers = columns.map((col) => col.title).join(',');
    const rows = data.map((row) =>
      columns.map((col) => JSON.stringify(row[col.field])).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'assignment_data.csv';
    link.click();
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assignments');
    XLSX.writeFile(workbook, 'assignment_data.xlsx');
  };

  const handleDownloadPDF = async () => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.background = '#fff';
    wrapper.innerHTML = generateHTMLTable();
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    let heightLeft = imgHeight - pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('assignment_data.pdf');
    document.body.removeChild(wrapper);
  };

  const handlePrint = () => {
    const tableHTML = generateHTMLTable();
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Print Table</title>
          <style>
            body { font-family: Arial; padding: 20px; background: #fff; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>${tableHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
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
