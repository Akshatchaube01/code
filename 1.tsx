import React, { useState, useEffect } from 'react';

type RowData = {
  column1: string; // Team
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

    const cells = [
      <td key="col1" className="px-4 py-2 font-medium">
        {row.column1}
      </td>,
      <td key="col2" className="px-4 py-2">
        {row.column2}
      </td>,
      ...row.column3.map((value, idx) => (
        <td key={`col3-${idx}`} className="px-4 py-2">
          {value}
        </td>
      )),
      <td key="col4" className="px-4 py-2">
        {row.column4}
      </td>,
    ];

    const mainRow = (
      <tbody key={rowKey}>
        <tr
          className="border-t border-red-300 bg-white"
          onClick={isExpandable ? () => toggleRow(rowKey) : undefined}
          style={isExpandable ? { cursor: 'pointer' } : {}}
        >
          {cells}
        </tr>
      </tbody>
    );

    const children: any[] = [];

    if (isExpandable && expandedRows[rowKey]) {
      const visibleChildren = row.details1!.filter((child) =>
        shownCountries.includes(child.column2)
      );

      if (visibleChildren.length > 0) {
        children.push(
          <tr key={`${rowKey}-subheader`} className="bg-gray-100 font-semibold">
            <td className="px-4 py-2">Team</td>
            <td className="px-4 py-2">Work Location Country</td>
            {row.column3.map((_, i) => (
              <td key={`sh-col3-${i}`} className="px-4 py-2">
                Metric {i + 1}
              </td>
            ))}
            <td className="px-4 py-2">Total</td>
          </tr>
        );

        visibleChildren.forEach((child, i) => {
          children.push(...renderRow(child, level + 1, `${rowKey}-child-${i}`, true));
        });
      }
    }

    return [mainRow, ...children];
  };

  const filteredData = data.filter((team) => {
    const children = team.details1 || [];
    const visibleChildren = children.filter((child) =>
      shownCountries.includes(child.column2)
    );
    return visibleChildren.length > 0;
  });

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
          onClick={clearFilters}
          className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Filters
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            {columns.map((col, i) =>
              col.name === 'Work Location Country' ? null : (
                <th
                  key={`col-${i}`}
                  className="px-4 py-3 text-left"
                  colSpan={col.colspan}
                  rowSpan={col.rowspan}
                >
                  {col.name}
                </th>
              )
            )}
          </tr>
        </thead>
        {filteredData.flatMap((team, idx) =>
          renderRow(team, 0, `team-${idx}`, true)
        )}
      </table>
    </div>
  );
};

export default ExpandableUtilizationTable;