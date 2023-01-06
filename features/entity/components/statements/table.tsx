import { ColumnsType, Table } from '@/components/table';
import { Link } from '@/lib/next-link';
import { Item } from '@/types/item';
import {
  PageType,
  isWikibaseValue,
  WikiBaseValue,
  isStringValue,
  Statement,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Table as AntdTable } from 'antd';
import React from 'react';
import { EntityPreview } from '../preview';
import { Qualifiers } from '../qualifiers';
import { StringValueComponent } from '../values/string';
import { WikibasePointers } from '../wikibase-pointers';

interface TableStatementsProps {
  statements: Statement[];
  pageType: PageType;
}

export const TableStatements: React.FC<TableStatementsProps> = ({
  statements,
  pageType,
}) => {
  const elementsStatement = statements.find(
    (statement) => statement.property === Property.Elements
  );
  if (pageType.id === Item['rda-ressourcetype'] && elementsStatement) {
    return <RessourceTypeTable statement={elementsStatement} />;
  }

  const data = statements.map((statement) => {
    return {
      key: statement.label,
      property: statement.label,
      value: statement.wikibasePointer ? (
        <WikibasePointers
          wikibasePointers={statement.wikibasePointer
            .filter((wikibasePointer) => isWikibaseValue(wikibasePointer))
            .map((wikibasePointer: WikiBaseValue) => {
              const { qualifiers, ...otherWikibasePointerValues } =
                wikibasePointer;
              return otherWikibasePointerValues;
            })}
        />
      ) : (
        statement.string &&
        statement.string.map((stringStatement) =>
          stringStatement.values.map((stringValue, index) => {
            return (
              isStringValue(stringValue) && (
                <React.Fragment key={index}>
                  <StringValueComponent
                    code={statement.property === Property.Encoding}
                    stringValue={stringValue}
                  />
                  {stringValue.qualifiers && (
                    <>
                      <Qualifiers qualifiers={stringValue.qualifiers} />
                    </>
                  )}
                  <br />
                </React.Fragment>
              )
            );
          })
        )
      ),
    };
  });

  return (
    <AntdTable dataSource={data} pagination={false}>
      <AntdTable.Column
        title="Elementeigenschaften"
        key="property"
        dataIndex="property"
      />
      <AntdTable.Column title="Wert" key="value" dataIndex="value" />
    </AntdTable>
  );
};

interface RessourceTypeTableProps {
  statement: Statement;
}
interface RessourceTypeTableData {
  id: string;
  label: string;
  wemi: { link: string; label: string; id: string };
  status: { link: string; label: string; id: string };
}

const RessourceTypeTable: React.FC<RessourceTypeTableProps> = ({
  statement,
}) => {
  const data: RessourceTypeTableData[] = statement.wikibasePointer.map(
    (wikibasePointer) => {
      if (isWikibaseValue(wikibasePointer)) {
        const qualifierProps: any = {};
        const { label, id, qualifiers } = wikibasePointer;
        const wemi = qualifiers.find((q) => q.label === 'WEMI-Ebene');
        const status = qualifiers.find((q) => q.label === 'Status');
        if (wemi && isWikibaseValue(wemi.wikibasePointer[0])) {
          qualifierProps.wemi = wemi.wikibasePointer[0];
        } else {
          qualifierProps.wemi = { label: 'kein Wert' };
        }
        if (status && isWikibaseValue(status.wikibasePointer[0])) {
          qualifierProps.status = status.wikibasePointer[0];
        } else {
          qualifierProps.status = { label: 'kein Wert' };
        }
        return {
          label,
          id,
          key: id,
          ...qualifierProps,
        };
      }
    }
  );

  const columns: ColumnsType<RessourceTypeTableData> = [
    {
      title: 'Elemente',
      dataIndex: 'label',
      key: 'label',
      width: '30%',
      isSearchable: true,
      render: (
        label: string,
        entity,
        _index: number,
        children: JSX.Element
      ) => {
        return (
          <EntityPreview entityId={entity.id} label={label}>
            <Link href={`/entities/${entity.id}`}>{children}</Link>
          </EntityPreview>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'statusLabel',
      width: '20%',
      render: (status) => {
        return 'id' in status ? (
          <EntityPreview entityId={status.id} label={status.label}>
            <Link href={`/entities/${status.id}`}>{status.label}</Link>
          </EntityPreview>
        ) : (
          status.label
        );
      },
      filters: data
        .reduce((acc, date) => {
          const key = date.status.label;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
      sorter: (a, b) => (a.status.label > b.status.label ? 1 : -1),
      onFilter: (value, record) => {
        return record.status.label
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
    },
    {
      title: 'WEMI-Ebene',
      dataIndex: 'wemi',
      key: 'wemiLabel',
      width: '20%',
      render: (wemi) => {
        return (
          <EntityPreview entityId={wemi.id} label={wemi.label}>
            <Link href={`/entities/${wemi.id}`}>{wemi.label}</Link>
          </EntityPreview>
        );
      },
      filters: data
        .reduce((acc, date) => {
          const key = date.wemi.label;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
      sorter: (a, b) => (a.wemi.label > b.wemi.label ? 1 : -1),
      onFilter: (value, record) => {
        return record.wemi.label
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
    },
  ];

  return <Table<RessourceTypeTableData> dataSource={data} columns={columns} />;
};
