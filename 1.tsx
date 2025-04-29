import { FC, useState, createElement } from 'react';
import { ChevronRight } from 'lucide-react';

type GCBRow = {
  country: string;
  gcb3: number;
  gcb4: number;
  gcb5: number;
  gcb6: number;
  gcbNA: number;
  total: number;
  children?: GCBRow[];
};

type GCBTableProps = {
  data: GCBRow[];
};

const GCBTable: FC<GCBTableProps> = ({ data }) => {
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
        null,
        createElement(
          'tr',
          { className: 'bg-red-600 text-white' },
          createElement(
            'th',
            {
              className: 'px-6 py-4 text-left text-md font-bold border-r border-white',
            },
            'Work Location Country'
          ),
          createElement(
            'th',
            {
              className: 'px-6 py-4 text-center text-md font-bold border-r border-white',
              colSpan: 5,
            },
            'Employee Count by Global Career Band'
          ),
          createElement(
            'th',
            {
              className: 'px-6 py-4 text-center text-md font-bold',
            },
            'Total'
          )
        ),
        createElement(
          'tr',
          { className: 'bg-red-600 text-white' },
          createElement('th', { className: 'px-6 py-2 border-r border-white' }),
          ...['GCB-3', 'GCB-4', 'GCB-5', 'GCB-6', 'GCB-Not Applicable'].map((label, i) =>
            createElement(
              'th',
              {
                key: `sub-header-${i}`,
                className: 'px-6 py-2 text-center border-r border-white',
              },
              label
            )
          ),
          createElement('th', { className: 'px-6 py-2 text-center' }, 'Total')
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
                className: 'bg-white border-b border-red-500 cursor-pointer',
                onClick: () => row.children && toggleExpand(index),
              },
              createElement(
                'td',
                { className: 'px-6 py-4 text-gray-700' },
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
                    : createElement('span', { className: 'w-4 mr-2' }),
                  row.country
                )
              ),
              ...['gcb3', 'gcb4', 'gcb5', 'gcb6', 'gcbNA'].map(field =>
                createElement(
                  'td',
                  {
                    key: field,
                    className: 'px-6 py-4 text-center text-gray-700',
                  },
                  row[field as keyof GCBRow]
                )
              ),
              createElement(
                'td',
                { className: 'px-6 py-4 text-center text-gray-700' },
                row.total
              )
            )
          );

          // Children Rows
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
                    `↳ ${child.country}`
                  ),
                  ...['gcb3', 'gcb4', 'gcb5', 'gcb6', 'gcbNA'].map(field =>
                    createElement(
                      'td',
                      {
                        key: field,
                        className: 'px-6 py-4 text-center text-gray-700',
                      },
                      child[field as keyof GCBRow]
                    )
                  ),
                  createElement(
                    'td',
                    { className: 'px-6 py-4 text-center text-gray-700' },
                    child.total
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

export default GCBTable;
