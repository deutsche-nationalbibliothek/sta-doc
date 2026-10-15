import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

import { Input, Segmented, Button, Tooltip, AutoComplete } from 'antd';

import type { WikibaseResponse } from '@/types/raw/wikibase';

import { parseWikibaseResponse } from '@/bin/data/parse/entities/entity/parse-wikibase-response';
import { fuzzyLabelMatchScore } from '@/utils/fuzzy-label-match';
import { useQueryParam } from 'use-query-params';
import { StatementTable } from '@/features/entity/components/statements/statement-table';

import {
  WikibaseEditorProvider,
  useWikibaseEditorContext,
} from '@/features/entity/context/wikibase-editor-context';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'; // brauche ich das hier noch?

import type {
  ParsedStatementGroup,
  StatementChange,
  QualifierChange,
} from '@/types/parsed/wikibase'; // brauche ich das hier noch?

import { ExportOutlined } from '@ant-design/icons'; // und das hier?

type IdLookup = Record<string, string>;

const formatEntityId = (id: string, idLookup: IdLookup | null) => {
  if (!idLookup) {
    return id;
  }
  const label = idLookup[id];
  return label ? `${label} (${id})` : id;
};

const wikibaseStatementUrl = (statementKey: string) => {
  const entityId = statementKey.split('$')[0];
  const namespace = entityId.startsWith('P') ? 'Property' : 'Item';
  const base = (
    process.env.NEXT_PUBLIC_URL || 'https://edit.sta.dnb.de'
  ).replace(/\/$/, '');

  return `${base}/wiki/${namespace}:${entityId}#${statementKey}`;
};

