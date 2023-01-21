import entities from '@/data/parsed/entities.json';
import { EntityDetails } from '@/entity/components/details';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Headline } from '@/types/headline';
import {
  Entities,
  EntityEntry,
  EntityEntryWithOptionalHeadlines,
} from '@/types/parsed/entity';
import { isEqual } from 'lodash';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface EntityDetailsProps {
  headlines: Headline[];
  entityId: string;
}

export default function EntityDetailsPage({
  headlines,
  entityId,
}: EntityDetailsProps) {
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    setHeadlines(headlines);
  }, []);

  return (
    <>
      <FetchEntity entityId={entityId} showSpinner={false}>
        {(entityEntry, loading) => (
          <FetchedEntity
            entityEntry={entityEntry}
            loading={loading}
            setHeadlines={setHeadlines}
          />
        )}
      </FetchEntity>
    </>
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
            {entityEntry.entity.title ?? entityEntry.entity.headline.title}
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

export const getStaticProps: GetStaticProps = (context) => {
  const { entityId } = context.params;
  const entityEntry: EntityEntry =
    !Array.isArray(entityId) &&
    entityId in entities &&
    entities[entityId as keyof Entities];

  return (
    entityEntry &&
    entityEntry.headlines && {
      props: {
        entityId,
        headlines: entityEntry.headlines,
      },
    }
  );
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: Object.keys(entities).map((entityId) => ({
    params: { entityId },
  })),
  fallback: true,
});
