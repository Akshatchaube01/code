import React, { useState, createElement } from 'react';

type TableColumn = {
  name: string;
  sub_columns?: string[];
};

type RowEntry = {
  row: (string | number)[];
  details?: (string | number)[][];
};

type GCBTableData = {
  column: TableColumn[]; // <- changed from columns to column
  data: RowEntry[];
  total: (string | number)[];
};

type Props = {
  tableData: GCBTableData;
};

const TeamGCBExpandableTable: React.FC<Props> = ({ tableData }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderHeader = () => {
    const firstRow = tableData.column.map((col, i) =>
      createElement(
        'th',
        {
          key: `head1-${i}`,
          className: 'px-4 py-2 text-left border',
          colSpan: col.sub_columns?.length || 1,
          rowSpan: col.sub_columns?.length ? 1 : 2,
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
            { key: `subhead-${j}`, className: 'px-4 py-2 text-left border' },
            sub
          )
        )
      );

    return [
      createElement('tr', { key: 'row1' }, ...firstRow),
      secondRow.length > 0 ? createElement('tr', { key: 'row2' }, ...secondRow) : null,
    ];
  };

  const renderMainRow = (row: (string | number)[], index: number) =>
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
              className: 'px-4 py-2',
              onClick: i === 0 ? () => toggleExpand(index) : undefined,
              style: i === 0 ? { cursor: 'pointer', fontWeight: '500' } : {},
            },
            cell
          )
        )
      )
    );

  const renderDetailRows = (details: (string | number)[][], index: number) =>
    expanded[index] && details.length > 0
      ? createElement(
          'tbody',
          { key: `details-${index}` },
          ...details.map((detail, j) =>
            createElement(
              'tr',
              { key: `detail-${index}-${j}`, className: 'bg-gray-50 border-t border-red-300' },
              ...detail.map((cell, i) =>
                createElement(
                  'td',
                  { key: `detail-${j}-${i}`, className: 'px-4 py-2' },
                  cell
                )
              )
            )
          )
        )
      : null;

  const renderTotalRow = (row: (string | number)[]) =>
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
      createElement('thead', { className: 'bg-red-600 text-white' }, ...renderHeader()),
      ...tableData.data.map((entry, i) => [
        renderMainRow(entry.row, i),
        renderDetailRows(entry.details || [], i),
      ]).flat(),
      renderTotalRow(tableData.total)
    )
  );
};

export default TeamGCBExpandableTable;
