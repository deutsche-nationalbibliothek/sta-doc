import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  App,
  Button,
  Input,
  List,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { CloudDownloadOutlined } from '@ant-design/icons';
import {
  EditorApiError,
  getProperty,
  getStaContent,
  importStaContentFromWikibase,
  updateStaContent,
  validateStaContent,
} from '@/lib/api/editor-client';
import {
  StaEntryDto,
  StaValue,
  UnresolvedClaimDto,
  cloneStaEntry,
  documentHtmlOf,
  languageCodes,
  replaceSectionValue,
  unresolvedClaims,
  updateLabelValue,
  withDocumentHtml,
  DEFAULT_ENTRY_LANGUAGE,
} from '@/lib/api/sta-entry-types';
import { useAuth } from '@/hooks/use-auth';
import { useAppLocale } from '@/hooks/use-app-locale';
import { type EntityLocale } from '@/utils/locale-utils';

function asEntityLocale(code: string): EntityLocale {
  return code === 'fr' ? 'fr' : 'de';
}
import { DocumentHtmlEditor } from './document-html-editor';
import { StringHtmlEditor } from './string-html-editor';
import { stringValueLooksLikeHtml } from '@/lib/html-field-utils';
import { DocumentActionsProvider } from './tiptap/document-actions-context';
import { DraftPreviewBanner } from '@/components/draft-preview-banner';
import {
  hasUnpublishedChanges,
  hasUnsavedChanges,
} from '@/lib/api/sta-entry-compare';
import { useEditorUnsavedChanges } from './editor-unsaved-changes-context';
import { STA_PAGE_TYPE_OPTIONS } from '@/lib/api/catalog-types';

/** Wikibase P2 — STA page type (Q3095 = Regeltext), not the page entity id. */
const STA_PAGE_TYPE_PROPERTY_KEY = 'P2';

interface EntityContentEditorProps {
  entityId: string;
}

function UnresolvedList({ claims }: { claims?: UnresolvedClaimDto[] }) {
  if (!claims?.length) {
    return null;
  }
  return (
    <Alert
      type="warning"
      showIcon
      style={{ marginTop: 8 }}
      message={`Import-Schuld: ${claims.length} Qualifier`}
      description={
        <List
          size="small"
          dataSource={claims}
          renderItem={(claim) => (
            <List.Item style={{ padding: '2px 0' }}>
              <Typography.Text code>
                {claim.label
                  ? `${claim.label} (${claim.propertyKey})`
                  : claim.propertyKey}
              </Typography.Text>
              {' = '}
              <Typography.Text>{claim.value ?? '—'}</Typography.Text>
            </List.Item>
          )}
        />
      }
    />
  );
}

function formatApiError(error: EditorApiError): string {
  if (error.conflict) {
    return 'Versionskonflikt: Die Seite wurde zwischenzeitlich geändert.';
  }
  if (error.details && error.details !== error.message) {
    return `${error.message}: ${error.details}`;
  }
  return error.details || error.message;
}

/**
 * Sprint 1: load working copy, edit title, labels and all direct statements, save.
 */
