import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { EntityContentEditor } from '@/features/editor/entity-content-editor';
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
import { useAppLocale } from '@/hooks/use-app-locale';
import useTranslation from 'next-translate/useTranslation';
import { DraftPreviewBanner } from '@/components/draft-preview-banner';
import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useAuth } from '@/hooks/use-auth';
import { useStageAuthRedirect } from '@/hooks/use-stage-auth-redirect';
import { EntityViewEditToolbar } from '@/components/entity-view-edit-toolbar';
import { editorFeatures } from '@/lib/sta-editor-features';
import { Spin } from 'antd';

interface EntityDetailsProps {
  headlines: Headline[];
  entity: Partial<Entity> & { id: EntityId };
}

export default function EntityDetailsPage({
  headlines,
  entity,
}: EntityDetailsProps) {
  const { lang } = useTranslation('common');
  const appLocale = useAppLocale();
  const { query } = useFetchingQueryParams();
  const { canEdit } = useAuth();
  const { authLoading, stageAccessReady } = useStageAuthRedirect();
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

  const showDraftBanner =
    editorFeatures.postgresReadEnabled && Boolean(query.stage);
  const inEditMode =
    editorFeatures.editorEnabled && query.edit && canEdit;

  if (showDraftBanner && (authLoading || !stageAccessReady)) {
    return (
      <div css={{ padding: '2em', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {showDraftBanner && query.stage && (
        <DraftPreviewBanner entityId={entity.id} stage={query.stage} />
      )}
      <EntityViewEditToolbar editMode={Boolean(inEditMode)} stage={query.stage} />
      {inEditMode ? (
        <EntityContentEditor entityId={entity.id} />
      ) : (
        <FetchEntity entityId={entity.id} showSpinner={false}>
          {(entityEntry, loading) => (
            <FetchedEntity
              entityEntry={entityEntry}
              loading={loading}
              setHeadlines={setHeadlines}
              locale={appLocale}
            />
          )}
        </FetchEntity>
      )}
    </>
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
          staNotationLabel,
          ...(entityEntry.entity.namespace != null
            ? { namespace: entityEntry.entity.namespace }
            : {}),
          ...(entityEntry.entity.elementOf != null
            ? { elementOf: entityEntry.entity.elementOf }
            : {}),
          ...(entityEntry.entity.label != null
            ? { label: entityEntry.entity.label }
            : {}),
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
