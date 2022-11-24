import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Space, Table as AntdTable } from 'antd';
import { TableProps as AntdTableProps } from 'antd/lib/table';
import {
  ColumnGroupType as AntdColumnGroupType,
  ColumnType as AntdColumnType,
  FilterConfirmProps,
} from 'antd/lib/table/interface';
import { DataIndex, RenderedCell } from 'rc-table/lib/interface';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

interface TableProps<T> extends Omit<AntdTableProps<T>, 'columns'> {
  columns?: ColumnsType<T>;
}

interface ColumnType<T> extends Omit<AntdColumnType<T>, 'render'> {
  isSearchable?: boolean;
  render?: (
    value: any,
    record: T,
    index: number,
    children: JSX.Element
  ) => React.ReactNode | RenderedCell<T>;
}

interface ColumnGroupType<T> extends Omit<AntdColumnGroupType<T>, 'render'> {
  isSearchable?: boolean;
  render?: (
    value: any,
    record: T,
    index: number,
    children: JSX.Element
  ) => React.ReactNode | RenderedCell<T>;
}

export declare type ColumnsType<T = unknown> = (
  | ColumnGroupType<T>
  | ColumnType<T>
)[];

export function Table<T extends object>(props: TableProps<T>) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<DataIndex>('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Suche ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Suchen
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 100 }}
          >
            Zurücksetzen
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => <SearchOutlined />,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: DataIndex) => {
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  return (
    <>
      <AntdTable
        columns={props.columns.map((column: any) => {
          let { render, isSearchable, ...columnProps } = column;
          if (isSearchable && 'dataIndex' in column) {
            columnProps = {
              ...columnProps,
              ...getColumnSearchProps(column.dataIndex),
            };
          }
          if (render && 'dataIndex' in column && 'render' in column) {
            columnProps.render = (value: any, record: T, index: number) => {
              return render(
                value,
                record,
                index,
                searchedColumn === column.dataIndex ? (
                  <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={value ? value.toString() : ''}
                  />
                ) : (
                  value
                )
              );
            };
          }
          return {
            sorter: (a, b) =>
              a[column.dataIndex] > b[column.dataIndex] ? 1 : -1,
            onFilter: (value, record) => {
              return record[column.dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase())
            },
            ...columnProps,
          };
        })}
        dataSource={props.dataSource}
      />
    </>
  );
}
