import { useState } from 'react';
import { Table } from 'antd';

type EntityValue = {
  'entity-type': string;
  'numeric-id': number;
  id: string;
};

type Statement = {
  mainsnak: {
    snaktype: string;
    property: string;
    hash: string;
    datavalue: {
      value: string | EntityValue;
      type: string;
    };
    datatype: string;
  };
  type: string;
  id: string;
  rank: string;
};

type WikibaseResponse = {
  [key: string]: {
    claims: Record<string, Statement[]>;
  };
};

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState<WikibaseResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
  ];

  const dataSource = response?.[entityId]?.claims
    ? Object.entries(response[entityId].claims).flatMap(
        ([propertyId, statements]) =>
          statements.map((statement) => ({
            key: statement.id,
            propertyId,
            snaktype: statement.mainsnak.snaktype,
            value:
              typeof statement.mainsnak.datavalue.value === 'string'
                ? statement.mainsnak.datavalue.value
                : statement.mainsnak.datavalue.value.id,
            datatype: statement.mainsnak.datatype,
            type: statement.type,
            statementId: statement.id,
          }))
      )
    : [];

  const fetchEntity = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/doc/api/entities/wikibase?id=${entityId}`);
      const data = await res.json();

      console.log(data);
      setResponse(data);
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
    console.log(response[entityId].claims);
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

      {/* <div className="claims-table-wrapper">
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
      </div> */}

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
