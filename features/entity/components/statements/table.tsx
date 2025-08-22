import { ColumnsTypes, Table } from '@/components/table';
import {
  Statement,
  StringValue,
  WikibasePointerValue,
} from '@/types/parsed/entity';
import { Field } from '@/types/parsed/field';
import { Property } from '@/types/property';
import { Col, Row, Typography } from 'antd';
import { GndSubFieldTable } from '@/features/gnd/subfield-table';
import { compact } from 'lodash';
import React from 'react';
import { Qualifiers } from '../qualifiers';
import { StringValueComponent } from '../values/string';
import { WikibasePointers } from '../wikibase-pointers';
import { Item } from '@/types/item';
import { ExpandToggle } from '@/components/expand-toggle';
import { RdaElementStatus } from '@/types/parsed/rda-element-status';
import { WikibasePointer } from '../wikibase-pointers/wikibase-pointer';

interface TableStatementsProps {
  statements: Statement[];
  field?: Field;
  rdaElementStatuses?: RdaElementStatus[];
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
  rdaElementStatuses,
}) => {
  const data: TableStatementsData[] = compact([
    ...statements.map((statement) => {
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
    }),
    rdaElementStatuses && {
      key: 'Status',
      property: Property.Status,
      propertyLabel: 'Status',
      // just for type satisfaction, values will come from rdaElementStatuses
      values: {
        stringValues: [],
        wikibasePointers: [],
      },
    },
  ]);

  const columns: ColumnsTypes<TableStatementsData> = [
    {
      key: 'propertyLabel',
      dataIndex: 'propertyLabel',
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
              css={{
                '& .ant-table': {
                  margin: '0px !important',
                },
              }}
              id={record.property}
              subfields={field.subfields}
              isTopLevel
              showHeader
            />
          );
        }
        if (record.property === Property.Status && rdaElementStatuses) {
          return (
            <RdaElementStatusTable rdaElementStatus={rdaElementStatuses} />
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
                  <ExpandToggle key={index}>
                    {stringStatement.map((stringValue, index) => {
                      const linkItemQualifier =
                        stringValue.qualifiers?.find(
                          (qualifier) => {
                            return qualifier.property === Property['Link-(Item)'] || 
                            qualifier.property === Property['Link-(Property)']}
                        );
                      const typeOfLayoutQualifier =
                        stringValue.qualifiers?.find(
                          (qualifier) =>
                            qualifier.property === Property['Type-of-layout']
                        );
                      const typeQualifier =
                        stringValue.qualifiers?.find(
                          (qualifier) =>
                            qualifier.property === Property.Type
                        );
                      const typeOfLayout =
                        typeOfLayoutQualifier?.wikibasePointers &&
                        typeOfLayoutQualifier.wikibasePointers[0].id;
                      return (
                        <Typography.Paragraph
                          css={{
                            '& div': {
                              padding: '0 2px 0 2px',
                            },
                          }}
                          key={index}
                        >
                          {typeQualifier && stringValue.qualifiers && (
                            <>
                              <Row>
                                <Col span={5} style={{ paddingLeft: 0, marginLeft: 0 }}>
                                  <StringValueComponent
                                    itemType={
                                      stringValue.itemType ?? typeOfLayout
                                    }
                                    property={stringValue.property}
                                    stringValue={stringValue}
                                  >
                                  </StringValueComponent>
                                </Col>
                                <Col span={12}>
                                  <Qualifiers
                                    showHeadline={false}
                                    qualifiers={stringValue.qualifiers}
                                  />
                                </Col>
                              </Row>
                            </>
                          )}
                          {linkItemQualifier ? (
                            <>
                              <Qualifiers
                                showHeadline={false}
                                qualifiers={(
                                  stringValue.qualifiers as Statement[]
                                ).map((qualifier) => ({
                                  ...qualifier,
                                  wikibasePointers:
                                    qualifier.wikibasePointers?.map(
                                      (wikibasePointer) => ({
                                        ...wikibasePointer,
                                        label: stringValue.value,
                                      })
                                    ),
                                }))}
                              />
                            </>
                          ) : !typeQualifier && (
                            <>
                              {
                                <StringValueComponent
                                  itemType={
                                    stringValue.itemType ?? typeOfLayout
                                  }
                                  property={stringValue.property}
                                  stringValue={stringValue}
                                />
                              }
                              {stringValue.qualifiers && (
                                  <Qualifiers
                                    showHeadline={false}
                                    qualifiers={stringValue.qualifiers}
                                  />
                              )}
                            </>
                          )}
                        </Typography.Paragraph>
                      );
                    })}
                  </ExpandToggle>
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
      style={{ marginBottom: '6px' }}
      dataSource={data}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  );
};

interface RdaElementStatusTableProps {
  rdaElementStatus: RdaElementStatus[];
}

interface RdaElementStatusTableColumnType extends RdaElementStatus {
  key: string;
}

const RdaElementStatusTable: React.FC<RdaElementStatusTableProps> = ({
  rdaElementStatus,
}) => {
  const sameStatus = rdaElementStatus.filter(
    (element) => element.status.id !== rdaElementStatus[0].status.id
  );
  if (sameStatus.length === 0) {
    rdaElementStatus = rdaElementStatus.slice(0, 1);
    rdaElementStatus[0].ressourceType.id =
      Item['Application-profiles-of-RDA-general'];
    rdaElementStatus[0].ressourceType.label = 'Alle Anwendungsprofile';
    rdaElementStatus[0].ressourceType.staNotationLabel = 'RDA-AP';
  }
  const columns: ColumnsTypes<RdaElementStatusTableColumnType> = [
    {
      key: 'ressource-type',
      dataIndex: 'ressourceType',
      width: '35%',
      title: 'Ressourcentyp',
      noSort: true,
      render: (ressourceTypeWikibasePointer: WikibasePointerValue) => (
        <WikibasePointer wikibasePointer={ressourceTypeWikibasePointer} />
      ),
    },
    {
      key: 'status',
      dataIndex: 'status',
      width: '15%',
      title: 'Status',
      noSort: true,
      render: (statusWikibasePointer: WikibasePointerValue) => (
        <WikibasePointer wikibasePointer={statusWikibasePointer} />
      ),
    },
  ];
  if (rdaElementStatus.some((s) => s.description)) {
    columns.push({
      key: ' description',
      dataIndex: 'description',
      width: '50%',
      title: 'Beschreibung',
      noSort: true,
      render: (description: string) => (
        <StringValueComponent stringValue={{ value: description }} />
      ),
    });
  }
  return (
    <Table<RdaElementStatus>
      css={{
        '& .ant-table': {
          margin: '0px !important',
          marginBottom: '10px',
        },
      }}
      showHeader={false}
      dataSource={rdaElementStatus.map((e) => ({ ...e, key: e.status.id }))}
      columns={columns as ColumnsTypes<RdaElementStatus>}
      pagination={rdaElementStatus.length > 7 ? { pageSize: 7 } : false}
    />
  );
};
