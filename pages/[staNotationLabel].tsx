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
import { NotFound } from './404';
import { useNamespace } from '@/hooks/use-namespace';

interface EntityDetailsProps {
  headlines?: Headline[];
  entityId: string;
  notFound: boolean;
  staNotationLabel: string;
  isUnderConstruction?: boolean;
  namespace?: Namespace;
}

export default function EntityDetailsPage({
  headlines,
  entityId,
  notFound,
  staNotationLabel,
  isUnderConstruction,
  namespace,
}: EntityDetailsProps) {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace } = useNamespace();

  useEffect(() => {
    if (namespace) {
      setNamespace(namespace);
    }
  }, [setNamespace, namespace]);

  useEffect(() => {
    if (headlines) {
      setHeadlines(headlines);
    }
  }, [setHeadlines, headlines]);

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
        <>
          {entityId && (
            <Typography.Text>
              Datensatz mit der ID:{' '}
              <Typography.Text code>{staNotationLabel}</Typography.Text> nicht
              verfügbar
            </Typography.Text>
          )}
        </>
      }
    />
  );
}

export const getStaticProps: GetStaticProps<
  EntityDetailsProps,
  { staNotationLabel: string }
> = (context) => {
  let validEntityId: EntityId | undefined;
  let entityEntry: EntityEntry | undefined;
  let isUnderConstruction: boolean | undefined;
  let staNotationLabel: string | undefined;

  if (context.params && 'staNotationLabel' in context.params) {
    staNotationLabel = context.params.staNotationLabel;

    entityEntry = Object.values(entities as unknown as EntitiesEntries).find(
      (entityEntry) => entityEntry.entity.staNotationLabel === staNotationLabel
    );

    validEntityId =
      entityEntry && !isPropertyBlacklisted(entityEntry.entity.id)
        ? entityEntry.entity.id
        : undefined;

    if (validEntityId) {
      const namespaceId = (schemas as unknown as Schemas)[validEntityId];
      const namespace: Namespace = namespaceConfig.map[namespaceId];
      isUnderConstruction = namespace === Namespace.UC;
    }
  }

  if (
    entityEntry &&
    staNotationLabel &&
    entityEntry.headlines &&
    validEntityId
  ) {
    return {
      props: {
        staNotationLabel,
        entityId: validEntityId,
        headlines: entityEntry.headlines,
        notFound: false,
        namespace: entityEntry.entity.namespace,
      },
    };
  } else {
    return {
      props: {
        entityId: validEntityId ?? '',
        staNotationLabel: staNotationLabel ?? '',
        notFound: true,
        isUnderConstruction: isUnderConstruction ?? false,
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Object.keys(entities as unknown as EntitiesEntries)
      .filter(
        (entityId) =>
          !isPropertyBlacklisted(entityId as EntityId) &&
          'staNotationLabel' in
            (entities as unknown as EntitiesEntries)[entityId as EntityId]
              .entity
      )
      .map((entityId) => ({
        params: {
          staNotationLabel: (entities as unknown as EntitiesEntries)[
            entityId as EntityId
          ].entity.staNotationLabel,
        },
      })),
    fallback: true,
  };
};
