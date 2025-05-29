import React, { useState, useEffect, createElement as h } from 'react';

// Type definitions
/** @typedef {{
 *  column1: string;
 *  column2: string;
 *  column3: number[];
 *  column4: number;
 *  details?: RowData[];
 * }} RowData
 *
 * @typedef {{
 *  name: string;
 *  sub_columns?: string[];
 *  rowspan: number;
 *  colspan: number;
 * }} Column
 *
 * @typedef {{
 *  columns: Column[];
 *  data: RowData[];
 * }} TableProps
 */

const ExpandableUtilizationTable = ({ columns, data }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [shownCountries, setShownCountries] = useState([]);

  const allCountries = Array.from(
    new Set(data.flatMap((team) => team.details?.map((child) => child.column2) || []))
  );

  useEffect(() => {
    setShownCountries(allCountries);
  }, [data]);

  const toggleRow = (key) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCountry = (country) => {
    setShownCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const clearFilters = () => {
    setShownCountries(allCountries);
  };

  const renderRow = (row, level, keyPrefix, isVisible) => {
    if (!isVisible) return [];

    const rowKey = `${keyPrefix}-${row.column1}-${row.column2}-${level}`;
    const isParent = level === 0;
    const isExpandable = isParent && row.details && row.details.length > 0;

    const cells = [
      h('td', { key: 'col1', className: 'px-4 py-2 font-medium' }, row.column1),
      h('td', { key: 'col2', className: 'px-4 py-2' }, row.column2),
      ...row.column3.map((value, idx) =>
        h('td', { key: `col3-${idx}`, className: 'px-4 py-2' }, value)
      ),
      h('td', { key: 'col4', className: 'px-4 py-2' }, row.column4)
    ];

    const mainRow = h(
      'tr',
      {
        key: rowKey,
        className: 'border-t border-red-300 bg-white',
        onClick: isExpandable ? () => toggleRow(rowKey) : undefined,
        style: isExpandable ? { cursor: 'pointer' } : {}
      },
      cells
    );

    let children = [];
    if (isExpandable && expandedRows[rowKey]) {
      row.details.forEach((child, i) => {
        const visible = shownCountries.includes(child.column2);
        children.push(...renderRow(child, level + 1, `${rowKey}-child-${i}`, visible));
      });
    }

    return [mainRow, ...children];
  };

  const filteredData = data.filter((team) => {
    const children = team.details || [];
    const visibleChildren = children.filter((child) => shownCountries.includes(child.column2));
    return visibleChildren.length > 0;
  });

  // Calculate totals of visible rows
  const visibleRows = filteredData.flatMap((team, idx) => {
    const parentKey = `team-${idx}`;
    const children = team.details || [];
    const visibleChildren = children.filter((child) => shownCountries.includes(child.column2));
    return visibleChildren;
  });

  const totalColumn3 = [];
  const columnCount = (columns.find((col) => col.sub_columns?.length)?.sub_columns.length) || 0;

  for (let i = 0; i < columnCount; i++) {
    totalColumn3.push(visibleRows.reduce((sum, row) => sum + (row.column3[i] || 0), 0));
  }

  const totalColumn4 = visibleRows.reduce((sum, row) => sum + row.column4, 0);

  const totalRow = h(
    'tr',
    { className: 'font-bold bg-gray-100 border-t border-red-600' },
    [
      h('td', { colSpan: 2, className: 'px-4 py-2' }, 'Total'),
      ...totalColumn3.map((val, idx) => h('td', { key: `sum-col3-${idx}`, className: 'px-4 py-2' }, val)),
      h('td', { className: 'px-4 py-2' }, totalColumn4)
    ]
  );

  return h('div', { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' }, [
    h('div', { className: 'mb-4' }, [
      h('p', { className: 'font-semibold mb-2' }, 'Select Countries to Display:'),
      h('div', { className: 'flex flex-wrap gap-4' },
        allCountries.map((country) =>
          h('label', { key: country, className: 'flex items-center space-x-2' }, [
            h('input', {
              type: 'checkbox',
              value: country,
              checked: shownCountries.includes(country),
              onChange: () => toggleCountry(country)
            }),
            h('span', {}, country)
          ])
        )
      ),
      h('button', {
        className: 'mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700',
        onClick: clearFilters
      }, 'Clear Filters')
    ]),
    h('table', { className: 'min-w-full table-auto' }, [
      h('thead', { className: 'bg-red-600 text-white' }, [
        h('tr', {}, columns.map((col, i) =>
          h('th', {
            key: `col-${i}`,
            className: 'px-4 py-3 text-left',
            colSpan: col.colspan,
            rowSpan: col.rowspan
          }, col.name)
        )),
        h('tr', {}, columns.flatMap((col) =>
          (col.sub_columns || []).map((subCol, j) =>
            h('th', {
              key: `subcol-${col.name}-${j}`,
              className: 'px-4 py-3 text-left'
            }, subCol)
          )
        ))
      ]),
      h('tbody', {}, [
        ...filteredData.flatMap((team, idx) => renderRow(team, 0, `team-${idx}`, true)),
        totalRow
      ])
    ])
  ]);
};

export default ExpandableUtilizationTable;