const columns = [
  {
    title: 'Assignment Start Date',
    field: 'start_date',
    sorter: 'string',
    headerFilter: 'input',
    editor: dateEditor, // your custom date editor
    editable: function (cell: any) {
      const rowData = cell.getData();
      const el = cell.getElement();
      if (rowData.disable) {
        el.style.color = 'grey';
        return false;
      }
      el.style.color = 'black';
      return true;
    },
  },
  {
    title: 'Assignment End Date',
    field: 'end_date',
    sorter: 'string',
    headerFilter: 'input',
    editor: dateEditor,
    editable: function (cell: any) {
      const rowData = cell.getData();
      const el = cell.getElement();
      if (rowData.is_past) {
        el.style.color = 'red';
      } else {
        el.style.color = 'black';
      }
      return true; // allow editing, just change style
    },
  },
];
