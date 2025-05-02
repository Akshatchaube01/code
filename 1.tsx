'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'tabulator-tables/dist/js/tabulator.min.js';

declare global {
  interface Window {
    TabulatorFull: any;
  }
}

type SubProject = {
  name: string;
  status: string;
};

type Project = {
  id: number;
  project_type: string;
  project_count: number;
  children?: SubProject[];
};

const AssignmentTable = () => {
  const [myEffortsData, setData] = useState<Project[]>([]);
  const expandedRows = useRef<Set<number>>(new Set());

  const columns = [
    {
      title: '',
      width: 60,
      formatter: function () {
        return '<button class="expand-btn">▶</button>';
      },
      hozAlign: 'center',
      cellClick: function (e: any, cell: any) {
        const row = cell.getRow();
        const data = row.getData();
        const rowIndex = data.id;

        // Collapse
        if (expandedRows.current.has(rowIndex)) {
          const existing = row.getElement().querySelector('.child-table-wrapper');
          if (existing) existing.remove();
          expandedRows.current.delete(rowIndex);
          cell.getElement().innerHTML = '<button class="expand-btn">▶</button>';
        } else {
          // Expand
          if (data.children && data.children.length > 0) {
            const wrapper = document.createElement('div');
            wrapper.className = 'child-table-wrapper';
            wrapper.style.padding = '10px';

            new window.TabulatorFull(wrapper, {
              data: data.children,
              layout: 'fitColumns',
              columns: [
                { title: 'Subproject', field: 'name', sorter: 'string' },
                { title: 'Status', field: 'status', sorter: 'string' },
              ],
              height: 'auto',
            });

            row.getElement().appendChild(wrapper);
            expandedRows.current.add(rowIndex);
            cell.getElement().innerHTML = '<button class="expand-btn">▼</button>';
          }
        }
      },
    },
    { title: 'Project Type', field: 'project_type', sorter: 'string' },
    { title: 'Count', field: 'project_count', sorter: 'number' },
  ];

  const mockData: Project[] = [
    {
      id: 1,
      project_type: 'Governance and Control',
      project_count: 2,
      children: [
        { name: 'Risk Review', status: 'Complete' },
        { name: 'Audit Setup', status: 'Pending' },
      ],
    },
    {
      id: 2,
      project_type: 'Model Development',
      project_count: 3,
      children: [
        { name: 'Credit Risk', status: 'In Progress' },
        { name: 'Market Risk', status: 'In Progress' },
      ],
    },
    {
      id: 3,
      project_type: 'Execution Only',
      project_count: 1,
    },
  ];

  useEffect(() => {
    setData(mockData);
  }, []);

  return (
    <div className="p-4">
      <ReactTabulator
        columns={columns}
        data={myEffortsData}
        layout="fitColumns"
        options={{
          pagination: true,
          paginationSize: 5,
          movableColumns: true,
        }}
        onTableBuilding={() => {
          // Set global Tabulator ref for nested tables
          if (typeof window !== 'undefined') {
            window.TabulatorFull = require('tabulator-tables');
          }
        }}
      />
    </div>
  );
};

export default function ProjectTable() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;
  return <AssignmentTable />;
}
