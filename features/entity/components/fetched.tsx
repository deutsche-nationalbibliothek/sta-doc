import { useEntity } from '@/hooks/entity-provider';
import { useInitialScroll } from '@/hooks/use-initial-scroll';
import { Headline } from '@/types/headline';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';
import Head from 'next/head';
import { Dispatch, SetStateAction, memo, useEffect } from 'react';
import { EntityDetails } from './details';
import { EntityPlaceholder } from './placeholder';
import { compact } from 'lodash';

interface FetchedEntityProps {
  entityEntry?: EntityEntryWithOptionalHeadlines;
  loading: boolean;
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;
}

export const FetchedEntity = memo(
  ({ entityEntry, loading, setHeadlines }: FetchedEntityProps) => {
    const { setEntity, unloadEntity } = useEntity();

    useInitialScroll(!loading);

    useEffect(() => {
      if (!loading) {
        if (entityEntry?.entity) {
          setEntity(entityEntry?.entity);
        }
        if (entityEntry?.headlines) {
          setHeadlines(entityEntry?.headlines);
        }
      }
      return unloadEntity;
    }, [
      entityEntry?.entity,
      entityEntry?.headlines,
      loading,
      setHeadlines,
      setEntity,
      unloadEntity,
    ]);

    const titleLabel = compact([
      entityEntry?.entity.namespace,
      entityEntry?.entity.label,
    ]).join(' | ');

    return (
      <>
        <Head>{!loading && entityEntry && <title>{titleLabel}</title>}</Head>
        {!loading && entityEntry ? (
          <EntityDetails entity={entityEntry.entity} />
        ) : (
          <EntityPlaceholder />
        )}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.entityEntry?.entity.id === nextProps.entityEntry?.entity.id &&
    prevProps.loading === nextProps.loading
);
