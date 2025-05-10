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
    editable: (cell) => !cell.getRow().getData().disable,
  },
  {
    title: 'Start Date',
    field: 'start_date',
    sorter: 'string',
    headerFilter: 'input',
    editable: (cell) => !cell.getRow().getData().disable,
  },
  {
    title: 'End Date',
    field: 'end_date',
    sorter: 'string',
    headerFilter: 'input',
    cellStyled: (cell) => {
      const data = cell.getRow().getData();
      return data.is_past ? { backgroundColor: 'red', color: 'white' } : {};
    },
  },
];
