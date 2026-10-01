import { useState } from 'react';
import type { WikibaseResponse } from '@/types/raw/wikibase';
import type { DataSourceItem, Qualifier } from '@/types/parsed/wikibase';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: React.FC<Readonly<RowProps>> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  // console.log("props['data-row-key']:", props['data-row-key']);

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

const QualifierItem = ({ qualifier }: { qualifier: Qualifier }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: qualifier.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.3rem',
        border: '1px solid lightgray',
        borderRadius: '10px',
        padding: '0.3rem',
        margin: '0.3rem',
      }}
      {...attributes}
      {...listeners}
    >
      <p style={{ margin: 0 }}>{qualifier.propertyId}:</p>
      <p style={{ margin: 0 }}>{qualifier.value}</p>
    </div>
  );
};

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);

  const onQualifierDragEnd = (
    statementId: string,
    { active, over }: DragEndEvent
  ) => {
    if (!over || active.id === over.id) return;

    setDataSource((prev) =>
      prev.map((item) => {
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
      })
    );
  };

  const sensors = useSensors(
    useSensor(
      PointerSensor
      //   {
      //   activationConstraint: {
      //     // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
      //     distance: 5,
      //   },
      // }
    )
  );

  const columns = [
    {
      title: 'Property',
      dataIndex: 'propertyId',
      key: 'propertyId',
    },
    {
      title: 'Snaktype',
      dataIndex: 'snaktype',
      key: 'snaktype',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
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
      render: (qualifiers: Qualifier[], record: DataSourceItem) =>
        qualifiers.length > 0 ? (
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={(e) => {
              onQualifierDragEnd(record.key, e);
            }}
          >
            <SortableContext
              items={qualifiers.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {qualifiers.map((qualifier) => (
                <QualifierItem key={qualifier.id} qualifier={qualifier} />
              ))}
            </SortableContext>
          </DndContext>
        ) : null,
    },
  ];

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
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

      const newDataSource = data?.[entityId]?.claims
        ? Object.entries(data[entityId].claims).flatMap(
            ([propertyId, statements]) =>
              statements.map((statement) => ({
                key: statement.id,
                propertyId,
                snaktype: statement.mainsnak.snaktype,
                value:
                  typeof statement.mainsnak.datavalue?.value === 'string'
                    ? statement.mainsnak.datavalue.value
                    : statement.mainsnak.datavalue?.value.id,
                datatype: statement.mainsnak.datatype,
                type: statement.type,
                statementId: statement.id,

                qualifiers: Object.entries(statement.qualifiers ?? {}).flatMap(
                  ([qualifierPropertyId, qualifiers]) =>
                    qualifiers.map((qualifier, qualifierIndex) => ({
                      id: `${statement.id}-${qualifierPropertyId}-${qualifierIndex}`,
                      propertyId: qualifierPropertyId,
                      snaktype: qualifier.snaktype,
                      value:
                        typeof qualifier.datavalue?.value === 'string'
                          ? qualifier.datavalue.value
                          : qualifier.datavalue?.value?.id ?? '',

                      datatype: qualifier.datatype,
                    }))
                ),
              }))
          )
        : [];

      console.log();

      setDataSource(newDataSource);
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
        {response ? (
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={dataSource.map((i) => i.key)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                components={{
                  body: {
                    row: Row,
                  },
                }}
                rowKey="key"
              />
            </SortableContext>
          </DndContext>
        ) : (
          'Noch keine Daten geladen.'
        )}
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

/* selbst geschriebene Tabelle, später mit Antd Table ersetzt */

{
  /* <div className="claims-table-wrapper">
        {response ? (
          <table className="claims-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Snaktype</th>
                <th>Value</th>
                <th>Datatype</th>
                <th>Type</th>
                <th>Statement ID</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(response?.[entityId]?.claims).map(
                ([propertyId, statements]) =>
                  statements.map((statement) => (
                    <tr key={statement.id}>
                      <td>{propertyId}</td>
                      <td>{statement.mainsnak.snaktype}</td>
                      <td>
                        {typeof statement.mainsnak.datavalue.value === 'string'
                          ? statement.mainsnak.datavalue.value
                          : statement.mainsnak.datavalue.value.id}
                      </td>
                      <td>{statement.mainsnak.datatype}</td>
                      <td>{statement.type}</td>
                      <td>{statement.id}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        ) : (
          'Noch keine Daten geladen.'
        )}
      </div> */
}
