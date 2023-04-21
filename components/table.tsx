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
  columns?: ColumnsTypes<T>;
}

interface ColumnType<T> extends Omit<AntdColumnType<T>, 'render'> {
  isSearchable?: boolean;
  noSort?: boolean;
  render?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    record: T,
    index: number,
    children: JSX.Element
  ) => React.ReactNode | RenderedCell<T>;
}

interface ColumnGroupType<T>
  extends Omit<AntdColumnGroupType<T>, 'render' | 'children'> {
  children?: ColumnsTypes<T>;
  isSearchable?: boolean;
  noSort?: boolean;
  render?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    record: T,
    index: number,
    children: JSX.Element
  ) => React.ReactNode | RenderedCell<T>;
}

export declare type ColumnType2<T = unknown> =
  | ColumnGroupType<T>
  | ColumnType<T>;

export declare type ColumnsTypes<T = unknown> = (
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
      <div css={{ padding: '0.5em' }} onKeyDown={(e) => e.stopPropagation()}>
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
        />
        <div css={{ paddingTop: '0.5em' }}>
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
            >
              Suchen
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) {
                  handleReset(clearFilters, dataIndex);
                  handleSearch(selectedKeys as string[], confirm, dataIndex);
                }
              }}
              size="small"
            >
              Zurücksetzen
            </Button>
          </Space>
        </div>
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columnsMapper = (column: ColumnType<T> | ColumnGroupType<T>): any => {
    // eslint-disable-next-line prefer-const
    let { render, isSearchable, noSort, ...columnProps } = column;
    if (isSearchable && 'dataIndex' in column) {
      columnProps = {
        ...columnProps,
        ...getColumnSearchProps(String(column.dataIndex), String(column.key)),
      };
    }
    const columnRender =
      render && 'dataIndex' in column
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (value: any, record: T, index: number) => {
            return (
              render &&
              render(
                value,
                record,
                index,
                searchTexts[String(column.dataIndex)] ? (
                  <Highlighter
                    searchWords={[searchTexts[String(column.dataIndex)]]}
                    textToHighlight={value ? String(value) : ''}
                  />
                ) : (
                  <>{value}</>
                )
              )
            );
          }
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (value: any) => {
            return (
              <Typography.Text>
                {'dataIndex' in column &&
                searchTexts[String(column.dataIndex)] ? (
                  <Highlighter
                    searchWords={[searchTexts[String(column.dataIndex)]]}
                    textToHighlight={value ? String(value) : ''}
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
          ? (a: T, b: T) =>
              column.dataIndex &&
              a[String(column.dataIndex) as keyof typeof a] >
                b[String(column.dataIndex) as keyof typeof b]
                ? 1
                : -1
          : () => 1,
      onFilter: (value: string, record: T) => {
        if ('dataIndex' in column && column.dataIndex) {
          const relevantValue = get(record, column.dataIndex) as
            | string
            | undefined;
          return relevantValue &&
            relevantValue.toString().toLowerCase().includes(value.toLowerCase())
            ? true
            : false;
        } else {
          return false;
        }
      },
      ...columnProps,
      render: columnRender,
      children:
        'children' in columnProps && columnProps.children
          ? columnProps.children.map(columnsMapper)
          : undefined,
    };
  };

  return (
    <>
      <AntdTable
        sticky
        {...props}
        columns={props.columns?.map(columnsMapper) ?? []}
      />
    </>
  );
}
