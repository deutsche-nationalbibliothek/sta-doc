import { Statement, WikiBaseValue } from '@/types/entity';
import { Table } from 'antd';
import Link from 'next/link';

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
        render={(wikibasePointers: WikiBaseValue[]) =>
          wikibasePointers &&
          wikibasePointers.map((wikibasePointer) => (
            <Link key={wikibasePointer.link} href={wikibasePointer.link}>
              {wikibasePointer.label}
            </Link>
          ))
        }
      />
    </Table>
  );
};
