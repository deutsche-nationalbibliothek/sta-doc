import { useMemo } from "react";
import { useTable, useSortBy, useExpanded } from "react-table";
import { COLUMNS } from "./FieldColumns";
import styles from "./FieldTable.module.css";
import SubfieldTable from "../tables/SubfieldTable";
import Collapsible from "react-collapsible";
import stylesCollapsible from "./Collapsible.module.css";

export default function FieldTable(props) {
  const data = props.data;

  const columns = useMemo(() => COLUMNS, []);
  const data2 = useMemo(() => data, []);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: data2,
      initialState: {
        sortBy: [
          {
            id: "codings.PICA3",
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
    state: { expanded },
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
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
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
              mapper[key]["id"] = key;
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
                  if (cell.column["Header"] === "Feldbezeichnung") {
                    return (
                      <td key={index} {...cell.getCellProps()}>
                        {cell.render("Cell")}
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
                        {cell.render("Cell")}
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
