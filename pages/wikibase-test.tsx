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
      <h1>Wikibase-Testseite</h1>

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

      <h2>Tabellarische Response-Werte</h2>

      <div className="claims-table-wrapper">
        {response ? (
          <table className="claims-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Snaktype</th>
                <th>Hash</th>
                <th>Value</th>
                <th>Value Type</th>
                <th>Datatype</th>
                <th>Type</th>
                <th>Statement ID</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(response?.[entityId]?.claims).map(
                ([propertyId, statements]) =>
                  statements.map((statement) => (
                    <tr key={statement.id}>
                      <td>{propertyId}</td>
                      <td>{statement.mainsnak.snaktype}</td>
                      <td>{statement.mainsnak.hash}</td>
                      <td>
                        {typeof statement.mainsnak.datavalue.value === 'string'
                          ? statement.mainsnak.datavalue.value
                          : statement.mainsnak.datavalue.value.id}
                      </td>
                      <td>{statement.mainsnak.datavalue.type}</td>
                      <td>{statement.mainsnak.datatype}</td>
                      <td>{statement.type}</td>
                      <td>{statement.id}</td>
                      <td>{statement.rank}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        ) : (
          'Noch keine Daten geladen.'
        )}
      </div>

      <h2 style={{ marginTop: '1rem' }}>Vollständige Response als JSON</h2>

      <pre style={{ marginTop: '1rem' }}>
        {response
          ? JSON.stringify(response, null, 2)
          : 'Noch keine Daten geladen.'}
      </pre>
    </main>
  );
}
