import { FC } from 'react';

const ProjectTypeTable: FC = () => {
  const data = [
    { type: 'Governance and Control', count: 2 },
    { type: 'Model Development (New)', count: 20 },
    { type: 'Model Execution', count: 15 },
    { type: 'Model Implementation', count: 1 },
    { type: 'Model Monitoring', count: 7 },
    { type: 'Tool Development and Maintenance', count: 4 },
  ];

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
