import { getElements, getEntity } from '../lib/api';
import * as sparql from '../lib/sparql';
import fs from 'fs';

const DEV = true;

(async () => {
  const fetchEntity = async (entryId: string): Promise<any> => {
    try {
      return await getEntity(entryId);
    } catch {
      console.log('fetchEntity caught error on', entryId);
      // todo, count failures to prevent endless loop
      return await fetchEntity(entryId);
    }
  };

  const entries = Object.entries(await getElements(sparql.ENTRIES));
  const entities = [];
  for (let i = 0; i < (DEV ? 10 : entries.length); i++) {
    const [entryId] = entries[i];
    const fetchedEntity = await fetchEntity(entryId);
    console.log(fetchedEntity);
    entities.push(fetchedEntity);
  }

  fs.writeFile(`data/${DEV ? 'dev_' : ''}entities.json`, JSON.stringify(entities), (error) => {
    if (error) throw error;
  });
})();
