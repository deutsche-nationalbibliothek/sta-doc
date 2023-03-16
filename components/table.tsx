import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  InputRef,
  Space,
  Table as AntdTable,
  Typography,
} from 'antd';
import { TableProps as AntdTableProps } from 'antd/lib/table';
import {
  ColumnGroupType as AntdColumnGroupType,
  ColumnType as AntdColumnType,
  FilterConfirmProps,
} from 'antd/lib/table/interface';
import { get } from 'lodash';
import { RenderedCell } from 'rc-table/lib/interface';
import { useRef, useState } from 'react';
import { Highlighter } from '@/lib/highlighter';

export declare type DataIndex = string;

interface TableProps<T> extends Omit<AntdTableProps<T>, 'columns'> {
  columns?: ColumnsType<T>;
}

interface ColumnType<T> extends Omit<AntdColumnType<T>, 'render'> {
  isSearchable?: boolean;
  noSort?: boolean;
  render?: (
    value: any,
    record: T,
    index: number,
    children: JSX.Element
  ) => React.ReactNode | RenderedCell<T>;
}

interface ColumnGroupType<T>
  extends Omit<AntdColumnGroupType<T>, 'render' | 'children'> {
  children: ColumnsType<T>;
  isSearchable?: boolean;
  noSort?: boolean;
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
  const [searchTexts, setSearchTexts] = useState<Record<string, DataIndex>>({});
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchTexts((searchTexts) => ({
      ...searchTexts,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const handleReset = (clearFilters: () => void, dataIndex: DataIndex) => {
    clearFilters();
    setSearchTexts((searchTexts) => ({ ...searchTexts, [dataIndex]: '' }));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    key: string
  ): ColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Suche ${String(key)}`}
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
            onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
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
      return searchTexts[dataIndex] ? (
        <Highlighter
          searchWords={[searchTexts[dataIndex]]}
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const columnsMapper = (column: ColumnType<T> | ColumnGroupType<T>) => {
    let { render, isSearchable, noSort, ...columnProps } = column;
    if (isSearchable && 'dataIndex' in column) {
      columnProps = {
        ...columnProps,
        ...getColumnSearchProps(String(column.dataIndex), String(column.key)),
      };
    }
    const columnRender =
      'render' in column && 'dataIndex' in column
        ? (value: any, record: T, index: number) => {
            return render(
              value,
              record,
              index,
              searchTexts[String(column.dataIndex)] ? (
                <Highlighter
                  searchWords={[searchTexts[String(column.dataIndex)]]}
                  textToHighlight={value ? value.toString() : ''}
                />
              ) : (
                <>{value}</>
              )
            );
          }
        : (value: any) => {
            return (
              <Typography.Text>
                {'dataIndex' in column &&
                searchTexts[String(column.dataIndex)] ? (
                  <Highlighter
                    searchWords={[searchTexts[String(column.dataIndex)]]}
                    textToHighlight={value ? value.toString() : ''}
                  />
                ) : (
                  value
                )}
              </Typography.Text>
            );
          };

    return {
      sorter:
        !noSort && 'dataIndex' in column // !('children' in columnProps)
          ? (a: ColumnsType<T>, b: ColumnsType<T>) =>
              a[String(column.dataIndex)] > b[String(column.dataIndex)] ? 1 : -1
          : undefined,
      onFilter: (value: string, record: ColumnsType<T>) => {
        if ('dataIndex' in column) {
          const relevantValue = get(record, column.dataIndex);
          return (
            relevantValue &&
            relevantValue.toString().toLowerCase().includes(value.toLowerCase())
          );
        }
      },
      ...columnProps,
      render: columnRender,
      children:
        'children' in columnProps
          ? columnProps.children.map(columnsMapper)
          : undefined,
    };
  };

  return (
    <>
      <AntdTable sticky {...props} columns={props.columns.map(columnsMapper)} />
    </>
  );
}
