'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'tabulator-tables/dist/js/tabulator.min.js';

type Project = {
  project_type: string;
  project_count: number;
  children?: Project[];
};

const AssignmentTable = () => {
  const [myEffortsData, setData] = useState<Project[]>([]);
  const tableRef = useRef<any>(null);

  const columns = [
    {
      title: '',
      formatter: (cell: any) => {
        const row = cell.getRow();
        const hasChildren = row.getData().children;
        return hasChildren
          ? `<button class="expand-btn">▶</button>`
          : '';
      },
      width: 50,
      hozAlign: 'center',
      cellClick: (e: any, cell: any) => {
        const row = cell.getRow();
        if (row.getData().children) {
          row.treeToggle();
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
        { project_type: 'Risk Framework', project_count: 1 },
        { project_type: 'Compliance Review', project_count: 1 },
      ],
    },
    {
      project_type: 'Model Development (New)',
      project_count: 10,
      children: [
        { project_type: 'Credit Risk Model', project_count: 6 },
        { project_type: 'Market Risk Model', project_count: 4 },
      ],
    },
    { project_type: 'Model Execution', project_count: 15 },
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
          dataTree: true,
          dataTreeStartExpanded: false,
          movableColumns: true,
          clipboard: true,
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
