import { Link } from "next/link";
import { Fragment, useMemo } from "react";
import { useTable, useSortBy, useExpanded } from "react-table";
import { COLUMNS } from "./RdaTableColumns";
import styles from "./RdaTable.module.css";

export default function RdaTable(props) {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => props.data, []);

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
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
      {props.render("Cell")}
    </td>
  );
}
// <Link href={`/rda/properties/${props.value}`}>
// <a>{props.render("Cell")}</a>
// </Link>

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
