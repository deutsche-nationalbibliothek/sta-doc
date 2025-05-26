import entities from '@/data/parsed/entities.json';
import entitiesFr from '@/data/parsed/entities-fr.json';
import schemas from '@/data/parsed/schemas.json';
import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import { Namespace } from '@/types/namespace';
import { EntitiesEntries, Entity, EntityEntry } from '@/types/parsed/entity';
import { Schemas } from '@/types/parsed/schema';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Typography } from 'antd';
import namespaceConfig from 'config/namespace';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect } from 'react';
import { NotFound } from './404';
import { useNamespace } from '@/hooks/use-namespace';
import { useScroll } from '@/hooks/use-scroll';
import { useEntity } from '@/hooks/entity-provider';

interface EntityDetailsProps {
  headlines?: Headline[];
  notFound: boolean;
  entity?: Partial<Entity>;
  isUnderConstruction?: boolean;
}

export default function EntityDetailsPage({
  headlines,
  notFound,
  entity,
  isUnderConstruction,
}: EntityDetailsProps) {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace } = useNamespace();
  const { setEntity } = useEntity();
  const { onScroll } = useScroll();

  useEffect(() => {
    window.setTimeout(onScroll, 150);
  }, [onScroll]);

  useEffect(() => {
    if (entity?.namespace) {
      setNamespace(entity.namespace);
    }
  }, [setNamespace, entity?.namespace]);

  useEffect(() => {
    if (entity) {
      setEntity(entity);
    }
  }, [setEntity, entity]);

  useEffect(() => {
    if (headlines) {
      setHeadlines(headlines);
    }
  }, [setHeadlines, headlines]);

  return !notFound && entity?.id ? (
    <FetchEntity entityId={entity.id} showSpinner={false}>
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
          {entity?.staNotationLabel && (
            <Typography.Text>
              Datensatz mit der ID:{' '}
              <Typography.Text code>{entity.staNotationLabel}</Typography.Text>{' '}
              nicht verfügbar
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
    let localeEntities = context.locale === 'fr' ? entitiesFr : entities 
    entityEntry = Object.values(localeEntities as unknown as EntitiesEntries).find(
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
        headlines: entityEntry.headlines,
        notFound: false,
        entity: {
          id: validEntityId,
          namespace: entityEntry.entity.namespace,
          elementOf: entityEntry.entity.elementOf,
          label: entityEntry.entity.label,
          staNotationLabel,
        },
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

const dePaths = Object.keys(entities as unknown as EntitiesEntries)
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
    locale: 'de',
  }));

const frPaths = Object.keys(entitiesFr as unknown as EntitiesEntries)
  .filter(
    (entityId) =>
      !isPropertyBlacklisted(entityId as EntityId) &&
      'staNotationLabel' in
        (entitiesFr as unknown as EntitiesEntries)[entityId as EntityId]
          .entity
  )
  .map((entityId) => ({
    params: {
      staNotationLabel: (entitiesFr as unknown as EntitiesEntries)[
        entityId as EntityId
      ].entity.staNotationLabel,
    },
    locale: 'fr',
  }));

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [...dePaths, ...frPaths],
    fallback: true,
  };
};