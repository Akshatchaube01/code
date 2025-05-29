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

  const renderRow = (
    row: RowData,
    level: number,
    keyPrefix: string,
    isVisible: boolean
  ): JSX.Element[] => {
    if (!isVisible) return [];

    const rowKey = `${keyPrefix}-${row.column1}-${row.column2}-${level}`;
    const isParent = level === 0;
    const isExpandable = isParent && row.details && row.details.length > 0;

    const cells = [
      <td key="col1" className="px-4 py-2 font-medium">{row.column1}</td>,
      <td key="col2" className="px-4 py-2">{row.column2}</td>,
      ...row.column3.map((value, idx) => (
        <td key={`col3-${idx}`} className="px-4 py-2">{value}</td>
      )),
      <td key="col4" className="px-4 py-2">{row.column4}</td>,
    ];

    const mainRow = (
      <tr
        key={rowKey}
        className="border-t border-red-300 bg-white"
        onClick={isExpandable ? () => toggleRow(rowKey) : undefined}
        style={isExpandable ? { cursor: 'pointer' } : {}}
      >
        {cells}
      </tr>
    );

    const children: JSX.Element[] = [];

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

  const allVisibleRows: RowData[] = [];

  filteredData.forEach((team) => {
    (team.details || []).forEach((child) => {
      if (shownCountries.includes(child.column2)) {
        allVisibleRows.push(child);
      }
    });
  });

  const totalColumn3 = allVisibleRows.reduce((acc, row) => {
    return acc.map((sum, idx) => sum + (row.column3[idx] || 0));
  }, new Array(data[0]?.column3.length || 0).fill(0));

  const totalColumn4 = allVisibleRows.reduce((sum, row) => sum + row.column4, 0);

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm p-4">
      <div className="mb-4">
        <p className="font-semibold mb-2">Select Countries to Display:</p>
        <div className="flex flex-wrap gap-4">
          {allCountries.map((country) => (
            <label key={country} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={country}
                checked={shownCountries.includes(country)}
                onChange={() => toggleCountry(country)}
              />
              <span>{country}</span>
            </label>
          ))}
        </div>
        <button
          className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

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
                  <th key={`subcol-${col.name}-${j}`} className="px-4 py-3 text-left">
                    {subCol}
                  </th>
                ))
              )}
          </tr>
        </thead>
        <tbody>
          {filteredData.flatMap((team, idx) => renderRow(team, 0, `team-${idx}`, true))}
          <tr className="font-bold bg-red-100 border-t border-red-400">
            <td className="px-4 py-2">Total</td>
            <td className="px-4 py-2">-</td>
            {totalColumn3.map((value, idx) => (
              <td key={`total-col3-${idx}`} className="px-4 py-2">
                {value}
              </td>
            ))}
            <td className="px-4 py-2">{totalColumn4}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExpandableUtilizationTable;
