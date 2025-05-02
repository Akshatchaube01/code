import React, { useState, createElement } from 'react';

type RowData = {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
  column7: string;
  column?: string;
  details1?: RowData[];
  details2?: RowData[];
};

type TableProps = {
  columns: { name: string }[];
  data: RowData[];
};

const ExpandableUtilizationTable: React.FC<TableProps> = ({ columns, data }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number = 0, keyPrefix: string = ''): any[] => {
    const rowKey = `${keyPrefix}-${row.column1 || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
    const indent = '\u00A0'.repeat(level * 4);

    const mainRow = createElement(
      'tbody',
      { key: rowKey },
      createElement(
        'tr',
        { className: 'border-t border-red-300 bg-white' },
        createElement(
          'td',
          {
            className: 'px-4 py-2 font-medium cursor-pointer',
            onClick: () => toggleRow(rowKey),
          },
          indent + (row.column1 || row.column2 || row.column3 || '-')
        ),
        createElement('td', { className: 'px-4 py-2' }, row.column2),
        createElement('td', { className: 'px-4 py-2' }, row.column3),
        createElement('td', { className: 'px-4 py-2' }, row.column4),
        createElement('td', { className: 'px-4 py-2' }, row.column5),
        createElement('td', { className: 'px-4 py-2' }, row.column6),
        createElement('td', { className: 'px-4 py-2' }, row.column7),
        createElement('td', { className: 'px-4 py-2' }, row.column)
      )
    );

    const children: any[] = [];

    if (expandedRows[rowKey]) {
      row.details1?.forEach((child, i) => {
        children.push(...renderRow(child, level + 1, `${rowKey}-child${i}`));
      });
      row.details2?.forEach((child, j) => {
        children.push(...renderRow(child, level + 2, `${rowKey}-subchild${j}`));
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
          ...columns.map((col, i) =>
            createElement('th', { key: `col-${i}`, className: 'px-4 py-3 text-left' }, col.name)
          )
        )
      ),
      ...data.flatMap((row, idx) => renderRow(row, 0, `row-${idx}`))
    )
  );
};

export default ExpandableUtilizationTable;
