const columns = [
  {
    title: 'Assignment ID',
    field: 'assignment_id',
    sorter: 'number',
    headerFilter: 'input',
  },
  {
    title: 'PSID',
    field: 'psid',
    sorter: 'string',
    headerFilter: 'input',
  },
  {
    title: 'Assigned FTE',
    field: 'assigned_fte',
    sorter: 'number',
    headerFilter: 'input',
    editable: function (cell) {
      const data = cell.getRow().getData();
      return !data.disable;
    },
  },
  {
    title: 'Start Date',
    field: 'start_date',
    sorter: 'string',
    headerFilter: 'input',
    editable: function (cell) {
      const data = cell.getRow().getData();
      return !data.disable;
    },
  },
  {
    title: 'End Date',
    field: 'end_date',
    sorter: 'string',
    headerFilter: 'input',
    cellFormatter: function (cell) {
      const data = cell.getRow().getData();
      const value = cell.getValue();
      return `<div style="background-color:${data.is_past ? 'red' : 'transparent'};color:${data.is_past ? 'white' : 'black'};padding:4px">${value}</div>`;
    },
  },
];
