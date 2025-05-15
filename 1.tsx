import React, { useState, createElement } from 'react';

type RowData = {
  column1: string;
  column2?: string;
  columns: (string | number)[];
  details1?: RowData[];
  details2?: RowData[];
};

type TableProps = {
  columns: { name: string; subColumns?: string[]; colspan?: number; rowspan?: number }[];
  data: RowData[];
};

const ExpandableUtilizationTable: React.FC<TableProps> = ({ columns, data }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number, keyPrefix: string): React.ReactNode[] => {
    const rowKey = `${keyPrefix}-${row.column1 || ''}-${row.column2 || ''}`;
    const indent = '\u00A0'.repeat(level * 4);
    const cells = [
      createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium',
          onClick: level === 0 ? () => toggleRow(rowKey) : undefined,
          style: level === 0 ? { cursor: 'pointer' } : {},
        },
        level === 0 ? row.column1 : `${indent}${row.column1}`
      ),
      createElement(
        'td',
        {
          key: 'col2',
          className: 'px-4 py-2',
          onClick: level === 0 && row.details2 ? () => toggleRow(`${rowKey}-expand2`) : undefined,
          style: level === 0 && row.details2 ? { cursor: 'pointer', fontWeight: '500' } : {},
        },
        level === 0 ? row.column2 || '-' : `${indent}${row.column2 || '-'}`
      ),
      ...row.columns.map((col, idx) =>
        createElement('td', { key: `col-${idx + 3}`, className: 'px-4 py-2' }, col)
      ),
    ];

    const mainRow = createElement(
      'tr',
      { key: rowKey, className: 'border-t border-red-300 bg-white' },
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
      row.details2.forEach((child, i) => {
        const childKey = `${rowKey}-subchild${i}`;
        children.push(...renderRow(child, level + 2, childKey));
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
            createElement(
              'th',
              {
                key: `col-${i}`,
                colSpan: col.colspan || 1,
                rowSpan: col.rowspan || 1,
                className: 'px-4 py-3 text-left',
              },
              col.name
            )
          )
        ),
        createElement(
          'tr',
          null,
          ...columns.flatMap((col, i) =>
            (col.subColumns || []).map((subCol, j) =>
              createElement(
                'th',
                {
                  key: `subcol-${i}-${j}`,
                  className: 'px-4 py-3 text-left',
                },
                subCol
              )
            )
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