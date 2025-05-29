import React, { useState, createElement } from 'react';

type RowData = {
  columni: string;
  column2: string;
  column3: string;
  column4: number;
  column5: number;
  column6: number;
  column7: number;
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

  const renderRow = (row: RowData, level: number, keyPrefix: string): any[] => {
    const rowKey = `${keyPrefix}-${row.columni || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
    const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(level);

    const cells = [
      createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium',
          onClick: level === 0 ? () => toggleRow(rowKey) : undefined,
          style: level === 0 ? { cursor: 'pointer' } : undefined,
        },
        level === 0 ? row.columni : indent + (row.columni || '-')
      ),
      createElement('td', { key: 'col2', className: 'px-4 py-2' }, row.column2),
      createElement('td', { key: 'col3', className: 'px-4 py-2' }, row.column3),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
      createElement('td', { key: 'col5', className: 'px-4 py-2' }, row.column5),
      createElement('td', { key: 'col6', className: 'px-4 py-2' }, row.column6),
      createElement('td', { key: 'col7', className: 'px-4 py-2' }, row.column7),
      createElement('td', { key: 'col8', className: 'px-4 py-2' }, row.column || ''),
    ];

    const mainRow = createElement('tr', { key: rowKey, className: 'border-t border-red-300 bg-white' }, ...cells);

    const children: any[] = [];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[`${rowKey}-expand2`] && row.details2) {
      row.details2.forEach((child, j) => {
        const childKey = `${rowKey}-subchild${j}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    return [mainRow, ...children];
  };

  // Calculate totals for visible (top-level) rows
  const totals = data.reduce(
    (acc, row) => {
      acc.column4 += row.column4 || 0;
      acc.column5 += row.column5 || 0;
      acc.column6 += row.column6 || 0;
      acc.column7 += row.column7 || 0;
      return acc;
    },
    { column4: 0, column5: 0, column6: 0, column7: 0 }
  );

  const totalRow = createElement(
    'tr',
    { key: 'total-row', className: 'border-t-2 border-red-600 bg-red-100 font-bold' },
    createElement('td', { className: 'px-4 py-2', colSpan: 3 }, 'Total'),
    createElement('td', { className: 'px-4 py-2' }, totals.column4),
    createElement('td', { className: 'px-4 py-2' }, totals.column5),
    createElement('td', { className: 'px-4 py-2' }, totals.column6),
    createElement('td', { className: 'px-4 py-2' }, totals.column7),
    createElement('td', { className: 'px-4 py-2' }, '')
  );

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
      createElement(
        'tbody',
        null,
        ...data.flatMap((row, idx) => renderRow(row, 0, `row-${idx}`)),
        totalRow
      )
    )
  );
};

export default ExpandableUtilizationTable;
