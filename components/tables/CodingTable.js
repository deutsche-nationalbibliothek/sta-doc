import { Fragment, useMemo } from "react";
import { useTable, useSortBy, useExpanded } from "react-table";
import { COLUMNS } from "./FieldCodingColumns";
import styles from "./CodingTable.module.css";

function TableCell(props) {
  // console.log("props", props);
  if (props.id === 0) {
    return (
      <>
        <td key={props.id} {...props.getCellProps()}>
          <a href={`#${props.value}`}>{props.render("Cell")}</a>
        </td>
      </>
    );
  } else {
    return (
      <td key={props.id} {...props.getCellProps()}>
        {props.render("Cell")}
      </td>
    );
  }
}

function TableRow(props) {
  // console.log('props',props)
  if (props.index === 0) {
    return (
      <Fragment key={props.index}>
        <tr className={styles.firstrow} {...props.getRowProps()}>
          {props.cells.map((cell, index) => {
            return props.index === 0 ? (
              <td
                key={index}
                className={styles.firstrow}
                {...cell.getCellProps()}
              >
                {cell.render("Cell")}
              </td>
            ) : (
              <td key={index} {...cell.getCellProps()}>
                {cell.render("Cell")}
              </td>
            );
          })}
        </tr>
        <tr className={styles.secondrow}>
          <td className={styles.secondrow} colSpan={props.allCells.length}>
            Unterfelder
          </td>
        </tr>
      </Fragment>
    );
  } else {
    return (
      <Fragment key={props.index}>
        <tr {...props.getRowProps()}>
          {props.cells.map((cell, index) => {
            cell.id = index;
            // console.log('cell',cell)
            return <TableCell key={index} {...cell} />;
          })}
        </tr>
      </Fragment>
    );
  }
}

export default function CodingTable(props) {
  const field = props.data;
  const lines = [];
  const row0 = {
    label: field?.label ?? "",
    format: {},
    repetition: field.statements.repetition?.occurrences[0].value,
  };
  if (field.statements.encoding) {
    for (const [key, value] of Object.entries(
      field.statements.encoding.format
    )) {
      row0["format"][key] = value;
    }
    lines.push(row0);
    field.statements.subfields?.occurrences.map((subfield, index) => {
      let row = {
        label: subfield.label ?? "",
        format: {},
        repetition: subfield.qualifiers?.repetition?.occurrences[0].value,
      };
      for (const [key, value] of Object.entries(subfield.coding.format)) {
        row["format"][key] = value;
      }
      // subfield.coding.occurrences.map((coding,index) => {
      // let key = coding.qualifiers.type.occurrences[0].label
      // row['format'][key] = coding.value
      // })
      lines.push(row);
    });
  }
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => lines, []);

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
