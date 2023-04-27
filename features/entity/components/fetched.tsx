import { useEntity } from '@/hooks/entity-provider';
import { useInitialScroll } from '@/hooks/use-initial-scroll';
import { useNamespace } from '@/hooks/use-namespace';
import { Headline } from '@/types/headline';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';
import Head from 'next/head';
import { Dispatch, SetStateAction, memo, useEffect } from 'react';
import { EntityDetails } from './details';
import { EntityPlaceholder } from './placeholder';

interface FetchedEntityProps {
  entityEntry?: EntityEntryWithOptionalHeadlines;
  loading: boolean;
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;
}

export const FetchedEntity = memo(
  ({ entityEntry, loading, setHeadlines }: FetchedEntityProps) => {
    const { setNamespace } = useNamespace();
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
        if (entityEntry?.entity.namespace) {
          setNamespace(entityEntry.entity.namespace);
        }
      }
      return unloadEntity;
    }, [
      entityEntry?.entity,
      entityEntry?.headlines,
      loading,
      setHeadlines,
      setEntity,
      setNamespace,
      unloadEntity,
    ]);

    return (
      <>
        <Head>
          {!loading && entityEntry && (
            <title>
              {entityEntry.entity.title ??
                (entityEntry.entity.headline &&
                  entityEntry.entity.headline.title)}
            </title>
          )}
        </Head>
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
