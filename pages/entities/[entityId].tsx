import entities from '@/data/parsed/entities.json';
import schemas from '@/data/parsed/schemas.json';
import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import { Namespace } from '@/types/namespace';
import { EntityEntry } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Typography } from 'antd';
import namespaceConfig from 'config/namespace';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect } from 'react';
import { NotFound } from '../404';

interface EntityDetailsProps {
  headlines?: Headline[];
  entityId: string;
  notFound: boolean;
  isUnderConstruction?: boolean;
}

export default function EntityDetailsPage({
  headlines,
  entityId,
  notFound,
  isUnderConstruction,
}: EntityDetailsProps) {
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    if (headlines) {
      setHeadlines(headlines);
    }
  }, []);

  return !notFound ? (
    <FetchEntity entityId={entityId} showSpinner={false}>
      {(entityEntry, loading) => (
        <FetchedEntity
          entityEntry={entityEntry}
          loading={loading}
          setHeadlines={setHeadlines}
        />
      )}
    </FetchEntity>
  ) : (
    <NotFound
      isUnderConstruction={isUnderConstruction}
      subtitle={
        <Typography.Text>
          Datensatz mit der ID:{' '}
          <Typography.Text code>{entityId}</Typography.Text> nicht verfügbar
        </Typography.Text>
      }
    />
  );
}

export const getStaticProps: GetStaticProps<
  EntityDetailsProps,
  { entityId: EntityId }
> = (context) => {
  const { entityId } = context.params;
  const entityEntry: EntityEntry =
    !Array.isArray(entityId) &&
    entityId in entities &&
    !isPropertyBlacklisted(entityId) &&
    entities[entityId];

  const isValidData = entityEntry && entityEntry.headlines;

  const isUnderConstruction =
    namespaceConfig.map[schemas[entityId]] === Namespace.UC;

  return {
    props: isValidData
      ? {
        entityId,
        headlines: entityEntry.headlines,
        notFound: false,
      }
      : {
        entityId,
        notFound: true,
        isUnderConstruction,
      },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.keys(entities)
      .filter((entityId) => !isPropertyBlacklisted(entityId as EntityId))
      .map((entityId) => ({
        params: { entityId },
      })),
    fallback: true,
  };
};
