import entites from '@/data/parsed/entities.json';
import { entityHeadlines, Headline } from 'utils/entity-headlines';
import { useHeadlines } from '@/hooks/headlines';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { useEffect } from 'react';
import { useSWR } from '@/lib/swr';
import { EntityDetails } from '@/entity/components/details';
import type { GetStaticProps, GetStaticPaths } from 'next';
import type { Entities, Entity } from '@/types/entity';

interface EntityProps {
  headlines: Headline[];
  entityId: string;
}

export default function EntityDetailsPage(props: EntityProps) {
  const { setHeadlines } = useHeadlines();
  useEffect(() => {
    setHeadlines(props.headlines);
  }, []);

  const { data, error, loading } = useSWR<Entity>(
    `/api/entities/${props.entityId}`
  );

  if (error) {
    console.error(error);
    return null;
  }

  return loading ? <EntityPlaceholder /> : <EntityDetails entity={data} />;
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
