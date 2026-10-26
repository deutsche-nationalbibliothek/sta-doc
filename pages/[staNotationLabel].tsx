import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { EntityContentEditor } from '@/features/editor/entity-content-editor';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import { Entity, EntityEntry } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import type { GetServerSideProps } from 'next';
import { fetchWorkingCatalogEntryByStaNotation } from '@/lib/bff/catalog-entity-index';
import { isPostgresReadEnabledServer } from '@/lib/sta-editor-features';
import { Namespace } from '@/types/namespace';
import { useEffect } from 'react';
import { useNamespace } from '@/hooks/use-namespace';
import { useScroll } from '@/hooks/use-scroll';
import { useEntity } from '@/hooks/entity-provider';
import { entityRepository } from '@/features/entity/entity-repository';
import { useAppLocale } from '@/hooks/use-app-locale';
import useTranslation from 'next-translate/useTranslation';
import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useAuth } from '@/hooks/use-auth';
import { useStageAuthRedirect } from '@/hooks/use-stage-auth-redirect';
import { EntityViewEditToolbar } from '@/components/entity-view-edit-toolbar';
import { EditorUnsavedChangesProvider } from '@/features/editor/editor-unsaved-changes-context';
import { editorFeatures } from '@/lib/sta-editor-features';
import { useEditModeRequested } from '@/lib/edit-mode-query';
import { Alert, Spin } from 'antd';
import { Link } from '@/lib/next-link';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { query } = useFetchingQueryParams();
  const { canEdit, loading: authLoading } = useAuth();
  const { stageAccessReady } = useStageAuthRedirect();
  const editRequested = useEditModeRequested();
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

  const stagedView =
    editorFeatures.postgresReadEnabled && Boolean(query.stage);
  const inEditMode = editRequested && !authLoading && canEdit;

  if (editRequested && authLoading) {
    return (
      <div css={{ padding: '2em', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (editRequested && !canEdit) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Anmeldung erforderlich"
        description={
          <Link pathname="/edit/login" query={{ next: router.asPath }}>
            Zum Editor anmelden
          </Link>
        }
      />
    );
  }

  if (stagedView && !editRequested && (authLoading || !stageAccessReady)) {
    return (
      <div css={{ padding: '2em', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <EditorUnsavedChangesProvider>
      <EntityViewEditToolbar
        editMode={inEditMode}
        stage={query.stage}
        entityId={entity.id}
        staNotationLabel={entity.staNotationLabel}
      />
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
    </EditorUnsavedChangesProvider>
  );
}


export const getServerSideProps: GetServerSideProps<
  EntityDetailsProps,
  { staNotationLabel: string }
> = async (context) => {
  let validEntityId: EntityId | undefined;
  let entityEntry: EntityEntry | undefined;
  let staNotationLabel: string | undefined;

  if (context.params && 'staNotationLabel' in context.params) {
    staNotationLabel = context.params.staNotationLabel;
    const locale: string = context.locale ? context.locale : 'de';
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

  if (staNotationLabel && isPostgresReadEnabledServer()) {
    const locale: string = context.locale ? context.locale : 'de';
    const catalogEntry = await fetchWorkingCatalogEntryByStaNotation(
      context.req.headers.cookie,
      staNotationLabel,
      locale
    );
    const catalogEntityId = catalogEntry?.entityId as EntityId | undefined;
    if (
      catalogEntry &&
      catalogEntityId &&
      !isPropertyBlacklisted(catalogEntityId)
    ) {
      return {
        props: {
          headlines: [],
          entity: {
            id: catalogEntityId,
            staNotationLabel: catalogEntry.staNotation ?? staNotationLabel,
            ...(catalogEntry.namespace != null
              ? { namespace: catalogEntry.namespace as Namespace }
              : {}),
            ...(catalogEntry.title != null
              ? { label: catalogEntry.title }
              : {}),
          },
        },
      };
    }
  }

  return { notFound: true };
};
