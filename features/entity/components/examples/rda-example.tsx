import { ColumnsTypes, Table } from '@/components/table';
import { EntityLink } from '../preview/link';
import { StringGroupsStatement } from '../statements/string-groups';
import { compact, flattenDeep } from 'lodash';
import {
  ExampleProps,
  PreData,
  TableData,
  nonDefaultRenderProperties,
} from './example';
import { Statement } from '@/types/parsed/entity';
import { theme } from 'antd';

export const RdaExample: React.FC<ExampleProps> = ({ entity }) => {
  const { token } = theme.useToken();

  const relevantStatemants = entity.statements.body.filter(
    (statement) => !nonDefaultRenderProperties.includes(statement.property)
  );
  const preData: Record<string, PreData> = flattenDeep(
    compact(
      relevantStatemants.map(
        (statement) =>
          statement.stringGroups &&
          statement.stringGroups.map((stringStatement) =>
            stringStatement.values.map((stringValue) => ({
              key: statement.label,
              statement,
              value: stringValue.value,
            }))
          )
      )
    )
  ).reduce(
    (
      acc,
      stringValueMeta: { key: string; value: string; statement: Statement }
    ) => {
      if (acc[stringValueMeta.key]) {
        acc[stringValueMeta.key] = {
          ...acc[stringValueMeta.key],
          values: [...acc[stringValueMeta.key].values, stringValueMeta],
        };
      } else {
        acc[stringValueMeta.key] = {
          values: [stringValueMeta],
          statement: stringValueMeta.statement,
        };
      }
      return acc;
    },
    {} as Record<string, PreData>
  );
  const data: TableData[] = Object.entries(preData).map(([key, value]) => ({
    label: key,
    values: value.values,
    statement: value.statement,
  }));

  const columns: ColumnsTypes<TableData> = [
    {
      dataIndex: 'label',
      key: 'label',
      render: (label: string, { statement }) => {
        return (
          <EntityLink
            namespace={statement.namespace}
            id={statement.property}
            label={label}
            staNotationLabel={statement.staNotationLabel}
          />
        );
      },
      width: '33%',
    },
    {
      dataIndex: 'values',
      key: 'values',
      render: (_values, { statement }) => {
        return (
          statement.stringGroups && (
            <StringGroupsStatement
              property={statement.property}
              statements={statement.stringGroups}
            />
          )
        );
      },
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <Table<TableData>
          dataSource={data}
          pagination={false}
          columns={columns}
          showHeader={false}
          css={{
            '& .ant-table': {
              borderLeft: `3px solid ${token.colorPrimaryBorder}`,
            },
            '& .ant-table-cell': {
              backgroundColor: 'var(--light-gray) !important',
              borderTop: `1px solid white`,
              borderRight: `2px solid white`,
            },
          }}
        />
      )}
    </>
  );
};
