import { Statement, WikiBaseValue } from '@/types/entity';
import { Table } from 'antd';
import Link from 'next/link';
import { WikibasePointers } from '../wikibase-pointers';

interface TableStatementsProps {
  statements: Statement[];
}

export const TableStatements: React.FC<TableStatementsProps> = ({
  statements,
}) => {
  const data = statements.map((statement) => {
    return {
      key: statement.label,
      property: statement.label,
      value:
        statement.wikibasePointer &&
        statement.wikibasePointer.filter(
          (wikibasePointer) => 'label' in wikibasePointer
        ),
    };
  });

  return (
    <Table dataSource={data} pagination={false}>
      <Table.Column
        title="Elementeigenschaften"
        key="property"
        dataIndex="property"
      />
      <Table.Column
        title="Wert"
        key="value"
        dataIndex="value"
        render={(wikibasePointers: WikiBaseValue[]) => {
          return  wikibasePointers &&
            <WikibasePointers wikibasePointers={wikibasePointers.map(wikibasePointer => {
              const {qualifiers, ...otherWikibasePointerValues} = wikibasePointer
              return otherWikibasePointerValues;
            })} />
        }
        }
      />
    </Table>
  );
};
