import { FC, useState } from 'react';
import { ChevronRight } from 'lucide-react';

type ProjectRow = {
  type: string;
  fte: number;
  expectedEffort: number;
  actualEffort: number;
  actualEffortPercent: string;
  utilization: string;
  children?: ProjectRow[];
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
            const mainRow = (
              <tr
                key={`parent-${index}`}
                className="bg-white border-b border-red-300 cursor-pointer"
                onClick={() => row.children && toggleExpand(index)}
              >
                <td className="px-4 py-2 text-gray-800">
                  <div className="flex items-center">
                    {row.children ? (
                      <ChevronRight
                        size={16}
                        className={`mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      />
                    ) : (
                      <span className="w-4 mr-2" />
                    )}
                    {row.type}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">{row.fte.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">{row.expectedEffort.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">{row.actualEffort.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">{row.actualEffortPercent}</td>
                <td className="px-4 py-2 text-center">{row.utilization}</td>
              </tr>
            );

            const childrenRows =
              isOpen && row.children
                ? row.children.map((child, childIdx) => (
                    <tr key={`child-${index}-${childIdx}`} className="bg-gray-50 border-b border-red-200">
                      <td className="px-8 py-2 text-gray-700">↳ {child.type}</td>
                      <td className="px-4 py-2 text-center">{child.fte.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">{child.expectedEffort.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">{child.actualEffort.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">{child.actualEffortPercent}</td>
                      <td className="px-4 py-2 text-center">{child.utilization}</td>
                    </tr>
                  ))
                : [];

            return [mainRow, ...childrenRows];
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;




const tableData: ProjectRow[] = [
  {
    type: 'LIBRA',
    fte: 56.0,
    expectedEffort: 2208.0,
    actualEffort: 0.0,
    actualEffortPercent: '-',
    utilization: '0.00%',
    children: [
      {
        type: 'Model Development (New)',
        fte: 51.45,
        expectedEffort: 2026.0,
        actualEffort: 0.0,
        actualEffortPercent: '-',
        utilization: '0.00%',
      },
      {
        type: 'Tool Development and Maintenance',
        fte: 2.55,
        expectedEffort: 102.0,
        actualEffort: 0.0,
        actualEffortPercent: '-',
        utilization: '0.00%',
      },
      {
        type: 'Model Implementation',
        fte: 2.0,
        expectedEffort: 80.0,
        actualEffort: 0.0,
        actualEffortPercent: '-',
        utilization: '0.00%',
      },
    ],
  },
];
