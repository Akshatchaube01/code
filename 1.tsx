import { FC, useEffect } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/css/tabulator.min.css'; // Base Tabulator styles

const ProjectTypeTable: FC = () => {
  const data = [
    { type: 'Governance and Control', count: 2 },
    { type: 'Model Development (New)', count: 20 },
    { type: 'Model Execution', count: 15 },
    { type: 'Model Implementation', count: 1 },
    { type: 'Model Monitoring', count: 7 },
    { type: 'Tool Development and Maintenance', count: 4 },
  ];

  const columns = [
    { title: 'Project Type', field: 'type', headerSort: false },
    { title: 'Count', field: 'count', hozAlign: 'center', headerSort: false },
  ];

  const options = {
    layout: 'fitColumns',
    movableColumns: false,
    resizableRows: false,
    tooltips: true,
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .tabulator {
        border: 2px solid #dc2626; /* Tailwind Red-600 */
        border-radius: 0.5rem;
      }
      .tabulator-header {
        background-color: #dc2626; /* Red Header */
        color: white;
        font-weight: bold;
        font-size: 1rem;
      }
      .tabulator-header .tabulator-col {
        background-color: #dc2626;
        border-right: 1px solid white;
      }
      .tabulator-row {
        background-color: white;
        border-bottom: 1px solid #dc2626;
      }
      .tabulator-cell {
        color: #374151; /* Gray 700 */
        font-size: 1rem;
        padding: 1rem;
      }
      .tabulator-tableholder {
        border-top: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <ReactTabulator
        data={data}
        columns={columns}
        options={options}
        className="w-full"
      />
    </div>
  );
};

export default ProjectTypeTable;
