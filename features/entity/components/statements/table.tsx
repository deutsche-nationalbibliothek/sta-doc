import { ColumnsType, Table } from '@/components/table';
import {
  isStringValue,
  isWikibaseValue,
  Statement,
  StringValue,
  WikiBaseValue,
} from '@/types/parsed/entity';
import { Field } from '@/types/parsed/field';
import { Property } from '@/types/property';
import { DownOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import { GndSubFieldTable } from 'features/gnd/subfield-table';
import React from 'react';
import { Qualifiers } from '../qualifiers';
import { StringValueComponent } from '../values/string';
import { WikibasePointers } from '../wikibase-pointers';

interface TableStatementsProps {
  statements: Statement[];
  field?: Field;
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
  field,
}) => {
  const data: TableStatementsData[] = statements.map((statement) => {
    return {
      key: statement.label,
      property: statement.property,
      propertyLabel: statement.label,
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
      key: 'propertyLabel',
      dataIndex: 'propertyLabel',
      className: 'table-cell-align-top',
      width: '20%',
    },
    {
      key: 'values',
      dataIndex: 'values',
      render: (values: TableStatementsData['values'], record) => {
        if (record.property === Property.Subfields && field) {
          return (
            <GndSubFieldTable
              id={record.property}
              subfields={field.subfields}
              className="gnd-subfield-table"
              showHeader
            />
          );
        }
        return (
          <>
            {values.wikibasePointers && (
              <WikibasePointers
                property={record.property}
                wikibasePointers={values.wikibasePointers}
              />
            )}
            {values.stringValues &&
              values.stringValues.map((stringStatement, index) => {
                console.log({ stringStatement });
                return (
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
                    {stringStatement.map((stringValue, index) => {
                      return (
                        <Typography.Paragraph key={index}>
                          <>
                            {stringValue.qualifiers && (
                              <>
                                <Qualifiers
                                  showHeadline={false}
                                  qualifiers={stringValue.qualifiers}
                                />
                              </>
                            )}
                            {/* if qualifiers, then only if first qualifier is not Recording-method-or-item */}
                            {((stringValue.qualifiers &&
                              stringValue.qualifiers[0]?.property !==
                              Property['Recording-method-or-item']) ||
                              !stringValue.qualifiers) && (
                                <StringValueComponent
                                  code={record.property === Property.Encoding}
                                  stringValue={stringValue}
                                />
                              )}
                          </>
                        </Typography.Paragraph>
                      );
                    })}
                  </Typography.Paragraph>
                );
              })}
          </>
        );
      },
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
