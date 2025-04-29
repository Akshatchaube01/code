import { FC, useEffect, useRef } from 'react';
import Tabulator from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import './tailwind-tabulator.css'; // You must create this file to apply Tailwind styles

type ProjectRow = {
  type: string;
  count: number;
  _children?: ProjectRow[];
};

type ProjectTypeTabulatorProps = {
  data: ProjectRow[];
};

const ProjectTypeTabulator: FC<ProjectTypeTabulatorProps> = ({ data }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      new Tabulator(tableRef.current, {
        data,
        layout: 'fitColumns',
        height: 'auto',
        reactiveData: true,
        dataTree: true,
        dataTreeStartExpanded: true,
        columns: [
          {
            title: 'Project Type',
            field: 'type',
            headerSort: false,
            hozAlign: 'left',
            cellClass: 'px-6 py-4 text-gray-700',
            headerClass: 'bg-red-600 text-white px-6 py-4 text-md font-bold border-r border-white text-left',
          },
          {
            title: 'Count',
            field: 'count',
            headerSort: false,
            hozAlign: 'center',
            cellClass: 'px-6 py-4 text-center text-gray-700',
            headerClass: 'bg-red-600 text-white px-6 py-4 text-md font-bold text-center',
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border-2 border-red-600">
      <div ref={tableRef} />
    </div>
  );
};

export default ProjectTypeTabulator;
