import { Title } from '@/components/title';
import entities from '@/data/parsed/entities.json';
import { EntityPreview } from '@/entity/components/preview';
import { useHeadlines } from '@/hooks/use-headlines';
import { Entity, EntityEntry } from '@/types/entity';
import { Headline } from '@/types/headline';
import { Item } from '@/types/item';
import { dataSources } from '@/utils/constants';
import Link from 'next/link';
import React from 'react';
import { useEffect } from 'react';

interface EntitiesListProps {
  entitiesByPageTypes: Record<string, Entity[]>;
  headlines: Headline[];
}

export default function EntitiesList({
  entitiesByPageTypes,
  headlines,
}: EntitiesListProps) {
  const { setHeadlines } = useHeadlines();
  console.log({ entitiesByPageTypes, headlines });
  useEffect(() => {
    setHeadlines(headlines);
  }, [headlines, setHeadlines]);
  return (
    <>
      {headlines.length > 0 && <Title headline={headlines[0]} />}
      {Object.entries(entitiesByPageTypes).map(([key, entitiesByPageType]) => (
        <React.Fragment key={key}>
          <Title
            headline={{
              key,
              title: key,
              level: 2,
            }}
          />
          <ul>
            {entitiesByPageType.map((entity) => (
              <li key={entity.id}>
                <EntityPreview label={entity.label} entityId={entity.id}>
                  <Link href={`/entities/${entity.id}`}>{entity.label}</Link>
                </EntityPreview>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </>
  );
}

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
      return { label, id, pageType };
    }).
  sort(({label: label1}, {label: label2}) => label1 > label2 ? 1 : -1);

  const entitiesByPageTypes = entitiesInfo.reduce((acc, val) => {
    const value = val.pageType ? val : { ...val, pageType: null };
    const key = val.pageType ? val.pageType.deLabel : 'Keine Zuordnung';
    acc[key] = acc[key] ? [...acc[key], value] : [value];
    return acc;
  }, {})

  const headlines = Object.keys(entitiesByPageTypes).reduce(
    (acc, key) => {
      return [...acc, { key, title: key, level: 2 }];
    },
    [
      {
        key: 'Entity-Index',
        title: `${domain && dataSource ? domain.toUpperCase() + ' ' : ''}Index`,
        level: 1,
      },
    ]
  );

  return { entitiesByPageTypes, headlines };
};
