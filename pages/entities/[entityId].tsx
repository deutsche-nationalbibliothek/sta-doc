import entities from '@/data/parsed/entities.json';
import schemas from '@/data/parsed/schemas.json';
import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import { Namespace } from '@/types/namespace';
import { EntitiesEntries, EntityEntry } from '@/types/parsed/entity';
import { Schemas } from '@/types/parsed/schema';
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
    // todo, check dep
  }, [setHeadlines]);

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
  let entityId: EntityId | undefined;
  let entityEntry: EntityEntry | undefined;
  let isUnderConstruction: boolean | undefined;

  if (context.params && 'entityId' in context.params) {
    const { entityId: id } = context.params;
    entityId =
      !Array.isArray(id) && id in entities && !isPropertyBlacklisted(id)
        ? id
        : undefined;

    if (entityId) {
      entityEntry = (entities as EntitiesEntries)[entityId];

      const namespaceId = (schemas as Schemas)[entityId];
      const namespace: Namespace = namespaceConfig.map[namespaceId];
      isUnderConstruction = namespace === Namespace.UC;
    }
  }

  if (entityEntry && entityEntry.headlines && entityId) {
    return {
      props: {
        entityId,
        headlines: entityEntry.headlines,
        notFound: false,
      },
    };
  } else {
    return {
      props: {
        entityId: '', //quickfix
        notFound: true,
        isUnderConstruction,
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.keys(entities as EntitiesEntries)
      .filter((entityId) => !isPropertyBlacklisted(entityId as EntityId))
      .map((entityId) => ({
        params: { entityId },
      })),
    fallback: true,
  };
};
