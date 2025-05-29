import React, { useState, useEffect } from 'react';

type RowData = {
  column1: string;
  column2: string;
  column3: number[];
  column4: number;
  details?: RowData[];
};

type Column = {
  name: string;
  sub_columns?: string[];
  rowspan: number;
  colspan: number;
};

type TableProps = {
  columns: Column[];
  data: RowData[];
};

const ExpandableUtilizationTable: React.FC<TableProps> = ({ columns, data }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [shownCountries, setShownCountries] = useState<string[]>([]);

  const allCountries = Array.from(
    new Set(data.flatMap(team => team.details?.map(child => child.column2) || []))
  );

  useEffect(() => {
    setShownCountries(allCountries);
  }, [data]);

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCountry = (country: string) => {
    setShownCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const clearFilters = () => {
    setShownCountries(allCountries);
  };

  const visibleChildRows: RowData[] = [];

  const renderRow = (
    row: RowData,
    level: number,
    keyPrefix: string,
    isVisible: boolean
  ): React.ReactElement[] => {
    if (!isVisible) return [];

    const rowKey = `${keyPrefix}-${row.column1}-${row.column2}-${level}`;
    const isParent = level === 0;
    const isExpandable = isParent && row.details && row.details.length > 0;

    const mainRow = React.createElement(
      'tr',
      {
        key: rowKey,
        className: 'border-t border-red-300 bg-white',
        onClick: isExpandable ? () => toggleRow(rowKey) : undefined,
        style: isExpandable ? { cursor: 'pointer' } : {}
      },
      ...[
        React.createElement('td', { key: 'col1', className: 'px-4 py-2 font-medium' }, row.column1),
        React.createElement('td', { key: 'col2', className: 'px-4 py-2' }, row.column2),
        ...row.column3.map((val, i) =>
          React.createElement('td', { key: `c3-${i}`, className: 'px-4 py-2' }, val)
        ),
        React.createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4)
      ]
    );

    const children: React.ReactElement[] = [];

    if (isExpandable && expandedRows[rowKey]) {
      row.details!.forEach((child, i) => {
        const visible = shownCountries.includes(child.column2);
        if (visible) visibleChildRows.push(child);
        children.push(...renderRow(child, level + 1, `${rowKey}-child-${i}`, visible));
      });
    }

    return [mainRow, ...children];
  };

  const filteredData = data.filter(team => {
    const children = team.details || [];
    const visibleChildren = children.filter(child => shownCountries.includes(child.column2));
    return visibleChildren.length > 0;
  });

  const { totalColumn3, totalColumn4 } = (() => {
    const length = filteredData[0]?.details?.[0]?.column3.length || 0;
    const totals = Array(length).fill(0);
    let col4 = 0;

    visibleChildRows.forEach(row => {
      row.column3.forEach((val, i) => {
        totals[i] += val;
      });
      col4 += row.column4;
    });

    return { totalColumn3: totals, totalColumn4: col4 };
  })();

  return React.createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' },
    // Filters
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement('p', { className: 'font-semibold mb-2' }, 'Select Countries to Display:'),
      React.createElement(
        'div',
        { className: 'flex flex-wrap gap-4' },
        ...allCountries.map(country =>
          React.createElement(
            'label',
            { key: country, className: 'flex items-center space-x-2' },
            React.createElement('input', {
              type: 'checkbox',
              checked: shownCountries.includes(country),
              onChange: () => toggleCountry(country)
            }),
            React.createElement('span', null, country)
          )
        )
      ),
      React.createElement(
        'button',
        {
          className: 'mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700',
          onClick: clearFilters
        },
        'Clear Filters'
      )
    ),

    // Table
    React.createElement(
      'table',
      { className: 'min-w-full table-auto' },

      // THEAD
      React.createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        React.createElement(
          'tr',
          null,
          ...columns.map((col, i) =>
            React.createElement(
              'th',
              {
                key: `col-${i}`,
                className: 'px-4 py-3 text-left',
                colSpan: col.colspan,
                rowSpan: col.rowspan
              },
              col.name
            )
          )
        ),
        React.createElement(
          'tr',
          null,
          ...columns
            .filter(col => col.sub_columns)
            .flatMap(col =>
              col.sub_columns!.map((subCol, j) =>
                React.createElement(
                  'th',
                  {
                    key: `sub-${col.name}-${j}`,
                    className: 'px-4 py-3 text-left'
                  },
                  subCol
                )
              )
            )
        )
      ),

      // TBODY
      React.createElement('tbody', null,
        ...filteredData.flatMap((team, i) => renderRow(team, 0, `team-${i}`, true))
      ),

      // TFOOT
      React.createElement('tfoot', { className: 'bg-red-100 font-semibold text-red-800' },
        React.createElement('tr', null,
          React.createElement('td', { className: 'px-4 py-2' }, 'Total'),
          React.createElement('td', { className: 'px-4 py-2' }, '—'),
          ...totalColumn3.map((val, i) =>
            React.createElement('td', { key: `t-${i}`, className: 'px-4 py-2' }, val)
          ),
          React.createElement('td', { className: 'px-4 py-2' }, totalColumn4)
        )
      )
    )
  );
};

export default ExpandableUtilizationTable;
