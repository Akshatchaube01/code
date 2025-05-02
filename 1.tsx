const fixed_tables_set2_data = [
  {
    column: [
      {
        name: 'Work Location Country',
        sub_columns: [],
        rowspan: 2,
        colspan: 1,
      },
      {
        name: 'Employee Count by Global Career Band',
        sub_columns: ['GCB-4', 'GCB-5', 'GCB-6'],
        rowspan: 1,
        colspan: 3,
      },
      {
        name: 'Total Employee',
        sub_columns: [],
        rowspan: 2,
        colspan: 1,
      },
    ],
    data: [
      {
        row: ['India', 9, 34, 60, 103],
        details: [
          ['Bangalore', 3, 10, 25, 38],
          ['Mumbai', 2, 8, 15, 25],
          ['Delhi', 4, 16, 20, 40],
        ],
      },
    ],
    total: ['Total', 9, 34, 60, 103],
    other: {
      table_id: 'gcb_country',
      table_heading: '1. Total Employee by GCB & Work Location',
    },
  },
];
