const renderRow = (row: RowData, level: number = 0, keyPrefix: string = ''): any[] => {
  const rowKey = `${keyPrefix}-${row.column1 || ''}-${row.column2 || ''}-${row.column3 || ''}-${level}`;
  const indent = '\u00A0'.repeat(level * 4);

  const cells = [
    createElement(
      'td',
      {
        key: 'col1',
        className: 'px-4 py-2 font-medium',
        onClick: level === 0 ? () => toggleRow(rowKey) : undefined,
        style: level === 0 ? { cursor: 'pointer' } : {},
      },
      level === 0 ? row.column1 : ''
    ),
    createElement(
      'td',
      {
        key: 'col2',
        className: 'px-4 py-2',
        onClick: level === 1 && row.details2 ? () => toggleRow(`${rowKey}-expand2`) : undefined,
        style: level === 1 && row.details2 ? { cursor: 'pointer', fontWeight: '500' } : {},
      },
      level > 0 ? indent + (row.column2 || '-') : row.column2
    ),
    createElement('td', { key: 'col3', className: 'px-4 py-2' }, row.column3),
    createElement('td', { key: 'col4', className: 'px-4 py-2' }, row.column4),
    createElement('td', { key: 'col5', className: 'px-4 py-2' }, row.column5),
    createElement('td', { key: 'col6', className: 'px-4 py-2' }, row.column6),
    createElement('td', { key: 'col7', className: 'px-4 py-2' }, row.column7),
    createElement('td', { key: 'col8', className: 'px-4 py-2' }, row.column),
  ];

  const mainRow = createElement(
    'tbody',
    { key: rowKey },
    createElement('tr', { className: 'border-t border-red-300 bg-white' }, ...cells)
  );

  const children: any[] = [];

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

  return [mainRow, ...children];
};
