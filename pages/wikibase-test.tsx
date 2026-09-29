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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';

type EntityValue = {
  'entity-type': string;
  'numeric-id': number;
  id: string;
};

type Snak = {
  snaktype: string;
  property: string;
  hash: string;
  datavalue?: {
    value: string | EntityValue;
    type: string;
  };
  datatype: string;
};

type Statement = {
  mainsnak: Snak;
  type: string;
  id: string;
  rank: string;
  qualifiers?: Record<string, Snak[]>;
};

type WikibaseResponse = {
  [key: string]: {
    claims: Record<string, Statement[]>;
  };
};

type Qualifier = {
  propertyId: string;
  snaktype: string;
  value: string;
  datatype: string;
};

type DataSourceItem = {
  key: string;
  propertyId: string;
  snaktype: string;
  value: string | undefined;
  datatype: string;
  type: string;
  statementId: string;
  qualifiers: Qualifier[];
};

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

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);

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
      render: (qualifiers: Qualifier[]) =>
        qualifiers.length > 0
          ? qualifiers.map((qualifier, index) => (
              <div key={`${qualifier.propertyId}-${index}`}>
                {qualifier.propertyId}: {qualifier.value}
              </div>
            ))
          : null,
    },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const fetchEntity = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/doc/api/entities/wikibase?id=${entityId}`);
      const data = await res.json();

      const newDataSource = response?.[entityId]?.claims
        ? Object.entries(response[entityId].claims).flatMap(
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
                    qualifiers.map((qualifier) => ({
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

      console.log(data);
      setResponse(data);
      setDataSource(newDataSource);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.prevent.default();
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
        ></input>

        <button
          style={{ marginBottom: '1rem' }}
          onClick={fetchEntity}
          disabled={loading}
        >
          {loading ? 'Lädt ...' : 'Entity laden'}
        </button>
      </form>

      <h2 style={{ marginTop: '3rem' }}>Tabellarische Response-Werte</h2>

      <div>
        {response ? (
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        ) : (
          'Noch keine Daten geladen'
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
