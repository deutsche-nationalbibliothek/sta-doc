import { useState } from 'react';
import { fetcher } from '@/bin/data/fetcher';

export default function WikibaseTest() {
  const [entityId, setEntityId] = useState('');
  const [result, setResult] = useState(null);

  const handleFetch = async () => {
    // const wikibaseData = fetcher();
    console.log(entityId);
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

      <pre>{/*JSON Response*/}</pre>
    </main>
  );
}
