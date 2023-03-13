import { ExternalLink } from '@/components/external-link';
import { ColumnsType, Table } from '@/components/table';
import { EntityLink } from '@/entity/components/preview/link';
import { EntityId } from '@/types/entity-id';
import { Subfield } from '@/types/parsed/field';
import { EditOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

interface GndSubFieldTableProps {
  id: EntityId;
  subfields: Subfield[];
  showHeader?: boolean;
  className?: string;
}

export const GndSubFieldTable: React.FC<GndSubFieldTableProps> = (props) => {
  const columns: ColumnsType<Subfield> = [
    {
      title: 'PICA3',
      width: '15%',
      dataIndex: ['codings', 'PICA3'],
      key: 'PICA3',
      noSort: true,
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      title: 'PICA+',
      width: '15%',
      dataIndex: ['codings', 'PICA+'],
      noSort: true,
      key: 'PICA+',
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      title: 'MARC21',
      dataIndex: ['codings', 'MARC 21'],
      width: '25%',
      noSort: true,
      key: 'PICA3',
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      title: 'Bezeichnung',
      width: '30%',
      dataIndex: 'label',
      noSort: true,
      key: 'label',
      render: (_data, record) => {
        return <EntityLink {...record} />;
      },
    },
    {
      title: 'Wiederholung',
      width: '10%',
      dataIndex: 'repeatable',
      noSort: true,
      key: 'label',
      render: (_data, record) => {
        return record.repeatable ? 'Ja' : 'Nein';
      },
    },
  ];
  return (
    <Table<Subfield>
      className={props.className}
      key={props.id}
      pagination={false}
      showHeader={props.showHeader || false}
      columns={[
        {
          key: 'subfield-table',
          children: columns,
        },
      ]}
      dataSource={props.subfields.map((subfield) => ({
        ...subfield,
        key: subfield.id,
      }))}
    />
  );
};
