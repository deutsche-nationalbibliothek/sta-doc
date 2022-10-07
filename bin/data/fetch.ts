import { DEV } from '.';
import { entityIndex as parseEntityIndex } from './parse';
import { Name } from './types/name';
import { EntityRaw } from './types/raw/entity';
import { DataState, sparql, writeJSONFileAndType } from './utils';
import { NAMES } from './utils/names';
import { fetchEntity, fetchFields, sparqlQuery } from './wikibase';

const entities = async () => {
  await fetchSparql(sparql.ENTITY_INDEX, NAMES.entityIndex);
  const entries = Object.entries(await parseEntityIndex());
  let entities = {} as EntityRaw;

  console.log('\tFetching', Object.keys(entities).length, 'entities separately');

  for (let i = 0; i < (DEV ? 2 : entries.length); i++) {
    const [entryId] = entries[i];
    const fetchedEntity = await fetchEntity(entryId);
    entities = { ...entities, [entryId]: fetchedEntity };
  }

  writeJSONFileAndType<EntityRaw>(entities, NAMES.entity, DataState.raw);
};

const fields = async () => {
  console.log('\tFetching Fields');

  return writeJSONFileAndType((await fetchFields()).fields, NAMES.fields, DataState.raw);
};

const fetchSparql = async (sparqlQueryString: string, name: Name) => {
  console.log('\tFetching', `${name.type}Raw`);
  return writeJSONFileAndType(
    await sparqlQuery(sparqlQueryString),
    name,
    DataState.raw
  );
};

export const fetchAndWriteRawData = async () => {
  console.log('Data fetching is starting');
  await entities();
  await fields();
  await fetchSparql(sparql.LABELDE, NAMES.labelDe);
  await fetchSparql(sparql.LABELEN, NAMES.labelEn);
  await fetchSparql(sparql.NOTATIONS, NAMES.notation);
  await fetchSparql(sparql.CODINGS, NAMES.coding);
  await fetchSparql(sparql.DESCRIPTIONS, NAMES.description);
  await fetchSparql(sparql.RDARULES, NAMES.rdaRule);
  await fetchSparql(sparql.RDAPROPERTIES, NAMES.rdaProperty);
  console.log('Data fetching has finished');
};
