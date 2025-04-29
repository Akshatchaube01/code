import { FC, useState } from 'react';
import { ChevronRight } from 'lucide-react';

type ProjectTypeRow = {
  type: string;
  count: number;
  children?: ProjectTypeRow[];
};

type ProjectTypeTableProps = {
  data: ProjectTypeRow[];
};

const ProjectTypeTable: FC<ProjectTypeTableProps> = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => ({ ...prev, [index]: !prev[index] }));
  };

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
          {data.flatMap((row, index) => {
            const isExpanded = expandedIndex[index];
            const rows: JSX.Element[] = [];

            rows.push(
              <tr
                key={`parent-${index}`}
                className="bg-white border-b border-red-500 cursor-pointer"
                onClick={() => row.children && toggleExpand(index)}
              >
                <td className="px-6 py-4 text-gray-700 flex items-center">
                  {row.children ? (
                    <ChevronRight
                      size={16}
                      className={`mr-2 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  ) : (
                    <span className="w-4 mr-2" />
                  )}
                  {row.type}
                </td>
                <td className="px-6 py-4 text-center text-gray-700">{row.count}</td>
              </tr>
            );

            if (isExpanded && row.children) {
              row.children.forEach((child, childIndex) => {
                rows.push(
                  <tr key={`child-${index}-${childIndex}`} className="bg-gray-100 border-b border-red-300">
                    <td className="px-10 py-4 text-gray-700">↳ {child.type}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{child.count}</td>
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

export default ProjectTypeTable;
