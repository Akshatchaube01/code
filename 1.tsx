import React, { useState, createElement } from 'react';

type RowData = {
  column1: string; // project label
  column2: string;
  column3: string;
  column4: string;
  column5: string; // ← was previously 'columns', renamed to avoid conflict
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
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number, keyPrefix: string): any[] => {
    const rowKey = `${keyPrefix}-${row.column1 ?? ''}-${row.column2 ?? ''}-${row.column3 ?? ''}-${level}`;
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
        row.column1 ?? ''
      ),
      createElement(
        'td',
        {
          key: 'col2',
          className: 'px-4 py-2',
          onClick: level === 1 && row.details2 ? () => toggleRow(`${rowKey}-expand2`) : undefined,
          style: level === 1 && row.details2 ? { cursor: 'pointer', fontWeight: '500' } : undefined,
        },
        level > 0 ? indent + (row.column2 ?? '-') : row.column2 ?? '-'
      ),
      createElement('td', { key: 'col3', className: 'px-4 py-2' }, row.column3 ?? ''),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4 ?? ''),
      createElement('td', { key: 'col5', className: 'px-4 py-2' }, row.column5 ?? ''), // fixed
      createElement('td', { key: 'col6', className: 'px-4 py-2' }, row.column6 ?? ''),
      createElement('td', { key: 'col7', className: 'px-4 py-2' }, row.column7 ?? ''),
      createElement('td', { key: 'col8', className: 'px-4 py-2' }, row.column ?? ''),
    ];

    const mainRow = createElement(
      'tr',
      { key: rowKey, className: 'border-t border-red-300 bg-white' },
      ...cells
    );

    const children: any[] = [];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child-${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[`${rowKey}-expand2`] && row.details2) {
      row.details2.forEach((child, j) => {
        const childKey = `${rowKey}-subchild-${j}`;
        children.push(...renderRow(child, level + 2, childKey));
      });
    }

    return [mainRow, ...children];
  };

  // Totals
  let sumCol4 = 0;
  let sumCol5 = 0;
  let sumCol6 = 0;
  let sumCol7 = 0;
  let sumCol8 = 0;

  data.forEach((row) => {
    const n4 = parseFloat(row.column4);
    const n5 = parseFloat(row.column5);
    const n6 = parseFloat(row.column6);
    const n7 = parseFloat(row.column7);
    const n8 = parseFloat(row.column ?? '0');

    if (!isNaN(n4)) sumCol4 += n4;
    if (!isNaN(n5)) sumCol5 += n5;
    if (!isNaN(n6)) sumCol6 += n6;
    if (!isNaN(n7)) sumCol7 += n7;
    if (!isNaN(n8)) sumCol8 += n8;
  });

  const totalRow = createElement(
    'tr',
    { key: 'total-row', className: 'bg-red-100 font-bold border-t border-red-400' },
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, sumCol4.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol5.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol6.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol7.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol8.toFixed(2))
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
