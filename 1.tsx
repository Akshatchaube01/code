import { FC } from 'react';

type ProjectTypeRow = {
  type: string;
  count: number;
};

type ProjectTypeTableProps = {
  data: ProjectTypeRow[];
};

const ProjectTypeTable: FC<ProjectTypeTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border-2 border-red-600">
      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-md font-bold border-r border-white">Project Type</th>
            <th className="px-6 py-4 text-center text-md font-bold">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="bg-white border-b border-red-500">
              <td className="px-6 py-4 text-gray-700">{row.type}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTypeTable;
