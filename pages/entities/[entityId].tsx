import { GetStaticProps, GetStaticPaths } from 'next';
import entites from '@/data/parsed/entities.json';
import type { Entities, Entity } from '@/types/entity';
import { entityHeadlines, Headline } from 'utils/entity-headlines';
import { useHeadlines } from '@/hooks/headlines';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { useEffect } from 'react';

interface EntityProps {
  headlines: Headline[];
  entityId: string;
}

export default function Entity(props: EntityProps) {
  const { setHeadlines } = useHeadlines();
  useEffect(() => {
    setHeadlines(props.headlines);
  }, []);
  return <EntityPlaceholder />;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { entityId } = context.params;
  return {
    props: {
      entityId,
      headlines: entityHeadlines(entites[entityId as keyof Entities]),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(entites).map((entityId) => ({
    params: { entityId },
  })),
  fallback: true,
});
