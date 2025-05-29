import React, { useState, createElement } from 'react';

type RowData = {
  columni: string;
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
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number, keyPrefix: string): any[] => {
    const rowKey = `${keyPrefix}-${row.columni || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
    const indent = '    '.repeat(level); // Unicode spaces

    const cells = [
      createElement('td', {
        key: 'col1',
        className: 'px-4 py-2 font-medium',
        onClick: level === 0 ? () => toggleRow(rowKey) : undefined,
        style: level === 0 ? { cursor: 'pointer' } : {},
      }, row.columni),
      createElement('td', {
        key: 'col2',
        className: 'px-4 py-2',
        onClick: level === 1 && row.details2 ? () => toggleRow(`${rowKey}-expand2`) : undefined,
        style: level === 1 && row.details2 ? { cursor: 'pointer', fontWeight: '500' } : {},
      }, level > 0 ? indent + (row.column2 || '-') : row.column2),
      createElement('td', { key: 'col3', className: 'px-4 py-2' }, row.column3),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
      createElement('td', { key: 'col5', className: 'px-4 py-2' }, row.column5),
      createElement('td', { key: 'col6', className: 'px-4 py-2' }, row.column6),
      createElement('td', { key: 'col7', className: 'px-4 py-2' }, row.column7),
      createElement('td', { key: 'col8', className: 'px-4 py-2' }, row.column),
    ];

    const mainRow = createElement('tr', {
      key: rowKey,
      className: 'border-t border-red-300 bg-white'
    }, ...cells);

    const children: any[] = [mainRow];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[`${rowKey}-expand2`] && row.details2) {
      row.details2.forEach((child, j) => {
        const childKey = `${rowKey}-subchild${j}`;
        children.push(...renderRow(child, level + 2, childKey));
      });
    }

    return children;
  };

  // Helper to sum a column from all rows
  const getColumnSum = (key: keyof RowData): number => {
    const flatten = (rows: RowData[]): RowData[] =>
      rows.flatMap(row => [
        row,
        ...(row.details1 ? flatten(row.details1) : []),
        ...(row.details2 ? flatten(row.details2) : [])
      ]);

    return flatten(data)
      .map(row => parseFloat((row[key] || '0') as string))
      .filter(n => !isNaN(n))
      .reduce((acc, val) => acc + val, 0);
  };

  const totalRow = createElement('tr', { className: 'bg-red-100 font-bold' }, [
    createElement('td', { className: 'px-4 py-2' }, 'Total'),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, ''),
    createElement('td', { className: 'px-4 py-2' }, getColumnSum('column5').toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, getColumnSum('column6').toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, getColumnSum('column7').toFixed(2)),
    createElement('td', { className: 'px-4 py-2' }, getColumnSum('column').toFixed(2)),
  ]);

  return createElement('div', { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm' },
    createElement('table', { className: 'min-w-full table-auto' },
      createElement('thead', { className: 'bg-red-600 text-white' },
        createElement('tr', {},
          columns.map((col, i) =>
            createElement('th', {
              key: `col-${i}`,
              className: 'px-4 py-3 text-left'
            }, col.name)
          )
        )
      ),
      createElement('tbody', {},
        ...data.flatMap((row, idx) => renderRow(row, 0, `row-${idx}`)),
        totalRow
      )
    )
  );
};

export default ExpandableUtilizationTable;
