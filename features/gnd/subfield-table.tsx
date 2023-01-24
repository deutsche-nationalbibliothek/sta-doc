import { ExternalLink } from '@/components/external-link';
import { ColumnsType, Table } from '@/components/table';
import { EntityPreview } from '@/entity/components/preview';
import { Link } from '@/lib/next-link';
import { Field, Subfield } from '@/types/parsed/field';
import { EditOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

export const GndSubFieldTable: React.FC<Field> = (props) => {
  const columns: ColumnsType<Subfield> = [
    {
      title: 'PICA3',
      width: '15%',
      dataIndex: ['codings', 'PICA3'],
      key: 'PICA3',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      width: '15%',
      dataIndex: ['codings', 'PICA+'],
      key: 'PICA+',
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      dataIndex: ['codings', 'MARC 21'],
      width: '25%',
      key: 'PICA3',
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      width: '40%',
      dataIndex: 'label',
      key: 'label',
      render: (_data, record) => {
        return (
          <>
            <EntityPreview entityId={record.id} label={record.label}>
              <Link href={`/entities/${record.id}`}>{record.label}</Link>
            </EntityPreview>
          </>
        );
      },
    },
    {
      dataIndex: 'viewLink',
      key: 'external-links',
      width: '5%',
      render: (_definition, record) => {
        return (
          <>
            <ExternalLink href={record.viewLink}>
              <EyeOutlined />
            </ExternalLink>{' '}
            <ExternalLink href={record.editLink}>
              <EditOutlined />
            </ExternalLink>
          </>
        );
      },
    },
  ];
  return (
    <Table<Subfield>
      key={props.id}
      pagination={false}
      showHeader={false}
      columns={[
        {
          key: 'subfield-table',
          title: (
            <Typography.Text strong>
              Unterfelder von{' '}
              <EntityPreview entityId={props.id} label={props.label}>
                <Link href={`/entities/${props.id}`}>{props.label}</Link>
              </EntityPreview>
            </Typography.Text>
          ),
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
