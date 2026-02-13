import { ColumnsTypes, Table } from '@/components/table';
import { EntityLink } from '@/entity/components/preview/link';
import { EntityId } from '@/types/entity-id';
import { Subfield } from '@/types/parsed/field';
import { Typography } from 'antd';

interface GndSubFieldTableProps {
  id: EntityId;
  locale?: string;
  subfields: Subfield[];
  showHeader?: boolean;
  singleColumn?: string;
  className?: string;
  isTopLevel?: boolean;
}

export const GndSubFieldTable: React.FC<GndSubFieldTableProps> = (props) => {
  const columns: ColumnsTypes<Subfield> = [
    {
      hidden: props.singleColumn && props.singleColumn !== 'PICA' || false,
      title: 'PICA3',
      width: '12%',
      dataIndex: ['codings', 'PICA3'],
      key: 'PICA3',
      noSort: true,
      render: (_coding, _record, _index, highlighted) => {
        return <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      hidden: props.singleColumn && props.singleColumn !== 'PICA' || false,
      title: 'PICA+',
      width: '12%',
      dataIndex: ['codings', 'PICA+'],
      noSort: true,
      key: 'PICA+',
      render: (_coding, _record, _index, highlighted) => {
        return <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      hidden: props.singleColumn && props.singleColumn !== 'Alma' || false,
      title: 'Alma',
      width: '12%',
      dataIndex: ['codings', 'Alma'],
      noSort: true,
      key: 'Alma',
      render: (_coding, _record, _index, highlighted) => {
        return <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      hidden: props.singleColumn && props.singleColumn !== 'Aleph' || false,
      title: 'Aleph',
      width: '12%',
      dataIndex: ['codings', 'Aleph'],
      noSort: true,
      key: 'Alma',
      render: (_coding, _record, _index, highlighted) => {
        return <Typography.Text code>{highlighted}</Typography.Text>;
      },
    },
    {
      title: 'Bezeichnung',
      // width: '30%',
      dataIndex: props.locale === 'fr' ? 'labelFr' : 'labelDe',
      noSort: true,
      key: 'label',
      render: (_data, record, _index, highlightedContent) => {
        return <EntityLink id={record.id} label={record.labelDe} staNotationLabel={record.staNotationLabel}>{highlightedContent}</EntityLink>;
      },
    },
    {
      title: 'Wiederholung',
      width: '12%',
      dataIndex: 'repeatable',
      noSort: true,
      key: 'repeatable',
      render: (_data, record) => {
        return record.repeatable ? record.repeatable : 'Wert nicht vergeben';
      },
    },
  ];
  return (
    <Table<Subfield>
      className={props.className}
      key={props.id}
      pagination={false}
      showHeader={props.showHeader || false}
      columns={
        props.isTopLevel
          ? columns
          : [
              {
                key: 'subfield-table',
                children: columns,
              },
            ]
      }
      dataSource={props.subfields.map((subfield) => ({
        ...subfield,
        key: subfield.id,
      }))}
      rowClassName='grey-background'
    />
  );
};
