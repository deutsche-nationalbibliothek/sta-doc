import { ColumnsTypes, Table } from '@/components/table';
import {
  Statement,
  StringValue,
  WikibasePointerValue,
} from '@/types/parsed/entity';
import { Field } from '@/types/parsed/field';
import { Property } from '@/types/property';
import { DownOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import { GndSubFieldTable } from '@/features/gnd/subfield-table';
import { compact } from 'lodash';
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
    wikibasePointers: WikibasePointerValue[];
    stringValues: StringValue[][];
  };
}

export const TableStatements: React.FC<TableStatementsProps> = ({
  statements,
  field,
}) => {
  const data: TableStatementsData[] = compact(
    statements.map((statement) => {
      return (
        statement.label && {
          key: statement.label,
          property: statement.property,
          propertyLabel: statement.label,
          values: {
            wikibasePointers: statement.wikibasePointers
              ? statement.wikibasePointers.map(
                  (wikibasePointer: WikibasePointerValue) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { qualifiers, ...otherWikibasePointerValues } =
                      wikibasePointer;
                    return otherWikibasePointerValues;
                  }
                )
              : [],
            stringValues: statement.stringGroups
              ? statement.stringGroups.map((stringGroup) => stringGroup.values)
              : [],
          },
        }
      );
    })
  );

  const columns: ColumnsTypes<TableStatementsData> = [
    {
      key: 'propertyLabel',
      dataIndex: 'propertyLabel',
      className: 'table-cell-align-top statement-table-property-column',
      width: '20%',
    },
    {
      key: 'values',
      dataIndex: 'values',
      className: 'statement-table-values-column',
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
                                itemType={stringValue.itemType}
                                property={record.property}
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
    <div
      css={{
        // '.statement-table-values-column': {},
        '.statement-table-property-column': { verticalAlign: 'top' },
      }}
    >
      <Table<TableStatementsData>
        size="small"
        dataSource={data}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </div>
  );
};
