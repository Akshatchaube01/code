import { FC, useState, createElement } from 'react';
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

  return createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl shadow-sm border-2 border-red-600' },
    createElement(
      'table',
      { className: 'min-w-full table-auto' },
      // Thead
      createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        createElement(
          'tr',
          null,
          createElement(
            'th',
            {
              className:
                'px-6 py-4 text-left text-md font-bold border-r border-white',
            },
            'Project Type'
          ),
          createElement(
            'th',
            {
              className:
                'px-6 py-4 text-center text-md font-bold',
            },
            'Count'
          )
        )
      ),
      // Tbody
      createElement(
        'tbody',
        null,
        ...data.flatMap((row, index) => {
          const isExpanded = expandedIndex[index];
          const rows: React.ReactNode[] = [];

          // Parent Row
          rows.push(
            createElement(
              'tr',
              {
                key: `parent-${index}`,
                className:
                  'bg-white border-b border-red-500 cursor-pointer',
                onClick: () => row.children && toggleExpand(index),
              },
              createElement(
                'td',
                {
                  className: 'px-6 py-4 text-gray-700',
                },
                createElement(
                  'div',
                  { className: 'flex items-center' },
                  row.children
                    ? createElement(ChevronRight, {
                        size: 16,
                        className: `mr-2 transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : ''
                        }`,
                      })
                    : createElement('span', {
                        className: 'w-4 mr-2',
                      }),
                  row.type
                )
              ),
              createElement(
                'td',
                { className: 'px-6 py-4 text-center text-gray-700' },
                row.count
              )
            )
          );

          // Child Rows if Expanded
          if (isExpanded && row.children) {
            row.children.forEach((child, childIndex) => {
              rows.push(
                createElement(
                  'tr',
                  {
                    key: `child-${index}-${childIndex}`,
                    className: 'bg-gray-100 border-b border-red-300',
                  },
                  createElement(
                    'td',
                    { className: 'px-10 py-4 text-gray-700' },
                    `↳ ${child.type}`
                  ),
                  createElement(
                    'td',
                    { className: 'px-6 py-4 text-center text-gray-700' },
                    child.count
                  )
                )
              );
            });
          }

          return rows;
        })
      )
    )
  );
};

export default ProjectTypeTable;
