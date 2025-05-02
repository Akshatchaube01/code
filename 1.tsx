import React, { useState } from 'react';

type RowData = {
  column1: string;
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
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderRow = (row: RowData, level: number = 0, parentIndex: string = '') => {
    const indexKey = `${parentIndex}-${row.column1}-${row.column2}-${row.column3}`;
    return (
      <>
        <tr className="border-t border-red-300 bg-white" key={indexKey}>
          {[...Array(level)].map((_, i) => (
            <td key={i} className="px-4 py-2" />
          ))}
          <td className="px-4 py-2 font-medium cursor-pointer" colSpan={1} onClick={() => toggleRow(indexKey)}>
            {row.column1 || row.column2 || row.column3}
          </td>
          <td className="px-4 py-2">{row.column2}</td>
          <td className="px-4 py-2">{row.column3}</td>
          <td className="px-4 py-2">{row.column4}</td>
          <td className="px-4 py-2">{row.column5}</td>
          <td className="px-4 py-2">{row.column6}</td>
          <td className="px-4 py-2">{row.column7}</td>
          <td className="px-4 py-2">{row.column}</td>
        </tr>
        {expandedRows[indexKey] && row.details1?.map((childRow, i) => (
          <React.Fragment key={`${indexKey}-child-${i}`}>
            {renderRow(childRow, level + 1, indexKey)}
            {expandedRows[`${indexKey}-child-${i}`] && childRow.details2?.map((subChild, j) => (
              renderRow(subChild, level + 2, `${indexKey}-child-${i}`)
            ))}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-red-600 shadow-sm">
      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left">{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => renderRow(row, 0, `${idx}`))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpandableUtilizationTable;



<ExpandableUtilizationTable columns={expandable_tables_data2[0].columns1} data={expandable_tables_data2[0].data1} />
