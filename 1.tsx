import React, { useState, createElement } from 'react';

type RowData = {
  column1: string; // e.g., Team or identifier
  column2: string; // Work Location Country
  column3: number[];
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
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedCountries(selectedOptions);
  };

  const uniqueCountries = Array.from(new Set(data.map((row) => row.column2)));

  const filteredData =
    selectedCountries.length === 0
      ? data
      : data.filter((row) => selectedCountries.includes(row.column2));

  const renderRow = (row: RowData, level = 0, keyPrefix = ''): any[] => {
    const rowKey = `${keyPrefix}-${row.column1}-${row.column2}-${level}`;
    const cells = [
      createElement(
        'td',
        {
          key: 'col1',
          className: 'px-4 py-2 font-medium',
          onClick: () => (level === 0 ? toggleRow(rowKey) : undefined),
          style: level === 0 ? { cursor: 'pointer' } : {},
        },
        row.column1
      ),
      createElement('td', { key: 'col2', className: 'px-4 py-2' }, row.column2),
      ...row.column3.map((value, index) =>
        createElement('td', { key: `col3-${index}`, className: 'px-4 py-2' }, value)
      ),
      createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
    ];

    const mainRow = createElement(
      'tbody',
      { key: rowKey },
      createElement('tr', { className: 'border-t border-red-300 bg-white' }, ...cells)
    );

    const children: any[] = [];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child-${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    return [mainRow, ...children];
  };

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-2">
      {/* Country Filter */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Work Location Country:</label>
        <select
          multiple
          value={selectedCountries}
          onChange={handleCountryChange}
          className="border border-gray-300 rounded p-1"
        >
          {uniqueCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            {columns.map((col, i) => (
              <th
                key={`col-${i}`}
                className="px-4 py-3 text-left"
                colSpan={col.colspan}
                rowSpan={col.rowspan}
              >
                {col.name}
              </th>
            ))}
          </tr>
          <tr>
            {columns
              .filter((col) => col.sub_columns && col.sub_columns.length > 0)
              .flatMap((col) =>
                col.sub_columns!.map((subCol, j) => (
                  <th
                    key={`subcol-${col.name}-${j}`}
                    className="px-4 py-3 text-left"
                  >
                    {subCol}
                  </th>
                ))
              )}
          </tr>
        </thead>
        {filteredData.flatMap((row, idx) => renderRow(row, 0, `row-${idx}`))}
      </table>
    </div>
  );
};

export default ExpandableUtilizationTable;
