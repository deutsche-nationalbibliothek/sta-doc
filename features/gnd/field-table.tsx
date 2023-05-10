import { ColumnsTypes, Table } from '@/components/table';
import { EntityLink } from '@/entity/components/preview/link';
import { Field } from '@/types/parsed/field';
import { Typography } from 'antd';
import { GndSubFieldTable } from './subfield-table';
import { GndFieldsProps } from '@/pages/GND-DF';

export const GndFieldsTable: React.FC<
  GndFieldsProps & { className?: string }
> = ({ fields, className }) => {
  const columns: ColumnsTypes<Field> = [
    {
      title: 'PICA3',
      width: '15%',
      dataIndex: ['codings', 'PICA3'],
      key: 'PICA3',
      isSearchable: true,
      render: (coding: string, _record, _index, highlighted) => {
        return coding ? (
          <Typography.Text code>{highlighted}</Typography.Text>
        ) : null;
      },
    },
    {
      title: 'PICA+',
      width: '15%',
      dataIndex: ['codings', 'PICA+'],
      key: 'PICA+',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding ? (
          <Typography.Text code>{highlighted}</Typography.Text>
        ) : null;
      },
    },
    {
      title: 'MARC21',
      dataIndex: ['codings', 'MARC 21'],
      width: '25%',
      key: 'MARC21',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding ? (
          <Typography.Text code>{highlighted}</Typography.Text>
        ) : null;
      },
    },
    {
      title: 'Bezeichnung',
      dataIndex: 'label',
      key: 'label',
      width: '35%',
      isSearchable: true,
      render: (_data, record, _index, highlightedContent) => {
        return <EntityLink {...record}>{highlightedContent}</EntityLink>;
      },
    },
    {
      title: 'Wiederholung',
      width: '10%',
      dataIndex: 'repeatable',
      key: 'repeatable',
      render: (_data, record) => {
        return record.repeatable ? 'Ja' : 'Nein';
      },
    },
  ];

  return (
    <Table<Field>
      className={className}
      columns={columns.map((column) => ({
        ...column,
        isSearchable: column.isSearchable && fields.length > 1,
        noSort: column.noSort || fields.length < 2,
      }))}
      pagination={fields.length > 10 ? undefined : false}
      dataSource={fields.map((field) => ({ ...field, key: field.id }))}
      expandable={{ expandedRowRender: GndSubFieldTable }}
    />
  );
};
