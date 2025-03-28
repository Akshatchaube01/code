"use client"

import React, { useEffect, useState } from "react";
import 'react-tabulator/lib/css/tabulator.min.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css'; // use Theme(s)
import { ReactTabulator, ReactTabulatorOptions, ColumnDefinition } from 'react-tabulator';

interface TableComponentProps {
  data: any[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data }) => {
  const columns: ColumnDefinition[] = [
    { title: "Quarter", field: "quarter", width: 150 },
    { title: "Model Cyclicality Long Run", field: "modelCyclicality", width: 250 },
    { title: "Final Cyclicality Long Run", field: "finalCyclicality", width: 250 },
  ];

  const formattedData = data.map((row, index) => ({
    id: index + 1,
    quarter: row.month,
    modelCyclicality: row.desktop,
    finalCyclicality: row.laptop,
  }));

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading table...</div>;

  const options: ReactTabulatorOptions = {
    height: 350,
    movableRows: true,
    movableColumns: true,
    layout: "fitColumns",
    resizableColumns: true,
  };

  return (
    <div>
      <ReactTabulator 
        data={formattedData} 
        columns={columns} 
        layout="fitDataStretch" 
        options={options} 
        className="rounded-lg hover:shadow-lg transition-shadow"
      />
    </div>
  );
};

export default TableComponent;