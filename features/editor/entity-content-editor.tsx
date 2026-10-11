import React, { useCallback, useEffect, useState } from 'react';
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
import { DocumentHtmlEditor } from './document-html-editor';

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
  const { canEdit, hasRole, loading: authLoading } = useAuth();
  const { message } = App.useApp();
  const pageLanguage = useAppLocale();
  const router = useRouter();
  const [content, setContent] = useState<StaEntryDto | null>(null);
  const [baseline, setBaseline] = useState<StaEntryDto | null>(null);
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
  const canImportFromWikibase = hasRole('REDAKTEUR');
  const sectionPropertyKeys = (content?.sections ?? [])
    .map((section) => section.propertyKey)
    .filter((key): key is string => Boolean(key));

  const loadContent = useCallback(async (language = DEFAULT_ENTRY_LANGUAGE) => {
    setLoading(true);
    setSaveError(undefined);
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
    } else {
      const snapshot = cloneStaEntry(result.data);
      setContent(snapshot);
      setBaseline(cloneStaEntry(result.data));
      setActiveLanguage(snapshot.language || language);
      setLoadError(undefined);
      setLoadNotFound(false);
    }
    setLoading(false);
  }, [entityId]);

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
    if (
      (language === 'de' || language === 'fr') &&
      language !== pageLanguage
    ) {
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
    message.success('Seite aus Wikibase in die Working Copy importiert');
  };

  const onCancel = () => {
    if (baseline) {
      setContent(cloneStaEntry(baseline));
    }
    setSaveError(undefined);
  };

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
    message.success('Working Copy gespeichert');
  };

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
          loadNotFound ? 'Seite nicht in der Working Copy' : loadError
        }
        description={
          loadNotFound ? (
            <Space direction="vertical" size="middle">
              <span>
                Entity <Typography.Text code>{entityId}</Typography.Text> ist noch
                nicht in PostgreSQL importiert. Der Editor liest nur die Working
                Copy — nicht Wikibase/Confluence.
              </span>
              {canImportFromWikibase ? (
                <Button
                  type="primary"
                  icon={<CloudDownloadOutlined />}
                  loading={importing}
                  onClick={() => void onImportFromWikibase()}
                >
                  Aus Wikibase importieren
                </Button>
              ) : (
                <span>
                  Zum Import aus Wikibase ist die Rolle Redakteur erforderlich,
                  oder nutzen Sie{' '}
                  <Typography.Text code>bin/import-wave.ps1</Typography.Text>.
                </span>
              )}
            </Space>
          ) : undefined
        }
        showIcon
      />
    );
  }

  if (!content) {
    return null;
  }

  const viewHref = content.staNotation
    ? `/${content.staNotation}`
    : undefined;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
          Entity: {entityId}
          {content.editionVersion != null && (
            <> · Fassungs-Version: {content.editionVersion}</>
          )}
          {viewHref && (
            <>
              {' · '}
              <Link href={viewHref}>Zur Ansicht</Link>
            </>
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
              setActiveLanguage(newLanguage);
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
        return (
          <div
            key={propertyKey}
            style={{
              borderTop: '1px solid #f0f0f0',
              paddingTop: 16,
              marginTop: 8,
            }}
          >
            <Typography.Text strong>
              {label ? `${label} (${propertyKey})` : propertyKey}
            </Typography.Text>
            {(section.values ?? []).map((value, valueIndex) => (
              <div key={`${propertyKey}-${valueIndex}`} style={{ marginTop: 8 }}>
                <Typography.Text type="secondary">
                  {value.kind}
                  {value.id ? ` · ${value.id}` : ''}
                </Typography.Text>
                {value.kind === 'document' && (
                  <div style={{ marginTop: 8 }}>
                    <DocumentHtmlEditor
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
                  </div>
                )}
                {value.kind === 'string' && (
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
                )}
                {value.kind === 'id' && (
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
                )}
                <UnresolvedList claims={value.unresolved} />
              </div>
            ))}
          </div>
        );
      })}

      <Space wrap>
        <Button type="primary" onClick={() => void onSave()} loading={saving}>
          Speichern
        </Button>
        <Button onClick={onCancel}>Abbrechen</Button>
        <Button onClick={() => void onValidate()} loading={validating}>
          Validieren
        </Button>
      </Space>
    </Space>
  );
};
