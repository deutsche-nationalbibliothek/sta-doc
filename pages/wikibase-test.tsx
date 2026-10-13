import { ChangeEvent, useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Input, Segmented, Button, Tooltip, AutoComplete } from 'antd';

import type { WikibaseResponse } from '@/types/raw/wikibase';
import type {
  ParsedStatement,
  ParsedStatementGroup,
  Qualifier,
  StatementChange,
  QualifierChange,
} from '@/types/parsed/wikibase';

import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

import { parseWikibaseResponse } from '@/bin/data/parse/entities/entity/parse-wikibase-response';
import { fuzzyLabelMatchScore } from '@/utils/fuzzy-label-match';
import { useQueryParam } from 'use-query-params';
import { StatementTable } from '@/features/entity/components/statements/statement-table';

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

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [entityNotFound, setEntityNotFound] = useState(false);
  const [dataSource, setDataSource] = useState<ParsedStatementGroup[]>([]);

  const [editingValueWithStatementId, setEditingValueWithStatementId] =
    useState<string | null>(null);
  const [currentEditingStatementValue, setCurrentEditingStatementValue] =
    useState('');
  const [originalEditingStatementValue, setOriginalEditingStatementValue] =
    useState('');
  const [deletedStatementIds, setDeletedStatementIds] = useState<string[]>([]);
  const [changedStatements, setChangedStatements] = useState<StatementChange[]>(
    []
  );

  const [editingValueWithQualifierId, setEditingValueWithQualifierId] =
    useState<string | null>(null);
  const [currentEditingQualifierValue, setCurrentEditingQualifierValue] =
    useState('');
  const [originalEditingQualifierValue, setOriginalEditingQualifierValue] =
    useState('');
  const [deletedQualifierIds, setDeletedQualifierIds] = useState<string[]>([]);
  const [changedQualifiers, setChangedQualifiers] = useState<QualifierChange[]>(
    []
  );

  const [idLookup, setIdLookup] = useState<IdLookup | null>(null);
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

  const onQualifierDragEnd = (
    statementId: string,
    { active, over }: DragEndEvent
  ) => {
    if (!over || active.id === over.id) return;

    setDataSource((prev) =>
      prev.map((group) => ({
        ...group,
        statements: group.statements.map((item) => {
          if (item.key !== statementId) {
            return item;
          }

          const activeIndex = item.qualifiers.findIndex(
            (qualifier) => qualifier.id === active.id
          );

          const overIndex = item.qualifiers.findIndex(
            (qualifier) => qualifier.id === over.id
          );

          if (activeIndex === -1 || overIndex === -1) {
            return item;
          }

          return {
            ...item,
            qualifiers: arrayMove(item.qualifiers, activeIndex, overIndex),
          };
        }),
      }))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 3,
      },
    })
  );

  // const columns = [{ title: 'Property', dataIndex: "propertyId", key: "propertyId" }];

  const onDragEnd = (groupIndex: number, { active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) =>
        prev.map((group, index) => {
          if (index !== groupIndex) {
            return group;
          }

          const activeIndex = group.statements.findIndex(
            (statement) => statement.key === active.id
          );

          const overIndex = group.statements.findIndex(
            (statement) => statement.key === over?.id
          );

          if (activeIndex === -1 || overIndex === -1) {
            return group;
          }

          return {
            ...group,
            statements: arrayMove(group.statements, activeIndex, overIndex),
          };
        })
      );
    }
  };

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

  const handleEditingStatementValueChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentEditingStatementValue(e.target.value);
  };

  const handleEditingQualifierValueChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentEditingQualifierValue(e.target.value);
  };

  const saveEditingStatementValue = () => {
    const newDataSource = dataSource.map((group) => ({
      ...group,
      statements: group.statements.map((statement) => {
        if (statement.statementId === editingValueWithStatementId) {
          return { ...statement, value: currentEditingStatementValue };
        }
        return statement;
      }),
    }));

    setDataSource(newDataSource);
    setEditingValueWithStatementId(null);
  };

  const saveEditingQualifierValue = () => {
    const updatedDataSource = dataSource.map((group) => ({
      ...group,
      statements: group.statements.map((statement) => ({
        ...statement,
        qualifiers: statement.qualifiers.map((qualifier) => {
          if (qualifier.id === editingValueWithQualifierId) {
            return { ...qualifier, value: currentEditingQualifierValue };
          }
          return qualifier;
        }),
      })),
    }));

    setDataSource(updatedDataSource);
    setEditingValueWithQualifierId(null);
  };

  const markStatementAsChanged = () => {
    if (!editingValueWithStatementId) return;

    setChangedStatements((previous) => {
      // previous = das komplette changedStatements Array
      // existingChange ist ein Eintrag in dem Array
      const existingChange = previous.find(
        (change) => change.statementId === editingValueWithStatementId
      );

      const originalValue =
        existingChange?.originalValue ?? originalEditingStatementValue;

      if (currentEditingStatementValue === originalValue) {
        return previous.filter(
          (change) => change.statementId !== editingValueWithStatementId
        );
      }

      if (existingChange) {
        return previous.map((change) => {
          if (change.statementId === editingValueWithStatementId) {
            return {
              statementId: editingValueWithStatementId,
              originalValue: change.originalValue,
              newValue: currentEditingStatementValue,
            };
          }

          return change;
        });
      }

      return [
        ...previous,
        {
          statementId: editingValueWithStatementId,
          originalValue: originalEditingStatementValue,
          newValue: currentEditingStatementValue,
        },
      ];
    });
  };

  const markQualifierAsChanged = () => {
    if (!editingValueWithQualifierId) return;

    setChangedQualifiers((prev) => {
      // previous = das komplette changedStatements Array
      // existingChange ist ein Eintrag in dem Array
      const existingQualifierChange = prev.find(
        (change) => change.qualifierId === editingValueWithQualifierId
      );

      const originalQualifierValue =
        existingQualifierChange?.originalValue ?? originalEditingQualifierValue;

      if (currentEditingQualifierValue === originalQualifierValue) {
        return prev.filter(
          (change) => change.qualifierId !== editingValueWithQualifierId
        );
      }

      if (existingQualifierChange) {
        return prev.map((change) => {
          if (change.qualifierId === editingValueWithQualifierId) {
            return {
              qualifierId: editingValueWithQualifierId,
              originalValue: change.originalValue,
              newValue: currentEditingQualifierValue,
            };
          }

          return change;
        });
      }

      return [
        ...prev,
        {
          qualifierId: editingValueWithQualifierId,
          originalValue: originalEditingQualifierValue,
          newValue: currentEditingQualifierValue,
        },
      ];
    });
  };

  useEffect(() => {
    console.log('changedStatements:', changedStatements);
  }, [changedStatements]);

  const isChangedStatement = (statementId: string) => {
    return changedStatements.some(
      (change) => change.statementId === statementId
    );
  };

  const isChangedQualifier = (qualifierId: string) => {
    return changedQualifiers.some(
      (change) => change.qualifierId === qualifierId
    );
  };

  const handleSaveStatementEditing = () => {
    markStatementAsChanged();
    saveEditingStatementValue();
  };

  const handleSaveQualifierEditing = () => {
    markQualifierAsChanged();
    saveEditingQualifierValue();
  };

  const cancelEditingStatementValue = () => {
    setEditingValueWithStatementId(null);
  };

  const cancelEditingQualifierValue = () => {
    setEditingValueWithQualifierId(null);
  };

  const deleteRow = (statementId: string) => {
    if (!window.confirm('Soll das Statement wirklich gelöscht werden?')) {
      return;
    }

    setDeletedStatementIds((prev) => [...prev, statementId]); // nimm alle bisherigen IDs und füge die neue ID hinten hinzu
  };

  const restoreRow = (statementId: string) => {
    setDeletedStatementIds(
      (previous) => previous.filter((id) => id !== statementId) // behalte alle IDs, die ungleich der statementId sind
    );
  };

  const deleteQualifier = (_statementId: string, qualifierId: string) => {
    if (!window.confirm('Soll der Qualifier wirklich gelöscht werden?')) {
      return;
    }

    setDeletedQualifierIds((previous) => [...previous, qualifierId]); // nimm alle bisherigen IDs und füge die neue ID hinten hinzu
  };

  const restoreQualifier = (_statementId: string, qualifierId: string) => {
    setDeletedQualifierIds(
      (previous) => previous.filter((id) => id !== qualifierId) // behalte alle IDs, die ungleich der qualifierId sind
    );
  };

  const restoreOriginalStatementValue = (statementId: string) => {
    const changedStatement = changedStatements.find(
      (change) => change.statementId === statementId
    );

    if (!changedStatement) {
      return;
    }

    setDataSource((previous) =>
      previous.map((group) => ({
        ...group,
        statements: group.statements.map((statement) =>
          statement.statementId === statementId
            ? {
                ...statement,
                value: changedStatement.originalValue,
              }
            : statement
        ),
      }))
    );

    setChangedStatements((previous) =>
      previous.filter((change) => change.statementId !== statementId)
    );
  };

  const restoreOriginalQualifierValue = (qualifierId: string) => {
    const changedQualifier = changedQualifiers.find(
      (change) => change.qualifierId === qualifierId
    );

    if (!changedQualifier) {
      return;
    }

    setDataSource((prev) =>
      prev.map((group) => ({
        ...group,
        statements: group.statements.map((statement) => ({
          ...statement,
          qualifiers: statement.qualifiers.map((qualifier) => {
            if (qualifier.id === qualifierId) {
              return { ...qualifier, value: changedQualifier.originalValue };
            }
            return qualifier;
          }),
        })),
      }))
    );

    setChangedQualifiers((prev) =>
      prev.filter((change) => change.qualifierId !== qualifierId)
    );
  };

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
              <StatementTable
                deletedStatementIds={deletedStatementIds}
                editingValueWithStatementId={editingValueWithStatementId}
                handleEditingStatementValueChange={
                  handleEditingStatementValueChange
                }
                handleSaveStatementEditing={handleSaveStatementEditing}
                cancelEditingStatementValue={cancelEditingQualifierValue}
                restoreRow={restoreRow}
                deleteRow={deleteRow}
                restoreOriginalStatementValue={restoreOriginalStatementValue}
                setEditingValueWithStatementId={setEditingValueWithStatementId}
              />
              {/* <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={(event) => onDragEnd(groupIndex, event)}
              >
                <SortableContext
                  items={group.statements.map((statement) => statement.key)}
                  strategy={verticalListSortingStrategy}
                >
                  <Table
                    columns={statementColumns}
                    dataSource={group.statements}
                    pagination={false}
                    components={{
                      body: {
                        row: SortableStatement,
                      },
                    }}
                    rowKey="key"
                    rowClassName={(record) =>
                      deletedStatementIds.includes(record.statementId)
                        ? 'row-deleted'
                        : isChangedStatement(record.statementId)
                        ? 'row-changed'
                        : ''
                    }
                  />
                </SortableContext>
              </DndContext> */}
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
}
