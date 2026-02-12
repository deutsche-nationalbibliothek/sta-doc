import { ColumnsTypes, Table } from '@/components/table';
import { EntityLink } from '@/entity/components/preview/link';
import { Field, Fields } from '@/types/parsed/field';
import { Typography } from 'antd';
import { GndSubFieldTable } from './subfield-table';
// import { GndFieldsProps } from '@/pages/GND-DF';
import useTranslation from 'next-translate/useTranslation';

export interface GndFieldsProps {
  fields: Fields;
  locale: string;
  singleColumn?: string;
}

export const GndFieldsTable: React.FC<
  GndFieldsProps & { className?: string }
> = ({ fields, className, locale, singleColumn }) => {
  const { t } = useTranslation('common');
  const columns: ColumnsTypes<Field> = [
    {
      hidden: singleColumn && singleColumn !== 'PICA' || false,
      title: 'PICA3',
      width: '12%',
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
      hidden: singleColumn && singleColumn !== 'PICA' || false,
      title: 'PICA+',
      width: '12%',
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
      hidden: singleColumn && singleColumn !== 'Alma' || false,
      title: 'Alma',
      width: '12%',
      dataIndex: ['codings', 'Alma'],
      key: 'Alma',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding ? (
          <Typography.Text code>{highlighted}</Typography.Text>
        ) : null;
      },
    },
    {
      hidden: singleColumn && singleColumn !== 'Aleph' || false,
      title: 'Aleph',
      width: '12%',
      dataIndex: ['codings', 'Aleph'],
      key: 'Aleph',
      isSearchable: true,
      render: (coding, _record, _index, highlighted) => {
        return coding ? (
          <Typography.Text code>{highlighted}</Typography.Text>
        ) : null;
      },
    },
    {
      title: t('description'),
      dataIndex: locale && locale === 'fr' ? 'labelFr' : 'labelDe',
      key: 'label',
      // width: '30%',
      isSearchable: true,
      render: (_data, record, _index, highlightedContent) => {
        return <EntityLink id={record.id} label={record.labelDe} staNotationLabel={record.staNotationLabel}>{highlightedContent}</EntityLink>;
      },
    },
    {
      title: t('repetition'),
      width: '12%',
      dataIndex: 'repeatable',
      key: 'repeatable',
      render: (_data, record) => {
        return record.repeatable ? record.repeatable : 'Value missing';
      },
    },
  ];

  return (
    <Table<Field>
      className={className}
      columns={columns.map((column) => ({
        ...column,
        isSearchable: column.isSearchable && Object.values(fields).length > 1,
        noSort: column.noSort || Object.values(fields).length < 2,
      }))}
      pagination={Object.values(fields).length > 10 ? {locale: { items_per_page: '/ '+ t('site') }} : false}
      dataSource={Object.values(fields).map((field) => ({ ...field, key: field.id, locale, singleColumn }))}
      expandable={{
        expandedRowOffset: 1,
        expandedRowRender: (props) => (
          <GndSubFieldTable
            className={className}
            {...props}
          />
        ),
      }}
    />
  );
};
