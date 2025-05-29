import React, { useState } from 'react';

type RowData = {
  columni: string;
  column2: string;
  column3: string;
  column4: string | number;
  column5: string | number;
  column6: string | number;
  column7: string | number;
  column?: string;
  details1?: RowData[];
  details2?: RowData[];
};

type TableProps = {
  columns: { name: string }[];
  data: RowData[];
};

const ExpandableUtilizationTable: React.FC<TableProps> = ({ columns, data }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number, keyPrefix: string): JSX.Element[] => {
    const rowKey = `${keyPrefix}-${row.columni || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
    const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(level);

    const mainRow = (
      <tr key={rowKey} className="border-t border-red-300 bg-white">
        <td
          className="px-4 py-2 font-medium"
          onClick={level === 0 ? () => toggleRow(rowKey) : undefined}
          style={level === 0 ? { cursor: 'pointer' } : {}}
        >
          {level === 0 ? row.columni : indent + (row.columni || '-')}
        </td>
        <td className="px-4 py-2">{row.column2}</td>
        <td className="px-4 py-2">{row.column3}</td>
        <td className="px-4 py-2">{row.column4}</td>
        <td className="px-4 py-2">{row.column5}</td>
        <td className="px-4 py-2">{row.column6}</td>
        <td className="px-4 py-2">{row.column7}</td>
        <td className="px-4 py-2">{row.column}</td>
      </tr>
    );

    const children: JSX.Element[] = [];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[`${rowKey}-expand2`] && row.details2) {
      row.details2.forEach((child, j) => {
        const childKey = `${rowKey}-subchild${j}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    return [mainRow, ...children];
  };

  // Calculate totals from top-level rows
  const totals = data.reduce(
    (acc, row) => {
      acc.column4 += Number(row.column4) || 0;
      acc.column5 += Number(row.column5) || 0;
      acc.column6 += Number(row.column6) || 0;
      acc.column7 += Number(row.column7) || 0;
      return acc;
    },
    { column4: 0, column5: 0, column6: 0, column7: 0 }
  );

  const totalRow = (
    <tr key="total-row" className="border-t-2 border-red-600 bg-red-100 font-bold">
      <td className="px-4 py-2">Total</td>
      <td className="px-4 py-2"></td>
      <td className="px-4 py-2"></td>
      <td className="px-4 py-2">{totals.column4}</td>
      <td className="px-4 py-2">{totals.column5}</td>
      <td className="px-4 py-2">{totals.column6}</td>
      <td className="px-4 py-2">{totals.column7}</td>
      <td className="px-4 py-2"></td>
    </tr>
  );

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm">
      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            {columns.map((col, i) => (
              <th key={`col-${i}`} className="px-4 py-3 text-left">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.flatMap((row, idx) => renderRow(row, 0, `row-${idx}`))}
          {totalRow}
        </tbody>
      </table>
    </div>
  );
};

export default ExpandableUtilizationTable;
