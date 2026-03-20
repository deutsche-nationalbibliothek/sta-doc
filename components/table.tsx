import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  InputRef,
  Space,
  Table as AntdTable,
  Typography,
  Tooltip,
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
import { MyHighlighter } from '@/lib/highlighter';
import useTranslation from 'next-translate/useTranslation';

export declare type DataIndex = string;

interface TableProps<T> extends Omit<AntdTableProps<T>, 'columns'> {
  columns?: ColumnsTypes<T>;
}

interface ColumnType<T> extends Omit<AntdColumnType<T>, 'render'> {
  isSearchable?: boolean;
  noSort?: boolean;
  sorterTooltip?: string;
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
  sorterTooltip?: string;
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
  const { t } = useTranslation('common');
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
          placeholder={`${t('search')} ${String(key)}`}
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
              {t('search')}
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
              {t('reset')}
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
        <MyHighlighter
          searchWords={searchTexts[dataIndex].split(' ')}
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
    let { render, isSearchable, noSort, sorterTooltip, ...columnProps } = column;
    if (isSearchable && 'dataIndex' in column) {
      columnProps = {
        ...columnProps,
        ...getColumnSearchProps(String(column.dataIndex), String(column.key)),
      };
    }

    const sorterWithTooltip = !noSort && 'dataIndex' in column
      ? {
          sorter: (a: T, b: T) =>
            column.dataIndex &&
            new Intl.Collator(undefined, {
              numeric: true,
              sensitivity: 'base',
            }).compare(
              get(a, column.dataIndex as string) as string,
              get(b, column.dataIndex as string) as string
            ),
          sortDirections: ['ascend', 'descend', 'ascend'],
          title: sorterTooltip ? (
            <Tooltip title={t('sorterTooltip')}>
              <span>
                <QuestionCircleOutlined
                  style={{ marginLeft: 4, color: 'rgba(0, 0, 0, 0.45)' }}
                />
              </span>
            </Tooltip>
          ) : (
            column.title
          ),
        }
      : undefined;

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
                  <MyHighlighter
                    searchWords={searchTexts[String(column.dataIndex)].split(
                      ' '
                    )}
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
                  <MyHighlighter
                    searchWords={searchTexts[String(column.dataIndex)].split(
                      ' '
                    )}
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
              new Intl.Collator(undefined, {
                numeric: true,
                sensitivity: 'base',
              }).compare(
                get(a, column.dataIndex as string) as string,
                get(b, column.dataIndex as string) as string
              )
          : undefined,
      onFilter: (value: string, record: T) => {
        if ('dataIndex' in column && column.dataIndex) {
          const searchWords = value.toLowerCase().split(/\s+/);
          const relevantValue = get(record, column.dataIndex as string) as
            | string
            | undefined;
          return relevantValue &&
            searchWords.every((word) =>
              relevantValue.toString().toLowerCase().includes(word)
            )
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
      ...sorterWithTooltip,
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