import { FC } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css'; // core Tabulator CSS
import 'react-tabulator/css/tabulator.min.css'; // default theme
import './tailwind-tabulator.css'; // custom Tailwind override (explained below)

type ProjectRow = {
  type: string;
  count: number;
  _children?: ProjectRow[];
};

type ProjectTypeTabulatorProps = {
  data: ProjectRow[];
};

const columns = [
  {
    title: 'Project Type',
    field: 'type',
    headerSort: false,
    hozAlign: 'left',
    headerVertical: 'middle',
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
];

const ProjectTypeTabulator: FC<ProjectTypeTabulatorProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border-2 border-red-600">
      <ReactTabulator
        data={data}
        columns={columns}
        layout="fitColumns"
        dataTree={true}
        dataTreeStartExpanded={true}
        reactiveData={true}
        options={{ height: 'auto' }}
      />
    </div>
  );
};

export default ProjectTypeTabulator;