export const EntityContentEditor: React.FC<EntityContentEditorProps> = ({
  entityId,
}) => {
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const { canEdit, loading: authLoading } = useAuth();
  const { message, modal } = App.useApp();
  const pageLanguage = useAppLocale();
  const router = useRouter();
  const { setHasUnsavedChanges } = useEditorUnsavedChanges();
  const [content, setContent] = useState<StaEntryDto | null>(null);
  const [baseline, setBaseline] = useState<StaEntryDto | null>(null);
  /** `undefined` = live release not loaded yet; `null` = no published edition in release. */
  const [publishedLive, setPublishedLive] = useState<
    StaEntryDto | null | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [loadNotFound, setLoadNotFound] = useState(false);
  const [saveError, setSaveError] = useState<EditorApiError>();
  const [activeLanguage, setActiveLanguage] = useState(pageLanguage);
  const [newLanguage, setNewLanguage] = useState('');
  const [propertyLabels, setPropertyLabels] = useState<Record<string, string>>(
    {}
  );
  const sectionPropertyKeys = (content?.sections ?? [])
    .map((section) => section.propertyKey)
    .filter((key): key is string => Boolean(key));

  const loadPublishedLive = useCallback(
    async (language: string) => {
      const liveResult = await getStaContent(entityId, {
        language,
        stage: 'live',
      });
      if (liveResult.data) {
        setPublishedLive(cloneStaEntry(liveResult.data));
        return;
      }
      if (liveResult.error?.status === 404) {
        setPublishedLive(null);
        return;
      }
      setPublishedLive(undefined);
    },
    [entityId]
  );

  const loadContent = useCallback(async (language = DEFAULT_ENTRY_LANGUAGE) => {
    setLoading(true);
    setSaveError(undefined);
    setPublishedLive(undefined);
    const result = await getStaContent(entityId, { language });
    if (result.error || !result.data) {
      setLoadError(
        result.error
          ? formatApiError(result.error)
          : 'Entity konnte nicht geladen werden'
      );
      setLoadNotFound(result.error?.status === 404);
      setContent(null);
      setBaseline(null);
      setPublishedLive(undefined);
    } else {
      const snapshot = cloneStaEntry(result.data);
      setContent(snapshot);
      setBaseline(cloneStaEntry(result.data));
      setActiveLanguage(asEntityLocale(snapshot.language || language));
      setLoadError(undefined);
      setLoadNotFound(false);
      await loadPublishedLive(snapshot.language || language);
    }
    setLoading(false);
  }, [entityId, loadPublishedLive]);

  useEffect(() => {
    // Page locale selects the edition; the header control changes that locale.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadContent(pageLanguage);
  }, [loadContent, pageLanguage]);

  useEffect(() => {
    if (sectionPropertyKeys.length === 0) {
      setPropertyLabels({});
      return;
    }
    let cancelled = false;
    void Promise.all(
      sectionPropertyKeys.map(async (key) => {
        const result = await getProperty(key, { language: activeLanguage });
        return [key, result.data?.label || ''] as const;
      })
    ).then((entries) => {
      if (!cancelled) {
        setPropertyLabels(Object.fromEntries(entries.filter(([, label]) => label)));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [sectionPropertyKeys.join('|'), activeLanguage]);

  const onLanguageChange = (language: string) => {
    if (language !== 'de' && language !== 'fr') {
      return;
    }
    if (language !== pageLanguage) {
      void router.push(
        { pathname: router.pathname, query: router.query },
        undefined,
        { locale: language, scroll: false }
      );
      return;
    }
    setActiveLanguage(language);
    void loadContent(language);
  };

  const onImportFromWikibase = async () => {
    setImporting(true);
    setSaveError(undefined);
    const result = await importStaContentFromWikibase(entityId, {
      language: activeLanguage,
    });
    setImporting(false);
    if (result.error || !result.data) {
      message.error(
        result.error
          ? formatApiError(result.error)
          : 'Import aus Wikibase fehlgeschlagen'
      );
      return;
    }
    const snapshot = cloneStaEntry(result.data);
    setContent(snapshot);
    setBaseline(cloneStaEntry(result.data));
    setLoadError(undefined);
    setLoadNotFound(false);
    await loadPublishedLive(snapshot.language || activeLanguage);
    message.success('Seite importiert');
  };

  const revertToBaseline = useCallback(() => {
    if (baseline) {
      setContent(cloneStaEntry(baseline));
    }
    setSaveError(undefined);
  }, [baseline]);

  const onCancel = useCallback(() => {
    modal.confirm({
      title: isDe ? 'Ungespeicherte Änderungen' : 'Modifications non enregistrées',
      content: isDe
        ? 'Nicht gespeicherte Änderungen gehen verloren. Wirklich zurücksetzen?'
        : 'Les modifications non enregistrées seront perdues. Voulez-vous vraiment réinitialiser ?',
      okText: isDe ? 'Verwerfen' : 'Abandonner',
      okType: 'danger',
      cancelText: isDe ? 'Weiter bearbeiten' : 'Continuer la modification',
      onOk: revertToBaseline,
    });
  }, [isDe, modal, revertToBaseline]);

  const onValidate = async () => {
    if (!content) {
      return;
    }
    setValidating(true);
    setSaveError(undefined);
    const result = await validateStaContent(content);
    setValidating(false);
    if (result.error) {
      setSaveError(result.error);
      message.error(formatApiError(result.error));
      return;
    }
    const validation = result.data;
    if (validation?.errors?.length) {
      setSaveError({
        message: 'Validierung fehlgeschlagen',
        status: 400,
        validationResult: validation,
      });
      message.warning('Validierung: Fehler gefunden');
      return;
    }
    if (validation?.warnings?.length) {
      message.info(`Validierung OK (${validation.warnings.length} Warnung(en))`);
      return;
    }
    message.success('Validierung erfolgreich');
  };

  const onSave = async () => {
    if (!content) {
      return;
    }
    setSaving(true);
    setSaveError(undefined);
    const result = await updateStaContent(entityId, content);
    setSaving(false);
    if (result.error) {
      setSaveError(result.error);
      message.error(formatApiError(result.error));
      return;
    }
    if (result.data) {
      const snapshot = cloneStaEntry(result.data);
      setContent(snapshot);
      setBaseline(cloneStaEntry(result.data));
    }
    message.success('Entwurf gespeichert');
  };

  const showDraftPreviewBanner = useMemo(() => {
    if (!content || publishedLive === undefined) {
      return false;
    }
    return hasUnpublishedChanges(content, publishedLive, baseline);
  }, [content, publishedLive, baseline]);

  const unsaved = useMemo(
    () => (content ? hasUnsavedChanges(content, baseline) : false),
    [content, baseline]
  );

  useEffect(() => {
    setHasUnsavedChanges(unsaved);
    return () => setHasUnsavedChanges(false);
  }, [unsaved, setHasUnsavedChanges]);

  /** Bumps when server returns a new edition (PUT/import/load) — syncs TipTap to canonical HTML. */
  const htmlServerSyncKey = content
    ? `${content.entityVersion ?? 0}:${content.editionVersion ?? 0}`
    : '0';

  if (authLoading || loading) {
    return <Spin />;
  }

  if (!canEdit) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Keine Editor-Berechtigung"
        description={
          <Link
            href={`/edit/login?next=${encodeURIComponent(`/edit/${entityId}`)}`}
          >
            Anmelden
          </Link>
        }
      />
    );
  }

  if (loadError) {
    return (
      <Alert
        type={loadNotFound ? 'warning' : 'error'}
        message={
          loadNotFound
            ? `Seite ${entityId} liegt noch nicht im Editor-System.`
            : loadError
        }
        description={
          loadNotFound ? (
            <Button
              type="primary"
              icon={<CloudDownloadOutlined />}
              loading={importing}
              onClick={() => void onImportFromWikibase()}
            >
              Jetzt importieren
            </Button>
          ) : undefined
        }
        showIcon
      />
    );
  }

  if (!content) {
    return null;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {showDraftPreviewBanner && <DraftPreviewBanner />}
      <div>
        <Space align="center" wrap size="middle">
          <Typography.Title level={3} style={{ margin: 0 }}>
            Seite bearbeiten
          </Typography.Title>
          <Select
            aria-label="Sprache"
            value={activeLanguage}
            style={{ width: 88 }}
            options={languageCodes(content, activeLanguage).map((code) => ({
              value: code,
              label: code.toUpperCase(),
            }))}
            onChange={onLanguageChange}
          />
        </Space>
        <Typography.Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
          Entity-ID: {content?.entityId ?? entityId}
          {content?.staNotation ? <> · STA-Notation: {content.staNotation}</> : null}
          {content?.origin === 'editor_native'
            ? ' · Nur Editor (Q9000000+)'
            : content?.origin === 'imported_wikibase'
              ? ' · Wikibase-Import'
              : null}
          {content?.editionVersion != null && (
            <> · Fassungs-Version: {content.editionVersion}</>
          )}
        </Typography.Paragraph>
      </div>

      {saveError?.conflict && (
        <Alert
          type="error"
          showIcon
          message="Versionskonflikt"
          description={
            <Space direction="vertical">
              <span>
                Eine andere Sitzung hat die Working Copy zwischenzeitlich
                gespeichert. Bitte neu laden und Ihre Änderungen erneut
                eintragen.
              </span>
              <Button
                size="small"
                onClick={() => void loadContent(activeLanguage)}
              >
                Neu laden
              </Button>
            </Space>
          }
        />
      )}

      {saveError?.validationResult &&
        (saveError.validationResult.errors?.length ||
          saveError.validationResult.warnings?.length) && (
          <Alert
            type={saveError.validationResult.errors?.length ? 'error' : 'warning'}
            showIcon
            message={
              saveError.validationResult.errors?.length
                ? 'Validierungsfehler'
                : 'Validierungswarnungen'
            }
            description={
              <List
                size="small"
                dataSource={[
                  ...(saveError.validationResult.errors ?? []),
                  ...(saveError.validationResult.warnings ?? []),
                ]}
                renderItem={(item) => (
                  <List.Item style={{ padding: '4px 0' }}>
                    <Typography.Text code>{item.code}</Typography.Text>:{' '}
                    {item.message}
                  </List.Item>
                )}
              />
            }
          />
        )}

      <div>
        <Typography.Text strong>Titel</Typography.Text>
        <Input
          value={content.title || ''}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
          style={{ marginTop: 8 }}
        />
      </div>

      {(content.labels?.length ?? 0) > 0 && (
        <div>
          <Typography.Text strong>Labels</Typography.Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            {content.labels!.map((label, index) => (
              <div key={label.language}>
                <Typography.Text type="secondary">
                  {label.language}
                </Typography.Text>
                <Input
                  value={label.value}
                  onChange={(e) =>
                    setContent(updateLabelValue(content, index, e.target.value))
                  }
                />
              </div>
            ))}
          </Space>
        </div>
      )}

      <div>
        <Typography.Text type="secondary">Weitere Sprache</Typography.Text>
        <Space wrap style={{ display: 'flex', marginTop: 8 }}>
          <Input
            placeholder="z. B. en"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value.trim())}
            style={{ width: 120 }}
          />
          <Button
            disabled={!newLanguage}
            onClick={() => {
              setContent({
                ...content,
                language: newLanguage,
                editionVersion: 0,
                basedOnDefaultVersion:
                  content.editions?.find(
                    (edition) =>
                      edition.language ===
                      (content.defaultLanguage || DEFAULT_ENTRY_LANGUAGE)
                  )?.version,
                sections: [],
                labels: [],
              });
              setActiveLanguage(asEntityLocale(newLanguage));
              setNewLanguage('');
            }}
          >
            Sprache anlegen
          </Button>
        </Space>
        {activeLanguage !== (content.defaultLanguage || DEFAULT_ENTRY_LANGUAGE) &&
          (() => {
            const defaultVersion = content.editions?.find(
              (edition) =>
                edition.language ===
                (content.defaultLanguage || DEFAULT_ENTRY_LANGUAGE)
            )?.version;
            const outdated =
              defaultVersion !== undefined &&
              (content.basedOnDefaultVersion ?? 0) < defaultVersion;
            return outdated ? (
              <Alert
                style={{ marginTop: 8 }}
                type="warning"
                showIcon
                message={`Übersetzung basiert auf Deutsch ${
                  content.basedOnDefaultVersion ?? 'unbekannt'
                }; aktuell ist Deutsch ${defaultVersion}.`}
                action={
                  <Button
                    size="small"
                    onClick={() =>
                      setContent({
                        ...content,
                        basedOnDefaultVersion: defaultVersion,
                      })
                    }
                  >
                    Als aktuell bestätigen
                  </Button>
                }
              />
            ) : null;
          })()}
        {activeLanguage !== (content.defaultLanguage || DEFAULT_ENTRY_LANGUAGE) &&
          !documentHtmlOf(content, activeLanguage).trim() && (
            <Alert
              style={{ marginTop: 8 }}
              type="info"
              showIcon
              message="Diese Sprache hat noch keinen Text. Deutsch wird nur bei der Anzeige verwendet und hier nicht übernommen."
            />
          )}
      </div>

      {(() => {
        const debt = unresolvedClaims(content);
        if (debt.length === 0) {
          return null;
        }
        return (
          <Alert
            type="warning"
            showIcon
            message={`Import-Schuld gesamt: ${debt.length} Qualifier (Details an den Values)`}
          />
        );
      })()}

      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Sprachfassung {activeLanguage}
      </Typography.Paragraph>

      {(content.sections ?? []).map((section) => {
        const propertyKey = section.propertyKey || '?';
        const label = propertyLabels[propertyKey];
        const valueKinds = [
          ...new Set(
            (section.values ?? [])
              .map((value) => value.kind)
              .filter(Boolean)
          ),
        ];
        const valueIds = (section.values ?? [])
          .map((value) => value.id?.trim())
          .filter((id): id is string => Boolean(id));
        return (
          <div
            key={propertyKey}
            style={{
              borderTop: '1px solid #f0f0f0',
              paddingTop: 16,
              marginTop: 8,
            }}
          >
            <Space size={8} align="baseline" wrap>
              <Typography.Text strong>
                {label ? `${label} (${propertyKey})` : propertyKey}
              </Typography.Text>
              {valueKinds.map((kind) => (
                <Typography.Text key={kind} code>
                  {kind}
                </Typography.Text>
              ))}
              {valueIds.map((id) => (
                <Typography.Text
                  key={id}
                  type="secondary"
                  style={{ fontSize: 11, opacity: 0.75 }}
                >
                  {id}
                </Typography.Text>
              ))}
            </Space>
            {(section.values ?? []).map((value, valueIndex) => (
              <div key={`${propertyKey}-${valueIndex}`} style={{ marginTop: 8 }}>
                {value.kind === 'document' && (
                  <div style={{ marginTop: 8 }}>
                    <DocumentActionsProvider
                      value={{
                        mode: 'host',
                        onSave: () => void onSave(),
                        onCancel,
                        onValidate: () => void onValidate(),
                        saving,
                        validating,
                        cancelDisabled: !unsaved,
                        saveLabel: 'Speichern',
                        cancelLabel: 'Abbrechen',
                      }}
                    >
                      <DocumentHtmlEditor
                        serverSyncKey={htmlServerSyncKey}
                        html={value.html ?? ''}
                        onChange={(html) =>
                          setContent(
                            withDocumentHtml(
                              content,
                              activeLanguage,
                              html,
                              propertyKey
                            )
                          )
                        }
                      />
                    </DocumentActionsProvider>
                  </div>
                )}
                {value.kind === 'string' &&
                  (stringValueLooksLikeHtml(value.value) ? (
                    <div style={{ marginTop: 8 }}>
                      <StringHtmlEditor
                        serverSyncKey={htmlServerSyncKey}
                        html={value.value ?? ''}
                        onChange={(html) =>
                          setContent(
                            replaceSectionValue(
                              content,
                              activeLanguage,
                              propertyKey,
                              valueIndex,
                              {
                                ...value,
                                value: html,
                              } satisfies StaValue
                            )
                          )
                        }
                      />
                    </div>
                  ) : (
                    <Input.TextArea
                      style={{ marginTop: 8 }}
                      autoSize={{ minRows: 1, maxRows: 8 }}
                      value={value.value ?? ''}
                      onChange={(event) =>
                        setContent(
                          replaceSectionValue(
                            content,
                            activeLanguage,
                            propertyKey,
                            valueIndex,
                            {
                              ...value,
                              value: event.target.value,
                            } satisfies StaValue
                          )
                        )
                      }
                    />
                  ))}
                {value.kind === 'id' &&
                  (propertyKey === STA_PAGE_TYPE_PROPERTY_KEY ? (
                    <Select
                      style={{ marginTop: 8, width: '100%', maxWidth: 420 }}
                      value={value.entityId ?? undefined}
                      options={STA_PAGE_TYPE_OPTIONS.map((opt) => ({
                        value: opt.value,
                        label: isDe ? opt.labelDe : opt.labelFr,
                      }))}
                      onChange={(nextId) =>
                        setContent(
                          replaceSectionValue(
                            content,
                            activeLanguage,
                            propertyKey,
                            valueIndex,
                            {
                              ...value,
                              entityId: nextId,
                            } satisfies StaValue
                          )
                        )
                      }
                    />
                  ) : (
                    <Input
                      style={{ marginTop: 8 }}
                      value={value.entityId ?? ''}
                      placeholder="Q… oder P…"
                      onChange={(event) =>
                        setContent(
                          replaceSectionValue(
                            content,
                            activeLanguage,
                            propertyKey,
                            valueIndex,
                            {
                              ...value,
                              entityId: event.target.value.trim(),
                            } satisfies StaValue
                          )
                        )
                      }
                    />
                  ))}
                {value.kind === 'id' &&
                  propertyKey === STA_PAGE_TYPE_PROPERTY_KEY && (
                    <Typography.Text
                      type="secondary"
                      style={{ display: 'block', marginTop: 4, fontSize: 12 }}
                    >
                      {isDe
                        ? 'Seitenart (Typ-Katalog). Die gewählte Q-Nummer ist nicht die Entity-ID dieser Seite (siehe oben).'
                        : 'Type de page (catalogue). Ce Q n’est pas l’identifiant de cette page (voir ci-dessus).'}
                    </Typography.Text>
                  )}
                <UnresolvedList claims={value.unresolved} />
              </div>
            ))}
          </div>
        );
      })}

    </Space>
  );
};
