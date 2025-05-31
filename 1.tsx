import React, { useState, createElement } from 'react';

type RowData = {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
  column7: string;
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
    const expand2Key = `${rowKey}-expand2`;
    const indent = '\u00A0\u00A0\u00A0'.repeat(level);

    const cells = [
      createElement('td', { key: 'col1', className: 'px-4 py-2' }, level > 0 ? indent + (row.column1 ?? '') : row.column1 ?? ''),
      createElement('td', { key: 'col2', className: 'px-4 py-2' }, row.column2 ?? ''),
      createElement('td', { key: 'col3', className: 'px-4 py-2' }, row.column3 ?? ''),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4 ?? ''),
      createElement('td', { key: 'col5', className: 'px-4 py-2' }, row.column5 ?? ''),
      createElement('td', { key: 'col6', className: 'px-4 py-2' }, row.column6 ?? ''),
      createElement('td', { key: 'col7', className: 'px-4 py-2' }, row.column7 ?? ''),
    ];

    const mainRow = createElement(
      'tr',
      {
        key: rowKey,
        className: 'border-t border-red-300 bg-white hover:bg-gray-50 cursor-pointer',
        onClick: () => {
          if (level === 0 && row.details1) {
            toggleRow(rowKey);
          } else if (level === 1 && row.details2) {
            toggleRow(expand2Key);
          }
        },
      },
      ...cells
    );

    const children: any[] = [];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child-${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[expand2Key] && row.details2) {
      row.details2.forEach((child, i) => {
        const childKey = `${rowKey}-subchild-${i}`;
        children.push(...renderRow(child, level + 2, childKey));
      });
    }

    return [mainRow, ...children];
  };

  // Sum columns
  let sumCol4 = 0;
  let sumCol5 = 0;
  let sumCol6 = 0;
  let sumCol7 = 0;

  const accumulateSums = (rows: RowData[]) => {
    rows.forEach((row) => {
      const n4 = parseFloat(row.column4);
      const n5 = parseFloat(row.column5);
      const n6 = parseFloat(row.column6);
      const n7 = parseFloat(row.column7);

      if (!isNaN(n4)) sumCol4 += n4;
      if (!isNaN(n5)) sumCol5 += n5;
      if (!isNaN(n6)) sumCol6 += n6;
      if (!isNaN(n7)) sumCol7 += n7;

      if (row.details1) accumulateSums(row.details1);
      if (row.details2) accumulateSums(row.details2);
    });
  };

  accumulateSums(data);

  const totalRow = createElement(
    'tr',
    { key: 'total-row', className: 'bg-red-100 font-bold border-t border-red-400' },
    createElement('td', { className: 'px-4 py-2' }, 'Total'),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, sumCol4.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol5.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol6.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, sumCol7.toFixed(2))
  );

  return createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' },
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
