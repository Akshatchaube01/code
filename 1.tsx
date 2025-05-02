import React, { useState, createElement } from 'react';

type FixedTableData = {
  column: {
    name: string;
    sub_columns?: string[];
    rowspan?: number;
    colspan?: number;
  }[];
  data: (string | number)[][];
  total: (string | number)[];
  other: {
    table_id: string;
    table_heading: string;
  };
};

type Props = {
  tableData: FixedTableData;
};

const ExpandableGCBTable: React.FC<Props> = ({ tableData }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => setExpanded(!expanded);

  const headerRows = () => {
    const firstRow = tableData.column.map((col, i) =>
      createElement(
        'th',
        {
          key: `head1-${i}`,
          className: 'px-4 py-2 text-left border',
          rowSpan: col.sub_columns && col.sub_columns.length ? 1 : 2,
          colSpan: col.sub_columns?.length || 1,
        },
        col.name
      )
    );

    const secondRow = tableData.column
      .filter(col => col.sub_columns && col.sub_columns.length)
      .flatMap(col =>
        col.sub_columns!.map((sub, j) =>
          createElement(
            'th',
            {
              key: `head2-${col.name}-${j}`,
              className: 'px-4 py-2 text-left border',
            },
            sub
          )
        )
      );

    return [
      createElement('tr', { key: 'row1' }, ...firstRow),
      secondRow.length ? createElement('tr', { key: 'row2' }, ...secondRow) : null,
    ];
  };

  const mainRow = (row: (string | number)[], index: number) =>
    createElement(
      'tbody',
      { key: `main-${index}` },
      createElement(
        'tr',
        { className: 'bg-white border-t border-red-300' },
        ...row.map((cell, i) =>
          createElement(
            'td',
            {
              key: `cell-${index}-${i}`,
              className: 'px-4 py-2 cursor-pointer',
              onClick: i === 0 ? toggleExpand : undefined,
            },
            cell
          )
        )
      )
    );

  const detailRow = (row: (string | number)[], index: number) =>
    expanded
      ? createElement(
          'tbody',
          { key: `expand-${index}` },
          createElement(
            'tr',
            { className: 'bg-gray-50 border-t border-red-300' },
            createElement(
              'td',
              { className: 'px-4 py-2 italic text-sm', colSpan: row.length },
              'Additional breakdown or employee list goes here...'
            )
          )
        )
      : null;

  const totalRow = (row: (string | number)[]) =>
    createElement(
      'tbody',
      { key: 'total' },
      createElement(
        'tr',
        { className: 'bg-red-100 font-semibold border-t border-red-300' },
        ...row.map((cell, i) =>
          createElement('td', { key: `total-${i}`, className: 'px-4 py-2' }, cell)
        )
      )
    );

  return createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm mt-4' },
    createElement(
      'table',
      { className: 'min-w-full table-auto text-sm text-left' },
      createElement('thead', { className: 'bg-red-600 text-white' }, ...headerRows()),
      ...tableData.data.map((row, i) => [mainRow(row, i), detailRow(row, i)]).flat(),
      totalRow(tableData.total)
    )
  );
};

export default ExpandableGCBTable;
