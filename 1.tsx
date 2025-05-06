'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ReactTabulator } from 'react-tabulator';
import type { ReactTabulatorOptions } from 'react-tabulator';
import axios from 'axios';

import 'tabulator-tables/dist/css/tabulator.min.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

interface ProjectTypeL2 {
  project_type_12_id: number;
  project_type_12_name: string;
  project_type_id: number;
  project_type_name?: string;
}

interface ProjectTypeL2TableProps {
  data: ProjectTypeL2[];
  onUpdate: () => void;
}

const Table = ({ data, onUpdate }: ProjectTypeL2TableProps) => {
  const tableRef = useRef<any>(null);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/propel/project_type_12/${id}`);
      onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSave = async (rowData: ProjectTypeL2) => {
    try {
      await axios.put(`http://127.0.0.1:8000/propel/project_type_12/${rowData.project_type_12_id}`, {
        project_type_12_name: rowData.project_type_12_name,
        project_type_id: rowData.project_type_id,
      });
      onUpdate();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      field: 'project_type_12_id',
      hozAlign: 'center',
      width: 70,
      sorter: 'number',
      headerFilter: 'input',
    },
    {
      title: 'Project Type L2',
      field: 'project_type_12_name',
      editor: 'input',
      sorter: 'string',
      headerFilter: 'input',
    },
    {
      title: 'Project Type ID',
      field: 'project_type_id',
      editor: 'input',
      sorter: 'number',
      hozAlign: 'center',
    },
    {
      title: 'Actions',
      field: 'actions',
      hozAlign: 'center',
      width: 150,
      formatter: () => `
        <button class='save-btn bg-blue-600 text-white px-2 py-1 rounded mr-1'>Save</button>
        <button class='delete-btn bg-red-600 text-white px-2 py-1 rounded'>Delete</button>
      `,
      cellClick: function (e: any, cell: any) {
        const rowData: ProjectTypeL2 = cell.getRow().getData();
        const target = e.target;

        if (target.classList.contains('delete-btn')) {
          handleDelete(rowData.project_type_12_id);
        } else if (target.classList.contains('save-btn')) {
          handleSave(rowData);
        }
      },
    },
  ];

  const options: ReactTabulatorOptions = {
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 8,
    movableColumns: true,
    resizableRows: true,
    reactiveData: true,
    height: '330px',
  };

  return (
    <div>
      <ReactTabulator ref={tableRef} data={data} columns={columns} options={options} />
    </div>
  );
};

export const TableComponent = ({
  data,
  onUpdate,
}: {
  data: ProjectTypeL2[];
  onUpdate: () => void;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <section className="p-4 bg-white rounded shadow-lg">
      <h2 className="font-semibold text-lg mb-4 underline">Edit Project Type L2</h2>
      <Table data={data} onUpdate={onUpdate} />
    </section>
  );
};
