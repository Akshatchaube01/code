import React, { useState, createElement } from 'react';

type RowData = {
  columna: string;
  column2: string;
  column3: string;
  column4: string;
  columns: string;
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
    const rowKey = `${keyPrefix}-${row.columna || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
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
        row.columna
      ),
      createElement(
        'td',
        {
          key: 'col2',
          className: 'px-4 py-2',
          onClick: level === 1 && row.details2 ? () => toggleRow(`${rowKey}-expand2`) : undefined,
          style: level === 1 && row.details2 ? { cursor: 'pointer', fontWeight: '500' } : undefined,
        },
        level > 0 ? indent + (row.column2 || '-') : row.column2
      ),
      createElement('td', { key: 'col3', className: 'px-4 py-2' }, row.column3),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
      createElement('td', { key: 'col5', className: 'px-4 py-2' }, row.columns),
      createElement('td', { key: 'col6', className: 'px-4 py-2' }, row.column6),
      createElement('td', { key: 'col7', className: 'px-4 py-2' }, row.column7),
      createElement('td', { key: 'col8', className: 'px-4 py-2' }, row.column),
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

  // Total calculations
  let totalColumn3 = 0;
  let totalColumn4 = 0;

  const accumulateTotals = (rows: RowData[]) => {
    rows.forEach((row) => {
      const val3 = parseFloat(row.column3);
      const val4 = parseFloat(row.column4);
      totalColumn3 += !isNaN(val3) ? val3 : 0;
      totalColumn4 += !isNaN(val4) ? val4 : 0;

      if (row.details1) accumulateTotals(row.details1);
      if (row.details2) accumulateTotals(row.details2);
    });
  };

  accumulateTotals(data);

  const totalRow = createElement(
    'tr',
    { key: 'total-row', className: 'bg-red-100 font-bold' },
    createElement('td', { className: 'px-4 py-2', colSpan: 2 }, 'Totals'),
    createElement('td', { className: 'px-4 py-2' }, totalColumn3.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, totalColumn4.toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }),
    createElement('td', { className: 'px-4 py-2' }),
    createElement('td', { className: 'px-4 py-2' }),
    createElement('td', { className: 'px-4 py-2' })
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
