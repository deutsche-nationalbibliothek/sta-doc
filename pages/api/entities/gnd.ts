import type { NextApiRequest, NextApiResponse } from 'next';
import entities from '@/data/parsed/entities.json';
import { DataSource, EntityEntry } from '@/types/entity';
import { Item } from '@/types/item';
import { dataSources } from '@/utils/constants';

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const dataSource = DataSource.GND;
  const dataSourceItems: Item[] = dataSources[dataSource.toUpperCase()];

  const entitiesByDataSource = Object.values(
    entities as unknown as Record<string, EntityEntry>
  )
    .filter((entityValue) => {
      return (
        entityValue.entity.pageType &&
        dataSourceItems.includes(entityValue.entity.pageType.id)
      );
    })
    .map((entityValue) => {
      const { entity } = entityValue;
      const { label, id, pageType } = entity;
      return {
        label,
        id,
        pageTypeLabel: pageType.deLabel,
      };
    });
  res.status(200).json(entitiesByDataSource);
};
