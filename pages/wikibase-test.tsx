import { ChangeEvent, useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';

import { useIsEdit } from '@/hooks/use-is-edit';
import { useQueryParam } from 'use-query-params';

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

import { Table, Input, Segmented, Button } from 'antd';
import { SortableQualifiers } from '@/features/entity/components/qualifiers/sortable-qualifiers';
import { SortableRow } from '@/features/entity/components/statements/sortable-row';
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';

import type { WikibaseResponse } from '@/types/raw/wikibase';
import type {
  ParsedStatement,
  ParsedStatementGroup,
  Qualifier,
  StatementChange,
} from '@/types/parsed/wikibase';

import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

import { parseWikibaseResponse } from '@/bin/data/parse/entities/entity/parse-wikibase-response';

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ParsedStatementGroup[]>([]);
  const [editingValueWithStatementId, setEditingValueWithStatementId] =
    useState<string | null>(null);
  const [currentEditingValue, setCurrentEditingValue] = useState('');
  const [originalEditingValue, setOriginalEditingValue] = useState('');
  const [deletedStatementIds, setDeletedStatementIds] = useState<string[]>([]);
  const [changedStatements, setChangedStatements] = useState<StatementChange[]>(
    []
  );

  const [mode, setMode] = useQueryParam('live');

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

  const { TextArea } = Input;

  const statementColumns: ColumnsType<ParsedStatement> = [
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
        // record ist komplettes Statement, also Row (ist ein Objekt)
        const isDeleted = deletedStatementIds.includes(record.statementId);

        if (isDeleted) {
          return value;
        }

        if (record.datatype !== 'string') {
          return value;
        }

        if (editingValueWithStatementId === record.statementId) {
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TextArea
                rows={4}
                defaultValue={value}
                autoFocus
                onChange={handleEditingValueChange}
              />
              <CheckOutlined
                onClick={handleSaveStatementEditing}
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
                setOriginalEditingValue(value);
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
          />
        ) : null,
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_value, record) => {
        const isDeleted = deletedStatementIds.includes(record.statementId);

        return isDeleted ? (
          <RollbackOutlined
            onClick={() => {
              restoreRow(record.statementId);
            }}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <span>
            <DeleteOutlined
              onClick={() => {
                deleteRow(record.statementId);
              }}
              style={{ cursor: 'pointer' }}
            />
          </span>
        );
      },
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
  };

  const fetchEntity = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/doc/api/entities/wikibase?id=${entityId}`);

      if (!res.ok) {
        const error = await res.text(); // liest den response body aus
        console.error('API Error:', res.status, error);
        return;
      }

      const data: WikibaseResponse = await res.json();

      console.log('data:', data);
      setResponse(data);

      setDataSource(parseWikibaseResponse(data, entityId));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditingValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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

    setChangedStatements((previous) => {
      // previous = das komplette changedStatements Array
      // existingChange ist ein Eintrag in dem Array
      const existingChange = previous.find(
        (change) => change.statementId === editingValueWithStatementId
      );

      if (existingChange) {
        return previous.map((change) => {
          if (change.statementId === editingValueWithStatementId) {
            return {
              statementId: editingValueWithStatementId,
              originalValue: change.originalValue,
              newValue: currentEditingValue,
            };
          }

          return change;
        });
      }

      return [
        ...previous,
        {
          statementId: editingValueWithStatementId,
          originalValue: originalEditingValue,
          newValue: currentEditingValue,
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

  const handleSaveStatementEditing = () => {
    markStatementAsChanged();
    saveEditingValue();
  };

  const cancelEditingValue = () => {
    setEditingValueWithStatementId(null);
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

  // if (response) {
  //   console.log(response?.[entityId]?.claims);
  // }

  const options = [
    { value: 'edit', label: 'Edit' },
    { value: 'live', label: 'Live' },
  ];

  return (
    <main>
      <h1 style={{ marginTop: '3rem' }}>Wikibase-Testseite</h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Segmented
          options={options}
          value={mode}
          onChange={(value) => setMode(value)}
        />
        <Input.Search
          className="entity-search"
          type="text"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          onSearch={fetchEntity}
          placeholder="Gib z. B. Q7 or P7 ein."
          enterButton={loading ? 'Lädt ...' : 'Entity laden'}
          style={{ maxWidth: '400px' }}
          disabled={loading}
        />

        {changedStatements.length > 0 ? (
          <Button>Alle Änderungen ins Backend speichern</Button>
        ) : null}
      </div>

      <h2 style={{ marginTop: '3rem' }}>Tabellarische Response-Werte</h2>

      <div>
        {response
          ? dataSource.map((group, groupIndex) => (
              <div key={group.propertyId} style={{ marginBottom: '3rem' }}>
                <h3>{group.propertyId}</h3>
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
                        deletedStatementIds.includes(record.statementId)
                          ? 'row-deleted'
                          : isChangedStatement(record.statementId)
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
