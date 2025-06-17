import React, { useState, useEffect } from 'react';

type RowData = {
  columni: string;
  column2: string;
  column3: number[];
  column4: number;
  details1?: RowData[];
  name: string;
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
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const clearFilters = () => {
    setShownCountries(allCountries);
  };

  const renderRow = (
    row: RowData,
    level: number,
    keyPrefix: string,
    isVisible: boolean
  ): any[] => {
    if (!isVisible) return [];

    const rowKey = `${keyPrefix}-${row.columni}-${row.column2}-${level}`;
    const isParent = level === 0;
    const isExpandable = isParent && row.details1 && row.details1.length > 0;

    let displayColumn3 = [...row.column3];
    let displayColumn4 = row.column4;

    if (isExpandable && expandedRows[rowKey]) {
      const visibleChildren = (row.details1 || []).filter(child =>
        shownCountries.includes(child.column2)
      );

      if (visibleChildren.length > 0) {
        displayColumn3 = Array(row.column3.length).fill(0);
        displayColumn4 = 0;
        visibleChildren.forEach(child => {
          child.column3.forEach((val, idx) => {
            displayColumn3[idx] += val;
          });
          displayColumn4 += child.column4;
        });
      }
    }

    const indent = '\u00A0\u00A0'.repeat(level);

    const cells = [
      React.createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium',
          style: { cursor: isExpandable ? 'pointer' : 'default' },
          onClick: isExpandable ? () => toggleRow(rowKey) : undefined
        },
        level > 0 ? indent + row.columni : row.columni
      ),
      React.createElement(
        'td',
        { key: 'col2', className: 'px-4 py-2' },
        row.column2
      ),
      ...displayColumn3.map((value, idx) =>
        React.createElement(
          'td',
          { key: `col3-${idx}`, className: 'px-4 py-2' },
          value
        )
      ),
      React.createElement(
        'td',
        { key: 'col4', className: 'px-4 py-2' },
        displayColumn4
      )
    ];

    const mainRow = React.createElement(
      'tbody',
      { key: rowKey },
      React.createElement(
        'tr',
        {
          className: 'border-t border-red-300 bg-white'
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

  const filteredData = data.filter(team => {
    const children = team.details1 || [];
    const visibleChildren = children.filter(child =>
      shownCountries.includes(child.column2)
    );
    return visibleChildren.length > 0;
  });

  const totalColumn3 = columns[2]?.sub_columns
    ? columns[2].sub_columns.map(() => 0)
    : Array(data[0]?.column3.length || 8).fill(0);

  filteredData.forEach(team => {
    team.details1?.forEach(child => {
      if (shownCountries.includes(child.column2)) {
        child.column3.forEach((val, idx) => {
          totalColumn3[idx] += val;
        });
      }
    });
  });

  const totalColumn4 = filteredData.reduce((sum, team) => {
    const visibleChildren = team.details1?.filter(child =>
      shownCountries.includes(child.column2)
    ) || [];
    return (
      sum +
      visibleChildren.reduce((acc, child) => acc + child.column4, 0)
    );
  }, 0);

  const totalCells = [
    React.createElement(
      'td',
      { key: 'total-col1', className: 'px-4 py-2 font-semibold' },
      'Total'
    ),
    React.createElement(
      'td',
      { key: 'total-col2', className: 'px-4 py-2 font-semibold' },
      ''
    ),
    ...totalColumn3.map((val, idx) =>
      React.createElement(
        'td',
        { key: `total-col3-${idx}`, className: 'px-4 py-2 font-semibold' },
        val
      )
    ),
    React.createElement(
      'td',
      { key: 'total-col4', className: 'px-4 py-2 font-semibold' },
      totalColumn4
    )
  ];

  return React.createElement(
    'div',
    { className: 'overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4' },

    // Filter section
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement(
        'p',
        { className: 'font-semibold mb-2 text-left' },
        'Select Countries to Display:'
      ),
      React.createElement(
        'div',
        { className: 'flex flex-wrap gap-4' },
        ...allCountries.map(country =>
          React.createElement(
            'label',
            { key: country, className: 'flex items-center space-x-2' },
            React.createElement('input', {
              type: 'checkbox',
              value: country,
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
          onClick: clearFilters,
          className:
            'mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
        },
        'Clear Filters'
      )
    ),

    // Table section
    React.createElement(
      'table',
      { className: 'min-w-full table-auto' },

      // Table Header
      React.createElement(
        'thead',
        { className: 'bg-red-600 text-white' },
        React.createElement(
          'tr',
          null,
          ...columns.map((col, idx) =>
            React.createElement(
              'th',
              {
                key: `col-${idx}`,
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
            .filter(col => col.sub_columns && col.sub_columns.length > 0)
            .flatMap(col =>
              col.sub_columns!.map((subcol, subidx) =>
                React.createElement(
                  'th',
                  {
                    key: `subcol-${col.name}-${subidx}`,
                    className: 'px-4 py-3 text-left'
                  },
                  subcol
                )
              )
            )
        )
      ),

      // Table Body
      ...filteredData.flatMap((team, idx) =>
        renderRow(team, 0, `row-${idx}`, true)
      ),

      // Totals row
      React.createElement(
        'tbody',
        { key: 'totals-row', className: 'font-semibold' },
        React.createElement('tr', null, ...totalCells)
      )
    )
  );
};

export default ExpandableUtilizationTable;
