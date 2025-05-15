import React, { useState, createElement } from 'react';

// Define the data structure for each row
interface RowData {
  column1: string;
  column2?: string;
  column3?: number[];
  column4?: number;
  details1?: RowData[];
  details2?: RowData[];
}

interface TableProps {
  columns: { name: string; sub_columns?: string[]; rowspan?: number; colspan?: number }[];
  data: RowData[];
}

const ExpandableUtilizationTable: React.FC<TableProps> = ({ columns, data }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number, keyPrefix: string): React.ReactNode[] => {
    const rowKey = `${keyPrefix}-${row.column1 || ''}-${row.column2 || ''}`;
    const indent = '  '.repeat(level);

    const cells = [
      createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium cursor-pointer',
          onClick: level === 0 ? () => toggleRow(rowKey) : undefined,
          style: { paddingLeft: `${level * 20}px`, fontWeight: level === 0 ? 'bold' : 'normal' },
        },
        row.column1
      ),
      createElement(
        'td',
        {
          key: 'col2',
          className: 'px-4 py-2',
          onClick: level === 1 ? () => toggleRow(`${rowKey}-expand2`) : undefined,
          style: { paddingLeft: `${(level + 1) * 20}px`, cursor: row.details2 ? 'pointer' : 'auto' },
        },
        row.column2 || '-'
      ),
      ...(row.column3 || []).map((val, idx) =>
        createElement(
          'td',
          { key: `col3-${idx}`, className: 'px-4 py-2 text-center' },
          val
        )
      ),
      createElement(
        'td',
        { key: 'col4', className: 'px-4 py-2 font-bold text-center' },
        row.column4 || 0
      )
    ];

    const mainRow = createElement(
      'tr',
      { key: rowKey, className: level === 0 ? 'bg-red-100 border-t border-red-300' : 'bg-white' },
      ...cells
    );

    const children: React.ReactNode[] = [];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[`${rowKey}-expand2`] && row.details2) {
      row.details2.forEach((subchild, i) => {
        const subchildKey = `${rowKey}-subchild${i}`;
        children.push(...renderRow(subchild, level + 2, subchildKey));
      });
    }

    return [mainRow, ...children];
  };

  return createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm' },
    createElement(
      'table',
      { className: 'min-w-full table-auto' },
      createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        createElement(
          'tr',
          null,
          columns.flatMap((col, colIndex) =>
            col.sub_columns ?
              col.sub_columns.map((subCol, subIndex) =>
                createElement(
                  'th',
                  { key: `subcol-${colIndex}-${subIndex}`, className: 'px-4 py-3 text-left' },
                  subCol
                )
              ) :
              [
                createElement(
                  'th',
                  { key: `col-${colIndex}`, colSpan: col.colspan || 1, rowSpan: col.rowspan || 1, className: 'px-4 py-3 text-left' },
                  col.name
                )
              ]
          )
        )
      ),
      createElement(
        'tbody',
        null,
        data.flatMap((row, idx) => renderRow(row, 0, `row-${idx}`))
      )
    )
  );
};

export default ExpandableUtilizationTable;
