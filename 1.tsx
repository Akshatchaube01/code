import React, { useState, useEffect, createElement } from 'react';

type RowData = {
  column1: string; // Team (label)
  column2: string; // Work Location Country
  column3: number[]; // array of numbers
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

  const allCountries = Array.from(
    new Set(data.flatMap((team) => team.details1?.map((child) => child.column2) || []))
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

  // Recursive render function for rows
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

    const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(level);

    const cells = [
      createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium',
          onClick: isExpandable ? () => toggleRow(rowKey) : undefined,
          style: isExpandable ? { cursor: 'pointer' } : undefined,
        },
        row.column1
      ),
      createElement(
        'td',
        { key: 'col2', className: 'px-4 py-2' },
        level > 0 ? indent + row.column2 : row.column2
      ),
      ...row.column3.map((value, idx) =>
        createElement('td', { key: `col3-${idx}`, className: 'px-4 py-2' }, value)
      ),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
    ];

    const mainRow = createElement(
      'tbody',
      { key: rowKey },
      createElement(
        'tr',
        {
          className: 'border-t border-red-300 bg-white',
          onClick: isExpandable ? () => toggleRow(rowKey) : undefined,
          style: isExpandable ? { cursor: 'pointer' } : undefined,
        },
        ...cells
      )
    );

    const children: any[] = [];

    if (isExpandable && expandedRows[rowKey]) {
      row.details1!.forEach((child, i) => {
        const visible = shownCountries.includes(child.column2);
        children.push(...renderRow(child, level + 1, `${rowKey}-child-${i}`, visible));
      });
    }

    return [mainRow, ...children];
  };

  // Filter teams whose children have at least one visible country
  const filteredData = data.filter((team) => {
    const children = team.details1 || [];
    const visibleChildren = children.filter((child) => shownCountries.includes(child.column2));
    return visibleChildren.length > 0;
  });

  // Calculate totals for filtered parent rows
  const totals = {
    column3: [] as number[],
    column4: 0,
  };

  filteredData.forEach((row) => {
    // Sum column3 values: note these are arrays, sum index-wise
    row.column3.forEach((val, idx) => {
      totals.column3[idx] = (totals.column3[idx] || 0) + val;
    });
    totals.column4 += row.column4;
  });

  // Render totals row cells
  const totalCells = [
    createElement(
      'td',
      { key: 'total-col1', className: 'px-4 py-2 font-semibold bg-gray-100' },
      'Total'
    ),
    createElement('td', { key: 'total-col2', className: 'px-4 py-2 bg-gray-100' }, ''), // empty cell for column2
    ...totals.column3.map((val, idx) =>
      createElement(
        'td',
        { key: `total-col3-${idx}`, className: 'px-4 py-2 font-semibold bg-gray-100' },
        val
      )
    ),
    createElement(
      'td',
      { key: 'total-col4', className: 'px-4 py-2 font-semibold bg-gray-100' },
      totals.column4
    ),
  ];

  // Render totals tbody with one tr
  const totalsRow = createElement(
    'tbody',
    { key: 'totals' },
    createElement('tr', { className: 'border-t border-red-500 bg-gray-100' }, ...totalCells)
  );

  return createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' },
    // Filters UI
    createElement(
      'div',
      { className: 'mb-4' },
      createElement('p', { className: 'font-semibold mb-2' }, 'Select Countries to Display:'),
      createElement(
        'div',
        { className: 'flex flex-wrap gap-4' },
        allCountries.map((country) =>
          createElement(
            'label',
            { key: country, className: 'flex items-center space-x-2' },
            createElement('input', {
              type: 'checkbox',
              value: country,
              checked: shownCountries.includes(country),
              onChange: () => toggleCountry(country),
            }),
            createElement('span', null, country)
          )
        )
      ),
      createElement(
        'button',
        {
          onClick: clearFilters,
          className: 'mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700',
          type: 'button',
        },
        'Clear Filters'
      )
    ),
    // Table element
    createElement(
      'table',
      { className: 'min-w-full table-auto' },
      createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        createElement(
          'tr',
          null,
          columns.map((col, i) =>
            createElement(
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
        createElement(
          'tr',
          null,
          columns
            .filter((col) => col.sub_columns && col.sub_columns.length > 0)
            .flatMap((col) =>
              col.sub_columns!.map((subcol, j) =>
                createElement(
                  'th',
                  { key: `subcol-${col.name}-${j}`, className: 'px-4 py-3 text-left' },
                  subcol
                )
              )
            )
        )
      ),
      // Render rows
      ...filteredData.flatMap((team, idx) => renderRow(team, 0, `team-${idx}`, true)),
      // Render totals row after all data rows
      totalsRow
    )
  );
};

export default ExpandableUtilizationTable;
