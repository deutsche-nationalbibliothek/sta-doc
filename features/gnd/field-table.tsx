import { ExternalLink } from '@/components/external-link';
import { ColumnsType, Table } from '@/components/table';
import { EntityPreview } from '@/entity/components/preview';
import { GndFieldsProps } from '@/pages/gnd/fields';
import { Field } from '@/types/parsed/field';
import { EditOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Link from 'next/link';
import { GndSubFieldTable } from './subfield-table';

export const GndFieldsTable: React.FC<GndFieldsProps> = ({ fields }) => {
  const columns: ColumnsType<Field> = [
    {
      title: 'Codings',
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
      title: 'Feld',
      children: [
        {
          title: 'Bezeichnung',
          dataIndex: 'label',
          key: 'label',
          width: '25%',
          isSearchable: true,
          render: (_data, record, _index, highlightedContent) => {
            return (
              <EntityPreview entityId={record.id} label={record.label}>
                <Link href={`/entities/${record.id}`}>
                  {highlightedContent}
                </Link>
              </EntityPreview>
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
      ],
    },
  ];

  return (
    <Table<Field>
      columns={columns}
      dataSource={fields.map((field) => ({ ...field, key: field.id }))}
      expandable={{ expandedRowRender: GndSubFieldTable }}
    />
  );
};
