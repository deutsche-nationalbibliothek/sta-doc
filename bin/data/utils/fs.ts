import fs from 'fs';
import JsonToTs from 'json-to-ts';
import { initial } from 'lodash';
import { Name } from '../types/name';

export enum DataState {
  raw = 'raw',
  parsed = 'parsed',
}

const writeFile = (data: string, filePath: string) => {
  const path = initial(filePath.split('/')).join('/');
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(filePath, data);
};

const writeTypeDefinitionFile = (
  types: string[],
  filePath: string,
  state: DataState
) => {
  const [rootType, ...otherTypes] = types;
  const indexableType = [
    rootType.replace(
      /interface (.*) {/,
      (_match, rootName) =>
        `export interface ${rootName} extends Indexable<${rootName}> {`
    ),
    ...otherTypes,
  ];
  writeFile(
    indexableType.join('\n\n'),
    state === DataState.parsed
      ? `types/generated/${filePath}.ts`
      : `bin/data/types/${state}/${filePath}.ts`
  );
};

const fileName = (name: Name, singular = false) =>
  singular
    ? name.file.singular
    : `${name.file.plural ?? name.file.singular + 's'}`;

export const writeJSONFileAndType = <T>(
  data: T,
  name: Name,
  state: DataState
): void => {
  const jsonFilePathPostfix = `${state}/${fileName(name)}`;
  writeFile(JSON.stringify(data), `data/${jsonFilePathPostfix}.json`);
  writeTypeDefinitionFile(
    JsonToTs(data, {
      rootName: state === DataState.raw ? `${name.type}Raw` : name.type,
    }),
    `${fileName(name, true)}`,
    state
  );
};

export const readJSONFile = <T>(name: Name, state: DataState): T => {
  return JSON.parse(
    fs.readFileSync(`data/${state}/${fileName(name)}.json`, {
      encoding: 'utf8',
    })
  );
};