const WikibaseStatementLink = ({ statementKey }: { statementKey: string }) => (
  <Tooltip title="In Wikibase öffnen">
    <a
      href={wikibaseStatementUrl(statementKey)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="In Wikibase öffnen"
      className="wikibase-statement-link"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ExportOutlined />
    </a>
  </Tooltip>
);

export default function WikibaseTestPage() {
  return (
    <WikibaseEditorProvider>
      <WikibaseTest />
    </WikibaseEditorProvider>
  );
}

const WikibaseTest = () => {
  const {
    dataSource,
    setDataSource,
    idLookup,
    setIdLookup,
    resetChanges,
    changedStatements,
    changedQualifiers,
    deletedStatementIds,
    deletedQualifierIds,
  } = useWikibaseEditorContext();

  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [entityNotFound, setEntityNotFound] = useState(false);

  const [pickedEntityIds, setPickedEntityIds] = useState<string[]>([]); // brauchen wir das noch?
  const [idSearchOptions, setIdSearchOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [entityIdParam, setEntityIdParam] = useQueryParam('entity');
  const [mode, setMode] = useQueryParam('live');

  useEffect(() => {
    fetch('/doc/api/entities/id-lookup')
      .then((res) => res.json())
      .then((lookup: IdLookup) => setIdLookup(lookup))
      .catch((error) => console.error('Failed to load id lookup:', error));
  }, []);

  const searchEntityIds = useMemo(
    () =>
      debounce((searchText: string) => {
        if (!idLookup) {
          setIdSearchOptions([]);
          return;
        }

        const query = searchText.trim().toLowerCase();
        if (!query) {
          setIdSearchOptions([]);
          return;
        }

        const scored: { value: string; label: string; score: number }[] = [];
        for (const [id, label] of Object.entries(idLookup)) {
          const idLower = id.toLowerCase();
          let score = 0;
          if (idLower === query) {
            score = 3000;
          } else if (idLower.startsWith(query)) {
            score = 2500;
          } else if (idLower.includes(query)) {
            score = 2200;
          } else {
            score = fuzzyLabelMatchScore(query, label);
          }

          if (score > 0) {
            scored.push({
              value: id,
              label: formatEntityId(id, idLookup),
              score,
            });
          }
        }

        scored.sort((a, b) => b.score - a.score);
        setIdSearchOptions(
          scored.slice(0, 50).map(({ value, label }) => ({ value, label }))
        );
      }, 250),
    [idLookup]
  );

  useEffect(() => {
    return () => searchEntityIds.cancel();
  }, [searchEntityIds]);

  const idSelectOptions = useMemo(() => {
    const byValue = new Map<string, { value: string; label: string }>();
    for (const id of pickedEntityIds) {
      byValue.set(id, {
        value: id,
        label: formatEntityId(id, idLookup),
      });
    }
    for (const option of idSearchOptions) {
      if (!byValue.has(option.value)) {
        byValue.set(option.value, option);
      }
    }
    return [...byValue.values()];
  }, [pickedEntityIds, idSearchOptions, idLookup]);

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
  //       distance: 3,
  //     },
  //   })
  // );

  const fetchEntity = async (id?: string) => {
    const entityIdToLoad = (id ?? entityId).trim();

    if (!entityIdToLoad) {
      return;
    }

    setEntityId(entityIdToLoad);
    setEntityIdParam(entityIdToLoad);
    setLoading(true);
    setEntityNotFound(false);
    setResponse(null);
    setDataSource([]);
    resetChanges();

    try {
      const [wikibaseRes, parsedRes, lookupRes] = await Promise.all([
        fetch(`/doc/api/entities/wikibase?id=${entityIdToLoad}`),
        fetch(`/doc/api/entities/${entityIdToLoad}`),
        fetch(`/doc/api/entities/id-lookup`),
      ]);

      if (wikibaseRes.status === 404 || parsedRes.status === 404) {
        setEntityNotFound(true);
        return;
      }

      if (!wikibaseRes.ok || !parsedRes.ok || !lookupRes.ok) {
        throw new Error('Eine der API-Anfragen ist fehlgeschlagen.');
      }

      const data: WikibaseResponse = await wikibaseRes.json();
      const resParsed = await parsedRes.json();
      const lookup: IdLookup = await lookupRes.json();

      console.log('resParsed:', resParsed);
      console.log('data:', data);
      setResponse(data);
      setIdLookup(lookup);

      setDataSource(parseWikibaseResponse(data, entityIdToLoad));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof entityIdParam === 'string' && entityIdParam) {
      fetchEntity(entityIdParam);
    }
  }, [entityIdParam]);

  const options = [
    { value: 'prod', label: 'Prod' },
    { value: 'live', label: 'Live' },
  ];

  return (
    <main>
      <h1 style={{ marginTop: '3rem' }}>Wikibase-Testseite</h1>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          maxWidth: '960px',
        }}
      >
        <Segmented
          options={options}
          value={mode}
          onChange={(value) => setMode(value)}
        />

        <AutoComplete
          value={entityId}
          options={idSelectOptions}
          onChange={(value) => setEntityId(value)}
          onSearch={searchEntityIds}
          onSelect={(value) => {
            fetchEntity(value);
            setEntityId(value);
          }}
          filterOption={false}
          style={{ flex: '1 1 280px', maxWidth: '400px' }}
          disabled={loading}
          // allowClear
        >
          <Input.Search
            className="entity-search"
            type="text"
            onSearch={fetchEntity}
            placeholder="Entity-ID oder Label suchen ..."
            enterButton={loading ? 'Lädt ...' : 'Entity laden'}
            disabled={loading}
          />
        </AutoComplete>

        {changedStatements.length > 0 ||
        changedQualifiers.length > 0 ||
        deletedStatementIds.length > 0 ||
        deletedQualifierIds.length > 0 ? (
          <Button>Alle Änderungen übernehmen</Button> // hier fehlt noch die Funktion, die alle Daten ins BE übernimmt
        ) : null}

        {/* <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={false}
          value={pickedEntityIds}
          placeholder="P- oder Q-IDs bzw. Labels suchen …"
          notFoundContent={idLookup ? 'Keine Treffer' : 'Lookup wird geladen …'}
          options={idSelectOptions}
          onSearch={searchEntityIds}
          onChange={(values) => setPickedEntityIds(values)}
          optionLabelProp="label"
          style={{ flex: '2 1 360px', minWidth: '280px' }}
          disabled={!idLookup}
        /> */}
      </div>

      <h2 style={{ marginTop: '3rem' }}>Tabellarische Response-Werte</h2>

      <div>
        {entityNotFound ? (
          <p>
            Entity {entityId} wurde nicht gefunden. Versuche es erneut mit einer
            anderen ID.
          </p>
        ) : response ? (
          dataSource.map((group, groupIndex) => (
            <div key={group.propertyId} style={{ marginBottom: '3rem' }}>
              <h3>{formatEntityId(group.propertyId, idLookup)}</h3>
              <StatementTable group={group} groupIndex={groupIndex} />
            </div>
          ))
        ) : (
          'Noch keine Daten geladen.'
        )}
        {}
      </div>

      <h2 style={{ marginTop: '3rem' }}>Vollständige Response als JSON</h2>

      <div style={{ marginTop: '1rem' }}>
        {entityNotFound ? (
          <p>
            Da die Entity nicht geladen werden konnte, kann keine Response
            angezeigt werden.
          </p>
        ) : response ? (
          <pre>{JSON.stringify(response, null, 2)}</pre>
        ) : (
          <p>Noch keine Daten geladen.</p>
        )}
      </div>
    </main>
  );
};
