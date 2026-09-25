import { useState } from 'react';

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [response, setResponse] = useState(null);
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

  return (
    <main>
      <h1>Wikibase-Testseite</h1>

      <input
        type="text"
        value={entityId}
        onChange={(e) => setEntityId(e.target.value)}
        placeholder="insert i.e. Q7 or P7"
      ></input>

      <button
        style={{ marginBottom: '1rem' }}
        onClick={fetchEntity}
        disabled={loading}
      >
        {loading ? 'Lädt ...' : 'Entity laden'}
      </button>

      <h2>Response</h2>

      <pre>
        {response
          ? JSON.stringify(response, null, 2)
          : 'Noch keine Daten geladen.'}
      </pre>
    </main>
  );
}
