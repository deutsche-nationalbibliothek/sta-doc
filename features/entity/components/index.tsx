import { ColumnsType, Table } from '@/components/table';
import { Title } from '@/components/title';
import { EntityPreview } from '@/entity/components/preview';
import { useDataSource } from '@/hooks/use-pagetype';
import { DataSource } from '@/types/data-source';
import { Item } from '@/types/item';
import { dataSources } from '@/utils/constants';
import { PageHeader } from 'antd';
import Link from 'next/link';
import { useEffect } from 'react';
import { DataSourceImage } from './datasource-image';

export interface EntityIndexModel {
  label: string;
  id: string;
  pageTypeLabel: string;
}

interface EntityIndexProps {
  entities: EntityIndexModel[];
  dataSource?: DataSource;
}

export default function EntityIndex({
  entities,
  dataSource,
}: EntityIndexProps) {
  const { setDataSource } = useDataSource();

  useEffect(() => {
    setDataSource(dataSource);
  }, []);

  const dataSourceItems: Item[] =
    dataSource && dataSources[dataSource.toUpperCase()];

  const columns: ColumnsType<EntityIndexModel> = [
    {
      title: 'Eintrag',
      dataIndex: 'label',
      key: 'label',
      width: '30%',
      isSearchable: true,
      render: (
        label: string,
        entity,
        _index: number,
        children: JSX.Element
      ) => {
        return (
          <EntityPreview entityId={entity.id} label={label}>
            <Link href={`/entities/${entity.id}`}>{children}</Link>
          </EntityPreview>
        );
      },
    },
    {
      title: 'Zuordnung',
      dataIndex: 'pageTypeLabel',
      key: 'pageTypeLabel',
      width: '20%',
      filters: entities
        .reduce((acc, entity) => {
          const key = entity.pageTypeLabel;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
    },
  ];

  return (
    <>
      <PageHeader
        title={
          <Title
            headline={{
              title: `${
                dataSource && dataSourceItems
                  ? dataSource.toUpperCase() + ' '
                  : ''
              }Index`,
              level: 1,
              key: 'GndIndex',
            }}
          />
        }
        extra={dataSource && <DataSourceImage />}
      />
      <Table
        columns={columns}
        dataSource={entities.map((e) => ({ ...e, key: e.id }))}
      />
    </>
  );
}
