import { FC } from 'react';

type GCBRow = {
  country: string;
  gcb3: number;
  gcb4: number;
  gcb5: number;
  gcb6: number;
  gcbNA: number;
  total: number;
};

type EmployeeGCBTableProps = {
  data: GCBRow[];
};

const EmployeeGCBTable: FC<EmployeeGCBTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border-2 border-red-600">
      <table className="min-w-full table-auto">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-md font-bold border-r border-white">
              Work Location Country
            </th>
            <th className="px-6 py-4 text-center text-md font-bold border-r border-white" colSpan={5}>
              Employee Count by Global Career Band
            </th>
            <th className="px-6 py-4 text-center text-md font-bold">
              Total
            </th>
          </tr>
          <tr className="bg-red-600 text-white">
            <th className="px-6 py-2 border-r border-white"></th>
            <th className="px-6 py-2 text-center border-r border-white">GCB-3</th>
            <th className="px-6 py-2 text-center border-r border-white">GCB-4</th>
            <th className="px-6 py-2 text-center border-r border-white">GCB-5</th>
            <th className="px-6 py-2 text-center border-r border-white">GCB-6</th>
            <th className="px-6 py-2 text-center border-r border-white">GCB-Not Applicable</th>
            <th className="px-6 py-2 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="bg-white border-b border-red-500">
              <td className="px-6 py-4 text-gray-700">{row.country}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.gcb3}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.gcb4}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.gcb5}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.gcb6}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.gcbNA}</td>
              <td className="px-6 py-4 text-center text-gray-700">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeGCBTable;
