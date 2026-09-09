import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import { Entity, EntityEntry } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect } from 'react';
import { useNamespace } from '@/hooks/use-namespace';
import { useScroll } from '@/hooks/use-scroll';
import { useEntity } from '@/hooks/entity-provider';
import { entityRepository } from '@/features/entity/entity-repository';
import useTranslation from 'next-translate/useTranslation';

interface EntityDetailsProps {
  headlines: Headline[];
  entity: Partial<Entity> & { id: EntityId };
}

export default function EntityDetailsPage({
  headlines,
  entity,
}: EntityDetailsProps) {
  const { lang } = useTranslation('common');
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
  }, [setEntity, entity, lang]);

  useEffect(() => {
    if (headlines) {
      setHeadlines(headlines);
    }
  }, [setHeadlines, headlines, lang]);

  return (
    <FetchEntity entityId={entity.id} showSpinner={false} >
      {(entityEntry, loading) => (
        <FetchedEntity
          entityEntry={entityEntry}
          loading={loading}
          setHeadlines={setHeadlines}
          locale={lang}
        />
      )}
    </FetchEntity>
  );
}


export const getStaticProps: GetStaticProps<EntityDetailsProps,{staNotationLabel: string }> =
  (context) => {
  let validEntityId: EntityId | undefined;
  let entityEntry: EntityEntry | undefined;
  let staNotationLabel: string | undefined;

  if (context.params && 'staNotationLabel' in context.params) {
    staNotationLabel = context.params.staNotationLabel;
    const locale : string = context.locale ? context.locale : "de";
    entityEntry = entityRepository.getByStaNotation(locale, staNotationLabel);
    validEntityId =
      entityEntry && !isPropertyBlacklisted(entityEntry.entity.id)
        ? entityEntry.entity.id
        : undefined;
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
        entity: {
          id: validEntityId,
          namespace: entityEntry.entity.namespace || undefined,
          elementOf: entityEntry.entity.elementOf || undefined,
          label: entityEntry.entity.label || undefined,
          staNotationLabel,
        },
      },
    };
  }
 else {
  return { notFound: true };
 }
};

export const getStaticPaths: GetStaticPaths = () => {
  const dePaths = entityRepository.getAllStaNotations("de").map(staNotationLabel => ({
    params: { staNotationLabel: staNotationLabel},
    locale: 'de' }));
  const frPaths = entityRepository.getAllStaNotations("fr").map(staNotationLabel => ({
    params: { staNotationLabel: staNotationLabel },
    locale: 'fr' }));
  return {
    paths: [...dePaths, ...frPaths],
    fallback: 'blocking',
  };
};