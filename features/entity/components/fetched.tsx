import { useEntity } from '@/hooks/entity-provider';
import { useInitialScroll } from '@/hooks/use-initial-scroll';
import { useNamespace } from '@/hooks/use-namespace';
import { Headline } from '@/types/headline';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';
import Head from 'next/head';
import { Dispatch, SetStateAction, memo, useEffect, useRef } from 'react';
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
    const entity = entityEntry?.entity;

    useInitialScroll(!loading);

    useEffect(() => {
      if (!loading) {
        if (entity) {
          setEntity(entity);
        }
        if (entityEntry?.headlines) {
          setHeadlines(entityEntry.headlines);
        }
        if (entity?.namespace) {
          setNamespace(entity.namespace);
        }
      }
    }, [
      entity,
      entityEntry?.headlines,
      loading,
      setHeadlines,
      setEntity,
      setNamespace,
    ]);

    const unloadEntityRef = useRef(unloadEntity);
    unloadEntityRef.current = unloadEntity;

    // unload only when leaving the page, not on every data change, otherwise
    // the headlines the page provided get wiped in between
    useEffect(() => () => unloadEntityRef.current(), []);

    const titleLabel = compact([entity?.namespace, entity?.label]).join(' | ');
    return (
      <>
        <Head>{!loading && entity && <title>{titleLabel}</title>}</Head>
        {!loading && entity ? (
          <EntityDetails entity={entity} locale={locale} />
        ) : (
          <EntityPlaceholder />
        )}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.entityEntry?.entity?.id === nextProps.entityEntry?.entity?.id &&
    prevProps.loading === nextProps.loading &&
    prevProps.locale === nextProps.locale
);
