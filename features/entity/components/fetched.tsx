import { useEntity } from '@/hooks/entity-provider';
import { useInitialScroll } from '@/hooks/use-initial-scroll';
import { useNamespace } from '@/hooks/use-namespace';
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
  locale: string;
}

export const FetchedEntity = memo(
  ({ entityEntry, loading, setHeadlines, locale }: FetchedEntityProps) => {
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

    const titleLabel = compact([
      entityEntry?.entity.namespace,
      entityEntry?.entity.label,
    ]).join(' | ');
    return (
      <>
        <Head>{!loading && entityEntry && <title>{titleLabel}</title>}</Head>
        {!loading && entityEntry ? (
          <EntityDetails entity={entityEntry.entity} locale={locale} />
        ) : (
          <EntityPlaceholder />
        )}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.entityEntry?.entity.id === nextProps.entityEntry?.entity.id &&
    prevProps.loading === nextProps.loading &&
    prevProps.locale === nextProps.locale
);
