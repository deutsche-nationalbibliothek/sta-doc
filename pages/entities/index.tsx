import { ColumnsType, Table } from '@/components/table';
import { Title } from '@/components/title';
import entities from '@/data/parsed/entities.json';
import { EntityPreview } from '@/entity/components/preview';
import { EntityEntry } from '@/types/entity';
import { Item } from '@/types/item';
import { dataSources } from '@/utils/constants';
import Link from 'next/link';

interface LocalEntity {
  label: string;
  id: string;
  pageTypeLabel: string;
}

interface EntitiesListProps {
  entities: LocalEntity[];
  domain?: 'RDA' | 'GND';
}

export default function EntitiesList({ entities, domain }: EntitiesListProps) {
  const dataSource: Item[] = domain && dataSources[domain.toUpperCase()];

  const columns: ColumnsType<LocalEntity> = [
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
      <Title
        headline={{
          key: 'Entity-Index',
          title: `${
            domain && dataSource ? domain.toUpperCase() + ' ' : ''
          }Index`,
          level: 1,
        }}
      />
      <Table
        columns={columns}
        dataSource={entities.map((e) => ({ ...e, key: e.id }))}
      />
    </>
  );
}

// todo, getInitialProps size is too large -> get data with fetch
EntitiesList.getInitialProps = ({ query }) => {
  const { domain } = query as { domain?: 'GND' | 'RDA' };
  const dataSource: Item[] = domain && dataSources[domain.toUpperCase()];

  const entitiesInfo = Object.values(
    entities as unknown as Record<string, EntityEntry>
  )
    .filter((entityValue) => {
      return (
        !(domain && dataSource) ||
        (entityValue.entity.pageType &&
          dataSource.includes(entityValue.entity.pageType.id))
      );
    })
    .map((entityValue) => {
      const entity = entityValue.entity;
      const { label, id, pageType } = entity;
      return {
        label,
        id,
        pageTypeLabel: pageType?.deLabel ?? 'Keine Zuordnung',
      };
    });

  return { entities: entitiesInfo, domain };
};
