import { useState } from 'react';

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [result, setResult] = useState(null);

  const handleFetch = async () => {
    const res = await fetch(`/api/wikibase?id=${entityId}`);
    const data = await res.json();
    console.log(data);
    return data;
  };

  return (
    <main>
      <h1>Wikibase Test</h1>

      <input
        type="text"
        value={entityId}
        onChange={(e) => setEntityId(e.target.value)}
        placeholder="insert a Q- or P-value"
      />

      <button style={{ marginBottom: '1rem' }} onClick={handleFetch}>
        Fetch Wikibase Data
      </button>

      <h2>Response</h2>

      <pre>JSON response</pre>
    </main>
  );
}
