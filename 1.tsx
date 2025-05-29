import React, { useState, useEffect } from 'react';

type RowData = {
  column1: string; // Team
  column2: string; // Work Location Country
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
    new Set(data.flatMap((team) => team.details?.map((child) => child.column2) || []))
  );

  useEffect(() => {
    setShownCountries(allCountries);
  }, [data]);

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCountry = (country: string) => {
    setShownCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const clearFilters = () => {
    setShownCountries(allCountries);
  };

  // Filter data to only teams with visible children countries
  const filteredData = data.filter((team) => {
    const children = team.details || [];
    const visibleChildren = children.filter((child) => shownCountries.includes(child.column2));
    return visibleChildren.length > 0;
  });

  // Recursive function to render rows (no JSX)
  const renderRow = (
    row: RowData,
    level: number,
    keyPrefix: string,
    isVisible: boolean
  ): React.ReactNode[] => {
    if (!isVisible) return [];

    const rowKey = `${keyPrefix}-${row.column1}-${row.column2}-${level}`;
    const isParent = level === 0;
    const isExpandable = isParent && row.details && row.details.length > 0;

    const cells: React.ReactNode[] = [
      React.createElement('td', { key: 'col1', className: 'px-4 py-2 font-medium' }, row.column1),
      React.createElement('td', { key: 'col2', className: 'px-4 py-2' }, row.column2),
      ...row.column3.map((value, idx) =>
        React.createElement('td', { key: `col3-${idx}`, className: 'px-4 py-2' }, value)
      ),
      React.createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
    ];

    const mainRow = React.createElement(
      'tbody',
      { key: rowKey },
      React.createElement(
        'tr',
        {
          className: 'border-t border-red-300 bg-white',
          onClick: isExpandable ? () => toggleRow(rowKey) : undefined,
          style: isExpandable ? { cursor: 'pointer' } : {},
        },
        cells
      )
    );

    const childrenRows: React.ReactNode[] = [];

    if (isExpandable && expandedRows[rowKey]) {
      row.details!.forEach((child, i) => {
        const visible = shownCountries.includes(child.column2);
        childrenRows.push(...renderRow(child, level + 1, `${rowKey}-child-${i}`, visible));
      });
    }

    return [mainRow, ...childrenRows];
  };

  // Calculate totals only for visible rows (including expanded children)
  const calculateTotals = () => {
    const totalsColumn3 = new Array(data[0]?.column3.length || 0).fill(0);
    let totalColumn4 = 0;

    const accumulate = (rows: RowData[], level: number, prefix: string) => {
      rows.forEach((row, i) => {
        const rowKey = `${prefix}-${row.column1}-${row.column2}-${level}`;
        if (!shownCountries.includes(row.column2)) return;

        row.column3.forEach((val, idx) => {
          totalsColumn3[idx] += val;
        });
        totalColumn4 += row.column4;

        if (row.details && expandedRows[rowKey]) {
          accumulate(row.details, level + 1, rowKey);
        }
      });
    };

    accumulate(filteredData, 0, 'team');

    return { totalsColumn3, totalColumn4 };
  };

  const { totalsColumn3, totalColumn4 } = calculateTotals();

  return React.createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' },
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement('p', { className: 'font-semibold mb-2' }, 'Select Countries to Display:'),
      React.createElement(
        'div',
        { className: 'flex flex-wrap gap-4' },
        allCountries.map((country) =>
          React.createElement(
            'label',
            { key: country, className: 'flex items-center space-x-2' },
            React.createElement('input', {
              type: 'checkbox',
              value: country,
              checked: shownCountries.includes(country),
              onChange: () => toggleCountry(country),
            }),
            React.createElement('span', null, country)
          )
        )
      ),
      React.createElement(
        'button',
        {
          onClick: clearFilters,
          className: 'mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700',
        },
        'Clear Filters'
      )
    ),
    React.createElement(
      'table',
      { className: 'min-w-full table-auto' },
      React.createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        React.createElement(
          'tr',
          null,
          columns.map((col, i) =>
            React.createElement(
              'th',
              {
                key: `col-${i}`,
                className: 'px-4 py-3 text-left',
                colSpan: col.colspan,
                rowSpan: col.rowspan,
              },
              col.name
            )
          )
        ),
        React.createElement(
          'tr',
          null,
          columns
            .filter((col) => col.sub_columns && col.sub_columns.length > 0)
            .flatMap((col) =>
              col.sub_columns!.map((subCol, j) =>
                React.createElement(
                  'th',
                  { key: `subcol-${col.name}-${j}`, className: 'px-4 py-3 text-left' },
                  subCol
                )
              )
            )
        )
      ),
      // Render all filtered rows (including children)
      ...filteredData.flatMap((team, idx) => renderRow(team, 0, `team-${idx}`, true)),

      // Append the Total row at the end
      React.createElement(
        'tbody',
        { key: 'total-row' },
        React.createElement(
          'tr',
          { className: 'font-bold bg-gray-200' },
          React.createElement('td', { colSpan: 2, className: 'px-4 py-2' }, 'Total'),
          ...totalsColumn3.map((val, idx) =>
            React.createElement('td', { key: `total-col3-${idx}`, className: 'px-4 py-2' }, val)
          ),
          React.createElement('td', { className: 'px-4 py-2' }, totalColumn4)
        )
      )
    )
  );
};

export default ExpandableUtilizationTable;
