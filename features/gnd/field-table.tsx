import { ExternalLink } from '@/components/external-link';
import { ColumnsType, Table } from '@/components/table';
import { EntityLink } from '@/entity/components/preview/link';
import { GndFieldsProps } from '@/pages/gnd/fields';
import { Field } from '@/types/parsed/field';
import { EditOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { GndSubFieldTable } from './subfield-table';

export const GndFieldsTable: React.FC<GndFieldsProps> = ({ fields }) => {
  const columns: ColumnsType<Field> = [
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
      title: 'PICA+',
      width: '15%',
      dataIndex: ['codings', 'PICA+'],
      key: 'PICA+',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      title: 'MARC21',
      dataIndex: ['codings', 'MARC 21'],
      width: '25%',
      key: 'PICA3',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding && <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      title: 'Bezeichnung',
      dataIndex: 'label',
      key: 'label',
      width: '40%',
      isSearchable: true,
      render: (_data, record, _index, highlightedContent) => {
        return (
          <EntityLink {...record} >
            {highlightedContent}
          </EntityLink>
        );
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
    <Table<Field>
      columns={columns}
      dataSource={fields.map((field) => ({ ...field, key: field.id }))}
      expandable={{ expandedRowRender: GndSubFieldTable }}
    />
  );
};