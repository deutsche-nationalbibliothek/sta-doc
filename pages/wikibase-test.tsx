import { ChangeEvent, useEffect, useMemo, useState } from 'react';
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

import { Select, Table } from 'antd';
import { SortableQualifiers } from '@/features/entity/components/qualifiers/sortable-qualifiers';
import { SortableRow } from '@/features/entity/components/statements/sortable-row';

import type { WikibaseResponse } from '@/types/raw/wikibase';
import type {
  ParsedStatement,
  ParsedStatementGroup,
  Qualifier,
} from '@/types/parsed/wikibase';
// import type { TableColumnsType } from 'antd';

import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Input } from 'antd/lib';

import { parseWikibaseResponse } from '@/bin/data/parse/entities/entity/parse-wikibase-response';
import { fuzzyLabelMatchScore } from '@/utils/fuzzy-label-match';

type IdLookup = Record<string, string>;

const formatEntityId = (id: string, idLookup: IdLookup | null) => {
  if (!idLookup) {
    return id;
  }
  const label = idLookup[id];
  return label ? `${label} (${id})` : id;
};

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ParsedStatementGroup[]>([]);
  const [editingValueWithStatementId, setEditingValueWithStatementId] =
    useState<string | null>(null);
  const [currentEditingValue, setCurrentEditingValue] = useState('');
  const [changedStatementIds, setChangedStatementIds] = useState<string[]>([]);
  const [idLookup, setIdLookup] = useState<IdLookup | null>(null);
  const [pickedEntityIds, setPickedEntityIds] = useState<string[]>([]);
  const [idSearchOptions, setIdSearchOptions] = useState<
    { value: string; label: string }[]
  >([]);

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

  const statementColumns = [
    { title: '', key: 'drag-handle', width: 40, render: () => null },
    // {
    //   title: 'Property',
    //   dataIndex: 'propertyId',
    //   key: 'propertyId',
    // },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: ParsedStatement) => {
        if (record.datatype !== 'string') {
          return formatEntityId(value, idLookup);
        }

        if (editingValueWithStatementId === record.statementId) {
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Input
                defaultValue={value}
                autoFocus
                onChange={handleEditingValueChange}
              />
              <CheckOutlined
                onClick={handleSaveEditing}
                style={{ cursor: 'pointer' }}
              />
              <CloseOutlined
                onClick={cancelEditingValue}
                style={{ cursor: 'pointer' }}
              />
            </div>
          );
        }

        return (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {value}
            <EditOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setEditingValueWithStatementId(record.statementId);
                setCurrentEditingValue(value);
              }}
            />
          </span>
        );
      },
    },
    // {
    //   title: 'Datatype',
    //   dataIndex: 'datatype',
    //   key: 'datatype',
    // },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   key: 'type',
    // },
    // {
    //   title: 'Statement ID',
    //   dataIndex: 'statementId',
    //   key: 'statementId',
    // },
    {
      title: 'Qualifiers',
      dataIndex: 'qualifiers',
      key: 'qualifiers',
      render: (qualifiers: Qualifier[], record: ParsedStatement) =>
        qualifiers.length > 0 ? (
          <SortableQualifiers
            qualifiers={qualifiers}
            statementId={record.key}
            onQualifierDragEnd={onQualifierDragEnd}
            idLookup={idLookup}
          />
        ) : null,
    },
  ];

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

    console.log('activeId and overId:', active.id, over?.id);
  };

  const fetchEntity = async () => {
    setLoading(true);

    try {
      const [wikibaseRes, parsedRes, lookupRes] = await Promise.all([
        fetch(`/doc/api/entities/wikibase?id=${entityId}`),
        fetch(`/doc/api/entities/${entityId}`),
        fetch(`/doc/api/entities/id-lookup`),
      ]);

      const data: WikibaseResponse = await wikibaseRes.json();
      const resParsed = await parsedRes.json();
      const lookup: IdLookup = await lookupRes.json();

      console.log('resParsed:', resParsed);
      console.log('data:', data);
      setResponse(data);
      setIdLookup(lookup);

      setDataSource(parseWikibaseResponse(data, entityId));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditingValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentEditingValue(e.target.value);
  };

  const saveEditingValue = () => {
    const newDataSource = dataSource.map((group) => ({
      ...group,
      statements: group.statements.map((statement) => {
        if (statement.statementId === editingValueWithStatementId) {
          return { ...statement, value: currentEditingValue };
        }
        return statement;
      }),
    }));

    setDataSource(newDataSource);
    setEditingValueWithStatementId(null);
  };

  const markStatementAsChanged = () => {
    if (!editingValueWithStatementId) return;

    setChangedStatementIds((previous) => {
      if (previous.includes(editingValueWithStatementId)) {
        return previous;
      }

      return [...previous, editingValueWithStatementId];
    });
  };

  const isChangedStatement = (statementId: string) => {
    return changedStatementIds.includes(statementId);
  };

  const handleSaveEditing = () => {
    markStatementAsChanged();
    saveEditingValue();
  };

  const cancelEditingValue = () => {
    setEditingValueWithStatementId(null);
  };

  if (response) {
    console.log(response?.[entityId]?.claims);
  }

  return (
    <main>
      <h1 style={{ marginTop: '3rem' }}>Wikibase-Testseite</h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-start',
          maxWidth: '960px',
        }}
      >
        <Input.Search
          className="entity-search"
          type="text"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          onSearch={fetchEntity}
          placeholder="Gib z. B. Q7 or P7 ein."
          enterButton={loading ? 'Lädt ...' : 'Entity laden'}
          style={{ flex: '1 1 280px', maxWidth: '400px' }}
          disabled={loading}
        />

        <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={false}
          value={pickedEntityIds}
          placeholder="P- oder Q-IDs bzw. Labels suchen …"
          notFoundContent={
            idLookup ? 'Keine Treffer' : 'Lookup wird geladen …'
          }
          options={idSelectOptions}
          onSearch={searchEntityIds}
          onChange={(values) => setPickedEntityIds(values)}
          optionLabelProp="label"
          style={{ flex: '2 1 360px', minWidth: '280px' }}
          disabled={!idLookup}
        />
      </div>

      <h2 style={{ marginTop: '3rem' }}>Tabellarische Response-Werte</h2>

      <div>
        {response
          ? dataSource.map((group, groupIndex) => (
              <div key={group.propertyId} style={{ marginBottom: '3rem' }}>
                <h3>{formatEntityId(group.propertyId, idLookup)}</h3>
                <DndContext
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
                          row: SortableRow,
                        },
                      }}
                      rowKey="key"
                      rowClassName={(record) =>
                        isChangedStatement(record.statementId)
                          ? 'row-changed'
                          : ''
                      }
                    />
                  </SortableContext>
                </DndContext>
              </div>
            ))
          : 'Noch keine Daten geladen.'}
      </div>

      <h2 style={{ marginTop: '3rem' }}>Vollständige Response als JSON</h2>

      <pre style={{ marginTop: '1rem' }}>
        {response
          ? JSON.stringify(response, null, 2)
          : 'Noch keine Daten geladen.'}
      </pre>
    </main>
  );
}
