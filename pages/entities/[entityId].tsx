import entities from '@/data/parsed/entities.json';
import schemas from '@/data/parsed/schemas.json';
import { Typography } from 'antd';
import { EntityDetails } from '@/entity/components/details';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import {
  EntityEntry,
  EntityEntryWithOptionalHeadlines,
} from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import { isEqual } from 'lodash';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { NotFound } from '../404';
import namespaceConfig from 'config/namespace';
import { Namespace } from '@/types/namespace';

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

interface FetchedEntityProps {
  entityEntry: EntityEntryWithOptionalHeadlines;
  loading: boolean;
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;
}

const FetchedEntity = ({
  entityEntry,
  loading,
  setHeadlines,
}: FetchedEntityProps) => {
  useEffect(() => {
    if (!loading && entityEntry?.headlines) {
      setHeadlines((currentHeadlines) => {
        if (!isEqual(entityEntry.headlines, currentHeadlines)) {
          return entityEntry.headlines;
        } else {
          return currentHeadlines;
        }
      });
    }
  }, [entityEntry?.headlines, loading]);

  return (
    <>
      <Head>
        {!loading && (
          <title>
            {entityEntry.entity.title ??
              (entityEntry.entity.headline &&
                entityEntry.entity.headline.title)}
          </title>
        )}
      </Head>
      {loading ? (
        <EntityPlaceholder />
      ) : (
        <EntityDetails entity={entityEntry.entity} />
      )}
    </>
  );
};

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
