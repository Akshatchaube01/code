'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';

import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'tabulator-tables/dist/js/tabulator.min.js';

type Project = {
  project_type: string;
  project_count: number;
  children?: Project[]; // For nested rows
};

const AssignmentTable = () => {
  const [myEffortsData, setData] = useState<Project[]>([]);
  const tableRef = useRef<any>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const columns: { title: string; field: keyof Project; sorter: string }[] = [
    { title: 'Project Type', field: 'project_type', sorter: 'string' },
    { title: 'Count', field: 'project_count', sorter: 'number' },
  ];

  // Mock Tree Data
  const mockData: Project[] = [
    {
      project_type: 'Governance and Control',
      project_count: 2,
      children: [
        {
          project_type: 'Risk Framework',
          project_count: 1,
        },
        {
          project_type: 'Compliance Review',
          project_count: 1,
        },
      ],
    },
    {
      project_type: 'Model Development (New)',
      project_count: 10,
      children: [
        {
          project_type: 'Credit Risk Model',
          project_count: 6,
        },
        {
          project_type: 'Market Risk Model',
          project_count: 4,
        },
      ],
    },
    {
      project_type: 'Model Execution',
      project_count: 15,
    },
  ];

  useEffect(() => {
    // Replace with axios.get() if fetching from API
    setData(mockData);
  }, []);

  return (
    <div className="p-4">
      <div ref={tableContainerRef}>
        <ReactTabulator
          ref={tableRef}
          columns={columns}
          data={myEffortsData}
          layout="fitColumns"
          options={{
            pagination: false,
            dataTree: true,
            dataTreeStartExpanded: true,
            movableColumns: true,
            clipboard: true,
          }}
        />
      </div>
    </div>
  );
};

export default function ProjectTable() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <AssignmentTable />;
}
