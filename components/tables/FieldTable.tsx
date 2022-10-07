import { useMemo } from 'react';
import Link from 'next/link';
import { useTable, useSortBy, useExpanded } from 'react-table';
import styles from './FieldTable.module.css';
import SubfieldTable from '../tables/SubfieldTable';
import Collapsible from 'react-collapsible';
import stylesCollapsible from './Collapsible.module.css';
import { Field } from '@/types/generated/field';

interface FieldTableProps {
  data: Field[];
}

export default function FieldTable({ data }: FieldTableProps) {
  const columns = useMemo(
    () => [
      {
        Header: 'PICA3',
        accessor: 'codings.PICA3',
        sortType: 'basic',
      },
      {
        Header: 'PICA+',
        accessor: 'codings.PICA+',
        sortType: 'basic',
      },
      {
        Header: 'MARC21',
        accessor: 'codings.MARC 21',
        sortType: 'basic',
      },
      {
        Header: 'Feldbezeichnung',
        accessor: 'label',
        // Cell: ({row}) => (<a href={`fields/${row.original.id}`}>{row.original.label}</a>),
        // Cell: ({row}) => (<a href={row.original.editLink}>{row.original.label}</a>),
        Cell: ({ row }) => (
          <Link href={`/entries/${encodeURIComponent(row.original.id)}`}>
            <a>{row.original.label}</a>
          </Link>
        ),
        sortType: 'basic',
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: data,
      initialState: {
        sortBy: [
          {
            id: 'codings.PICA3',
            desc: false,
          },
        ],
      },
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
    // state: { expanded },
  } = tableInstance;

  return (
    <>
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
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            const mapper = row.original.subfields;
            // TODO workaround here: push id of prop to the object
            Object.keys(mapper).map((key) => {
              mapper[key]['id'] = key;
            });
            const subfields = [];
            Object.keys(mapper).map((key) => {
              subfields.push(mapper[key]);
            });
            // const subfields = row['subfields']
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  if (cell.column['Header'] === 'Feldbezeichnung') {
                    return (
                      <td key={index} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                        <Collapsible
                          trigger="Zeige Unterfelder"
                          triggerWhenOpen="Schließe Unterfelder"
                          className={stylesCollapsible.Collapsible}
                          triggerClassName={stylesCollapsible.CustomTriggerCSS}
                          triggerOpenedClassName={
                            stylesCollapsible.CustomTriggerCSSopen
                          }
                        >
                          <SubfieldTable data={subfields} />
                        </Collapsible>
                      </td>
                    );
                  } else {
                    return (
                      <td key={index} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
