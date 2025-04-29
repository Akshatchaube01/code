import { FC, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

type ProjectTypeRow = {
  type: string;
  count: number;
  children?: ProjectTypeRow[];
};

type ProjectTypeTableProps = {
  data: ProjectTypeRow[];
};

const ProjectTypeTable: FC<ProjectTypeTableProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
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
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <tr
                className="bg-white border-b border-red-500 cursor-pointer"
                onClick={() => row.children && toggleExpand(index)}
              >
                <td className="px-6 py-4 text-gray-700 flex items-center">
                  {row.children ? (
                    <span
                      className={`transition-transform mr-2 duration-300 ${
                        expanded[index] ? 'rotate-90' : ''
                      }`}
                    >
                      <ChevronRight size={16} />
                    </span>
                  ) : (
                    <span className="w-4 mr-2" />
                  )}
                  {row.type}
                </td>
                <td className="px-6 py-4 text-center text-gray-700">{row.count}</td>
              </tr>
              {expanded[index] &&
                row.children?.map((child, cIndex) => (
                  <tr key={cIndex} className="bg-gray-100 border-b border-red-300">
                    <td className="px-10 py-4 text-gray-700">↳ {child.type}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{child.count}</td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTypeTable;
