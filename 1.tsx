import React, { useState, useEffect } from 'react';

type RowData = {
  column1: string; // Team
  column2: string; // Work Location Country
  column3: number[]; // numeric array
  column4: number;
  details1?: RowData[];
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

  // Get all unique countries from details1 of all teams
  const allCountries = Array.from(
    new Set(data.flatMap(team => team.details1?.map(child => child.column2) || []))
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

  // Recursive render function
  const renderRow = (
    row: RowData,
    level: number,
    keyPrefix: string,
    isVisible: boolean
  ): any[] => {
    if (!isVisible) return [];

    const rowKey = `${keyPrefix}-${row.column1}-${row.column2}-${level}`;
    const isParent = level === 0;
    const isExpandable = isParent && row.details1 && row.details1.length > 0;

    // indent for child rows
    const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(level);

    // Compose cells array
    const cells = [
      React.createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium',
          style: { cursor: isExpandable ? 'pointer' : 'default' },
          onClick: isExpandable ? () => toggleRow(rowKey) : undefined,
        },
        level > 0 ? indent + row.column1 : row.column1
      ),
      React.createElement(
        'td',
        { key: 'col2', className: 'px-4 py-2' },
        row.column2
      ),
      ...row.column3.map((value, idx) =>
        React.createElement('td', { key: `col3-${idx}`, className: 'px-4 py-2' }, value)
      ),
      React.createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
    ];

    // Main row
    const mainRow = React.createElement(
      'tbody',
      { key: rowKey },
      React.createElement('tr', { className: 'border-t border-red-300 bg-white' }, ...cells)
    );

    // Children rows if expanded
    const children: any[] = [];
    if (isExpandable && expandedRows[rowKey]) {
      row.details1!.forEach((child, i) => {
        const visible = shownCountries.includes(child.column2);
        children.push(...renderRow(child, level + 1, `${rowKey}-child-${i}`, visible));
      });
    }

    return [mainRow, ...children];
  };

  // Filter data so only teams with at least one visible child are shown
  const filteredData = data.filter(team => {
    const children = team.details1 || [];
    const visibleChildren = children.filter(child => shownCountries.includes(child.column2));
    return visibleChildren.length > 0;
  });

  // Compute totals for visible parent rows only
  // Sum over filteredData's column3 arrays and column4 numbers
  const totalColumn3 = columns[2]?.sub_columns
    ? columns[2].sub_columns.map(() => 0)
    : Array(data[0]?.column3.length || 0).fill(0);

  filteredData.forEach(team => {
    team.column3.forEach((val, idx) => {
      totalColumn3[idx] = (totalColumn3[idx] || 0) + val;
    });
  });

  const totalColumn4 = filteredData.reduce((sum, team) => sum + team.column4, 0);

  // Render totals row cells (aligned with columns)
  const totalCells = [
    React.createElement('td', { key: 'total-col1', className: 'px-4 py-2 font-semibold' }, ''),
    React.createElement('td', { key: 'total-col2', className: 'px-4 py-2 font-semibold' }, ''),
    ...totalColumn3.map((val, idx) =>
      React.createElement('td', { key: `total-col3-${idx}`, className: 'px-4 py-2 font-semibold' }, val)
    ),
    React.createElement('td', { key: 'total-col4', className: 'px-4 py-2 font-semibold' }, totalColumn4),
  ];

  return React.createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' },
    // Filter section
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement('p', { className: 'font-semibold mb-2' }, 'Select Countries to Display:'),
      React.createElement(
        'div',
        { className: 'flex flex-wrap gap-4' },
        allCountries.map(country =>
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
    // Table section
    React.createElement(
      'table',
      { className: 'min-w-full table-auto' },
      React.createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        React.createElement(
          'tr',
          null,
          columns.map((col, idx) =>
            React.createElement(
              'th',
              {
                key: `col-${idx}`,
                className: 'px-4 py-3 text-left',
                colSpan: col.colspan,
                rowSpan: col.rowspan,
              },
              col.name
            )
          )
        ),
        // Render sub-columns header if any
        React.createElement(
          'tr',
          null,
          columns
            .filter(col => col.sub_columns && col.sub_columns.length > 0)
            .flatMap(col =>
              col.sub_columns!.map((subcol, subidx) =>
                React.createElement(
                  'th',
                  { key: `subcol-${col.name}-${subidx}`, className: 'px-4 py-3 text-left' },
                  subcol
                )
              )
            )
        )
      ),
      // Render data rows recursively
      ...filteredData.flatMap((team, idx) => renderRow(team, 0, `row-${idx}`, true)),
      // Render totals row at the bottom inside tbody to keep styles consistent
      React.createElement(
        'tbody',
        { key: 'totals-row', className: 'bg-gray-100 font-semibold' },
        React.createElement('tr', null, ...totalCells)
      )
    )
  );
};

export default ExpandableUtilizationTable;
