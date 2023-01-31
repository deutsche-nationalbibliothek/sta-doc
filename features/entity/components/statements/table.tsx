import { ColumnsType, Table } from '@/components/table';
import {
  isStringValue,
  isWikibaseValue,
  Statement,
  StringValue,
  WikiBaseValue,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { DownOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import React from 'react';
import { Qualifiers } from '../qualifiers';
import { StringValueComponent } from '../values/string';
import { WikibasePointers } from '../wikibase-pointers';

interface TableStatementsProps {
  statements: Statement[];
}

interface TableStatementsData {
  key: string;
  property: Property;
  values: {
    wikibasePointers: WikiBaseValue[];
    stringValues: StringValue[][];
  };
}

export const TableStatements: React.FC<TableStatementsProps> = ({
  statements,
}) => {
  const data: TableStatementsData[] = statements.map((statement) => {
    return {
      key: statement.label,
      property: statement.label as Property,
      values: {
        wikibasePointers:
          statement.wikibasePointer &&
          statement.wikibasePointer
            .filter(isWikibaseValue)
            .map((wikibasePointer: WikiBaseValue) => {
              const { qualifiers, ...otherWikibasePointerValues } =
                wikibasePointer;
              return otherWikibasePointerValues;
            }),
        stringValues:
          statement.string &&
          statement.string.map((stringStatement) =>
            stringStatement.values.filter(isStringValue)
          ),
      },
    };
  });

  const columns: ColumnsType<TableStatementsData> = [
    {
      key: 'property',
      dataIndex: 'property',
      className: 'table-cell-align-top',
      width: '20%',
    },
    {
      key: 'values',
      dataIndex: 'values',
      render: (values: TableStatementsData['values'], record) => (
        <>
          {values.wikibasePointers && (
            <WikibasePointers
              property={record.property}
              wikibasePointers={values.wikibasePointers}
            />
          )}
          {values.stringValues &&
            values.stringValues.map((stringStatement, index) => (
              <Typography.Paragraph
                key={index}
                ellipsis={{
                  rows: 6,
                  expandable: true,
                  symbol: (
                    <Divider>
                      <DownOutlined
                        style={{ color: 'var(--link-color)' }}
                        className="expandable-cell"
                      />
                    </Divider>
                  ),
                  suffix: '',
                }}
              >
                {stringStatement.map((stringValue, index) => (
                  <Typography.Paragraph key={index}>
                    <>
                      {/* if qualifiers, then only if first qualifier is not Recording-method-or-item */}
                      {(!stringValue.qualifiers ??
                        stringValue.qualifiers[0].property !==
                        Property['Recording-method-or-item']) && (
                          <StringValueComponent
                            code={record.property === Property.Encoding}
                            stringValue={stringValue}
                          />
                        )}
                      {stringValue.qualifiers && (
                        <>
                          <Qualifiers
                            showHeadline={false}
                            qualifiers={stringValue.qualifiers}
                          />
                        </>
                      )}
                    </>
                  </Typography.Paragraph>
                ))}
              </Typography.Paragraph>
            ))}
        </>
      ),
    },
  ];

  return (
    <Table<TableStatementsData>
      size="small"
      dataSource={data}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  );
};
