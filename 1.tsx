import { FC, useEffect } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/css/tabulator.min.css'; // Needed for core functionality

interface RowData {
  type: string;
  count: number;
}

const tableData: RowData[] = [
  { type: 'Governance and Control', count: 2 },
  { type: 'Model Development (New)', count: 20 },
  { type: 'Model Execution', count: 15 },
  { type: 'Model Implementation', count: 1 },
  { type: 'Model Monitoring', count: 7 },
  { type: 'Tool Development and Maintenance', count: 4 },
];

const columns = [
  { title: 'Project Type', field: 'type', headerSort: false },
  { title: 'Count', field: 'count', headerSort: false, hozAlign: 'center' },
];

const tableOptions = {
  layout: 'fitColumns',
  movableColumns: false,
  resizableRows: false,
  tooltips: true,
};

const ProjectTypeTable: FC = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .tabulator {
        border: 2px solid #ef4444; /* Tailwind Red-500 */
        border-radius: 1rem;
      }
      .tabulator-header {
        background-color: #dc2626; /* Tailwind Red-600 */
        color: white;
        font-weight: bold;
        font-size: 1rem;
        text-align: left;
      }
      .tabulator-header .tabulator-col {
        border: none;
      }
      .tabulator-row {
        background-color: #fef2f2; /* Tailwind Red-50 */
        border-bottom: 1px solid #ef4444;
      }
      .tabulator-row:hover {
        background-color: #fee2e2; /* Tailwind Red-100 */
      }
      .tabulator-cell {
        font-size: 1rem;
        color: #374151; /* Tailwind Gray-700 */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="overflow-x-auto p-2">
      <ReactTabulator
        data={tableData}
        columns={columns}
        options={tableOptions}
        className="w-full"
      />
    </div>
  );
};

export default ProjectTypeTable;
