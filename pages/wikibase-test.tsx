import { useState } from 'react';

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

import { Table } from 'antd';
import { SortableQualifiers } from '@/features/entity/components/qualifiers/sortable-qualifiers';
import { SortableRow } from '@/features/entity/components/statements/sortable-row';

import type { WikibaseResponse } from '@/types/raw/wikibase';
import type {
  ParsedStatement,
  ParsedStatementGroup,
  Qualifier,
} from '@/types/parsed/wikibase';
// import type { TableColumnsType } from 'antd';

import { EditOutlined } from '@ant-design/icons';
import { Input } from 'antd/lib';

import { parseWikibaseResponse } from '@/bin/data/parse/entities/entity/parse-wikibase-response';

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ParsedStatementGroup[]>([]);
  const [editingValueWithStatementId, setEditingValueWithStatementId] =
    useState<string | null>(null);
  const [currentEditingValue, setCurrentEditingValue] = useState('');

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
    {
      title: 'Property',
      dataIndex: 'propertyId',
      key: 'propertyId',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: ParsedStatement) => {
        if (record.datatype !== 'string') {
          return value;
        }

        if (editingValueWithStatementId === record.statementId) {
          return (
            <Input
              defaultValue={value}
              autoFocus
              onChange={(e) => setCurrentEditingValue(e.target.value)}
            />
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
    {
      title: 'Datatype',
      dataIndex: 'datatype',
      key: 'datatype',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Statement ID',
      dataIndex: 'statementId',
      key: 'statementId',
    },
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
      const res = await fetch(`/doc/api/entities/wikibase?id=${entityId}`);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEntity();
  };

  if (response) {
    console.log(response?.[entityId]?.claims);
  }

  return (
    <main>
      <h1 style={{ marginTop: '3rem' }}>Wikibase-Testseite</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          placeholder="Gib z. B. Q7 or P7 ein."
        />

        <button style={{ marginBottom: '1rem' }} disabled={loading}>
          {loading ? 'Lädt ...' : 'Entity laden'}
        </button>
      </form>

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
