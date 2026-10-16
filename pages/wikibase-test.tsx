import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { Input, Segmented, Button, AutoComplete } from 'antd';
import { useQueryParam } from 'use-query-params';

import { parseWikibaseResponse } from '@/bin/data/parse/entities/entity/parse-wikibase-response';
import { fuzzyLabelMatchScore } from '@/utils/fuzzy-label-match';
import { formatEntityId } from '@/utils/format-entity-id';
import { StatementTable } from '@/features/entity/components/statements/statement-table';
import {
  WikibaseEditorProvider,
  useWikibaseEditorContext,
} from '@/features/entity/context/wikibase-editor-context';
import useEntitySearch from '@/hooks/use-entity-search';

import type { WikibaseResponse } from '@/types/raw/wikibase';
import type { IdLookup } from '@/types/parsed/wikibase';

//The provider must sit above the component that calls `useWikibaseEditorContext`, hence the wrapper.

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

  // Kept for a possible multi-select search (see commented Select in the JSX).
  // const [pickedEntityIds, setPickedEntityIds] = useState<string[]>([]);

  const [entityIdParam, setEntityIdParam] = useQueryParam('entity');
  const [mode, setMode] = useQueryParam('live');

  // The lookup does not depend on the entity, so it is loaded once on mount and not again in `fetchEntity`.
  useEffect(() => {
    fetch('/doc/api/entities/id-lookup')
      .then((res) => res.json())
      .then((lookup: IdLookup) => setIdLookup(lookup))
      .catch((error) => console.error('Failed to load id lookup:', error));
  }, []);

  const { idSearchOptions, searchEntityIds } = useEntitySearch(idLookup);

  // const idSelectOptions = useMemo(() => {
  //   const byValue = new Map<string, { value: string; label: string }>();
  //   for (const id of pickedEntityIds) {
  //     byValue.set(id, {
  //       value: id,
  //       label: formatEntityId(id, idLookup),
  //     });
  //   }
  //   for (const option of idSearchOptions) {
  //     if (!byValue.has(option.value)) {
  //       byValue.set(option.value, option);
  //     }
  //   }
  //   return [...byValue.values()];
  // }, [pickedEntityIds, idSearchOptions, idLookup]);

  // Loads an entity (given `id` or the current input) and fills the editor.
  // Pending edits of the previous entity are discarded first. A 404 sets `entityNotFound`; other errors show a message.
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
      // const [wikibaseRes, parsedRes, lookupRes] = await Promise.all([
      //   fetch(`/doc/api/entities/wikibase?id=${entityIdToLoad}`),
      //   fetch(`/doc/api/entities/${entityIdToLoad}`),
      //   fetch(`/doc/api/entities/id-lookup`),
      // ]);

      const wikibaseRes = await fetch(
        `/doc/api/entities/wikibase?id=${entityIdToLoad}`
      );

      // if (wikibaseRes.status === 404 || parsedRes.status === 404)
      if (wikibaseRes.status === 404) {
        setEntityNotFound(true);
        return;
      }

      // if (!wikibaseRes.ok || !parsedRes.ok || !lookupRes.ok)
      if (!wikibaseRes.ok) {
        throw new Error('Eine der API-Anfragen ist fehlgeschlagen.');
      }

      const data: WikibaseResponse = await wikibaseRes.json();
      // const resParsed = await parsedRes.json();
      // const lookup: IdLookup = await lookupRes.json();

      setResponse(data);
      // setIdLookup(lookup);

      setDataSource(parseWikibaseResponse(data, entityIdToLoad));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Loads the entity from `?entity=...` on page load and when the param changes.
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
          options={idSearchOptions}
          onChange={(value) => setEntityId(value)}
          onSearch={searchEntityIds}
          onSelect={(value) => {
            fetchEntity(value);
            setEntityId(value);
          }}
          filterOption={false}
          style={{ flex: '1 1 280px', maxWidth: '400px' }}
          disabled={loading}
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
