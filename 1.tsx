'use client';

declare global {
  interface Window {
    Tabulator: any;
  }
}

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';

import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'tabulator-tables/dist/js/tabulator.min.js';

type SubProject = {
  name: string;
  status: string;
};

type Project = {
  project_type: string;
  project_count: number;
  children?: SubProject[];
};

const AssignmentTable = () => {
  const [myEffortsData, setData] = useState<Project[]>([]);
  const tableRef = useRef<any>(null);
  const expandedRows = useRef<Set<number>>(new Set());

  const columns = [
    {
      title: '',
      formatter: () => '<button class="expand-btn">▶</button>',
      width: 60,
      hozAlign: 'center',
      cellClick: (e: any, cell: any) => {
        const row = cell.getRow();
        const rowIndex = row.getPosition();

        if (expandedRows.current.has(rowIndex)) {
          // Collapse
          const children = row.getElement().querySelectorAll('.child-table-wrapper');
          children.forEach(el => el.remove());
          expandedRows.current.delete(rowIndex);
          cell.getElement().innerHTML = '<button class="expand-btn">▶</button>';
        } else {
          // Expand
          const data = row.getData();
          if (data.children) {
            const wrapper = document.createElement('div');
            wrapper.className = 'child-table-wrapper';
            wrapper.style.padding = '10px';

            new window.Tabulator(wrapper, {
              data: data.children,
              columns: [
                { title: 'Subproject', field: 'name', sorter: 'string' },
                { title: 'Status', field: 'status', sorter: 'string' },
              ],
              layout: 'fitColumns',
              autoResize: true,
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
      project_type: 'Governance and Control',
      project_count: 2,
      children: [
        { name: 'Risk Review', status: 'Complete' },
        { name: 'Audit Setup', status: 'Pending' },
      ],
    },
    {
      project_type: 'Model Development',
      project_count: 3,
      children: [
        { name: 'Credit Risk', status: 'In Progress' },
        { name: 'Market Risk', status: 'In Progress' },
      ],
    },
    { project_type: 'Execution Only', project_count: 1 },
  ];

  useEffect(() => {
    setData(mockData);
  }, []);

  return (
    <div className="p-4">
      <ReactTabulator
        ref={tableRef}
        columns={columns}
        data={myEffortsData}
        layout="fitColumns"
        options={{
          pagination: true,
          paginationSize: 5,
          movableColumns: true,
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
