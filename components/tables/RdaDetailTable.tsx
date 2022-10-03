import Link from 'next/link';
import { Fragment, useMemo } from 'react';
import { useTable, useSortBy, useExpanded } from 'react-table';
import { COLUMNS } from './RdaDetailTableColumns';
import styles from './RdaDetailTable.module.css';

export default function RdaDetailTable(props: any) {
  const buildTable = (obj) => {
    const arr = [];
    for (const entry of Object.entries(obj)) {
      const [key, value]: any = entry;
      value.occurrences.map((qualifier, index) => {
        switch (value.id) {
          case 'P124':
            arr.push({
              label: value.label,
              value: qualifier.label,
              id: qualifier.id,
              link: qualifier.link,
            });
            break;
          case 'P401':
            arr.push({
              label: value.label,
              value: qualifier.label,
              id: qualifier.id,
              link: qualifier.link,
            });
            break;
          // case 'P119': arr.push({ 'label':'Link zum Toolkit', 'value':qualifier.label, 'id':qualifier.id, 'link':qualifier.link })
          // break
          case 'P385':
            arr.push({
              label: 'Status',
              value: qualifier.label,
              id: qualifier.id,
              link: qualifier.link,
            });
            break;
          // case 'P126': arr.push({ 'label':value.label, 'value':qualifier.label, 'id':qualifier.id, 'link':qualifier.link})
          // break
          case 'P113':
            arr.push({
              label: value.label,
              value: qualifier.label,
              id: qualifier.id,
              link: qualifier.link,
            });
            break;
        }
      });
    }
    return arr;
  };
  const table = buildTable(props.data);
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => table, []);
  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: data,
    },
    useSortBy,
    useExpanded // Use the useExpanded plugin hook
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = tableInstance;
  rows.forEach(prepareRow);

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr key={index} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => (
              <th
                key={index}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => (
          <TableRow key={index} {...row} />
        ))}
      </tbody>
    </table>
  );
}

function TableCell(props) {
  return (
    <td key={props.id} {...props.getCellProps()}>
      {props.render('Cell')}
    </td>
  );
}

function TableRow(props) {
  return (
    <Fragment key={props.index}>
      <tr {...props.getRowProps()}>
        {props.cells.map((cell, index) => {
          cell.id = index;
          return <TableCell key={index} {...cell} />;
        })}
      </tr>
    </Fragment>
  );
}
