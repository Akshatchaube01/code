import React, { useState } from 'react';

type RowData = {
  columni: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
  column7: string;
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
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (row: RowData, level: number, keyPrefix: string): JSX.Element[] => {
    const rowKey = `${keyPrefix}-${row.columni || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
    const indent = '    '.repeat(level); // Use Unicode spaces for indentation

    const cells = [
      <td
        key="col1"
        className="px-4 py-2 font-medium"
        onClick={level === 0 ? () => toggleRow(rowKey) : undefined}
        style={level === 0 ? { cursor: 'pointer' } : {}}
      >
        {row.columni}
      </td>,
      <td
        key="col2"
        className="px-4 py-2"
        onClick={level === 1 && row.details2 ? () => toggleRow(`${rowKey}-expand2`) : undefined}
        style={level === 1 && row.details2 ? { cursor: 'pointer', fontWeight: 500 } : {}}
      >
        {level > 0 ? indent + (row.column2 || '-') : row.column2}
      </td>,
      <td key="col3" className="px-4 py-2">{row.column3}</td>,
      <td key="col4" className="px-4 py-2">{row.column4}</td>,
      <td key="col5" className="px-4 py-2">{row.column5}</td>,
      <td key="col6" className="px-4 py-2">{row.column6}</td>,
      <td key="col7" className="px-4 py-2">{row.column7}</td>,
      <td key="col8" className="px-4 py-2">{row.column}</td>,
    ];

    const mainRow = (
      <tr key={rowKey} className="border-t border-red-300 bg-white">
        {cells}
      </tr>
    );

    const children: JSX.Element[] = [mainRow];

    if (expandedRows[rowKey] && row.details1) {
      row.details1.forEach((child, i) => {
        const childKey = `${rowKey}-child${i}`;
        children.push(...renderRow(child, level + 1, childKey));
      });
    }

    if (expandedRows[`${rowKey}-expand2`] && row.details2) {
      row.details2.forEach((child, j) => {
        const childKey = `${rowKey}-subchild${j}`;
        children.push(...renderRow(child, level + 2, childKey));
      });
    }

    return children;
  };

  const flattenRows = (rows: RowData[]): RowData[] =>
    rows.flatMap(row => [
      row,
      ...(row.details1 ? flattenRows(row.details1) : []),
      ...(row.details2 ? flattenRows(row.details2) : []),
    ]);

  const getColumnSum = (key: keyof RowData): number => {
    return flattenRows(data)
      .map(row => parseFloat((row[key] || '0') as string))
      .filter(n => !isNaN(n))
      .reduce((acc, val) => acc + val, 0);
  };

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
          <tr className="bg-red-100 font-bold">
            <td className="px-4 py-2">Total</td>
            <td className="px-4 py-2" />
            <td className="px-4 py-2" />
            <td className="px-4 py-2" />
            <td className="px-4 py-2">{getColumnSum('column5').toFixed(2)}</td>
            <td className="px-4 py-2">{getColumnSum('column6').toFixed(2)}</td>
            <td className="px-4 py-2">{getColumnSum('column7').toFixed(2)}</td>
            <td className="px-4 py-2">{getColumnSum('column').toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExpandableUtilizationTable;
