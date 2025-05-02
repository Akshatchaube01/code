import React from 'react';

type ProjectsByType = {
  "Project Type": { [key: string]: string };
  "Count": { [key: string]: number };
};

type ProjectTypeTableProps = {
  data: ProjectsByType;
};

const ProjectTypeTable: React.FC<ProjectTypeTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border-2 border-red-600 w-full">
      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Project Type</th>
            <th className="px-6 py-3 text-left font-semibold">Count</th>
          </tr>
        </thead>
        <tbody className="bg-white text-black">
          {Object.keys(data["Project Type"]).map((key) => (
            <tr key={key} className="border-t border-red-300">
              <td className="px-6 py-4">{data["Project Type"][key].trim()}</td>
              <td className="px-6 py-4">{data["Count"][key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTypeTable;
