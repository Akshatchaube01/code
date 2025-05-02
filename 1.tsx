import { FC, useState } from 'react';
import { ChevronRight } from 'lucide-react';

type ProjectRow = {
  label: string;
  children: {
    type: string;
    fte: number;
    expectedEffort: number;
    actualEffort: number;
    actualEffortPercent: string;
    utilization: string;
  }[];
};

type ProjectTableProps = {
  data: ProjectRow[];
};

const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-red-500">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left border-r">Project Label</th>
            <th className="px-4 py-2 text-left border-r">Project Type</th>
            <th className="px-4 py-2 text-center border-r">FTE Allocated</th>
            <th className="px-4 py-2 text-center border-r">Expected Effort (in hours)</th>
            <th className="px-4 py-2 text-center border-r">Actual Effort (in hours)</th>
            <th className="px-4 py-2 text-center border-r">% of Actual Total Effort</th>
            <th className="px-4 py-2 text-center">Utilization %</th>
          </tr>
        </thead>
        <tbody>
          {data.flatMap((row, index) => {
            const isOpen = expanded[index];
            const rows: React.ReactNode[] = [];

            // Parent row
            rows.push(
              <tr
                key={`parent-${index}`}
                className="bg-white border-b border-red-300 cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <td className="px-4 py-2 text-gray-800 font-medium">
                  <div className="flex items-center">
                    <ChevronRight
                      size={16}
                      className={`mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    />
                    {row.label}
                  </div>
                </td>
                <td className="px-4 py-2 italic text-gray-400">Click to expand</td>
                <td colSpan={5}></td>
              </tr>
            );

            // Child rows
            if (isOpen) {
              row.children.forEach((child, childIdx) => {
                rows.push(
                  <tr key={`child-${index}-${childIdx}`} className="bg-gray-50 border-b border-red-200">
                    <td className="px-4 py-2 text-gray-400"></td>
                    <td className="px-4 py-2 text-gray-800">↳ {child.type}</td>
                    <td className="px-4 py-2 text-center">{child.fte.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{child.expectedEffort.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{child.actualEffort.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{child.actualEffortPercent}</td>
                    <td className="px-4 py-2 text-center">{child.utilization}</td>
                  </tr>
                );
              });
            }

            return rows;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
