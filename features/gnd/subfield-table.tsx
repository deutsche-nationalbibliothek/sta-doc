import { ExternalLink } from '@/components/external-link';
import { ColumnsType, Table } from '@/components/table';
import { EntityPreview } from '@/entity/components/preview';
import { Field, Subfield } from '@/types/parsed/field';
// import { Field, Subfield } from '@/types/field';
import { EditOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Link from 'next/link';

export const GndSubFieldTable: React.FC<Field> = (props) => {
  const columns: ColumnsType<Subfield> = [
    {
      title: 'Codings',
      key: 'codings',
      children: [
        {
          title: 'PICA3',
          width: '8%',
          dataIndex: ['codings', 'PICA3'],
          key: 'PICA3',
          isSearchable: true,
          render: (coding, _record, _index, highlighted) => {
            return (
              coding && <Typography.Text code>{highlighted}</Typography.Text>
            );
          },
        },
        {
          title: 'PICA+',
          width: '8%',
          dataIndex: ['codings', 'PICA+'],
          key: 'PICA+',
          isSearchable: true,
          render: (coding, _record, _index, highlighted) => {
            return (
              coding && <Typography.Text code>{highlighted}</Typography.Text>
            );
          },
        },
        {
          title: 'MARC21',
          dataIndex: ['codings', 'MARC 21'],
          width: '14%',
          key: 'PICA3',
          isSearchable: true,
          render: (coding, _record, _index, highlighted) => {
            return (
              coding && <Typography.Text code>{highlighted}</Typography.Text>
            );
          },
        },
      ],
    },
    {
      title: 'Bezeichnung',
      width: '25%',
      dataIndex: 'label',
      key: 'label',
      filters: props.subfields
        .reduce((acc, subfield) => {
          const key = subfield.label;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
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
      title: 'Beschreibung',
      width: '40%',
      dataIndex: 'description',
      key: 'description',
      isSearchable: true,
      render: (_description, _record, _index, highlighted) => {
        return <Typography.Text>{highlighted}</Typography.Text>;
      },
    },
    {
      title: <GlobalOutlined />,
      dataIndex: 'viewLink',
      key: 'external-links',
      width: '5%',
      noSort: true,
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
