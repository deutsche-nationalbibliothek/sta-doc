import fs from 'fs';
import { initial } from 'lodash';
import { Name } from '../types/name';

export enum DataState {
  raw = 'raw',
  parsed = 'parsed',
}

export const writeFile = (data: string, filePath: string) => {
  const path = initial(filePath.split('/')).join('/');
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(filePath, data);
};

const fileName = (name: Name, singular = false) =>
  singular
    ? name.file.singular
    : `${name.file.plural ?? name.file.singular + 's'}`;

export const writeJSONFile = <T>(
  data: T,
  name: Name,
  state: DataState
): void => {
  const jsonFilePathPostfix = `${state}/${fileName(name)}`;
  writeFile(JSON.stringify(data), `data/${jsonFilePathPostfix}.json`);
};

export const readJSONFile = <T>(name: Name, state: DataState): T => {
  return JSON.parse(
    fs.readFileSync(`data/${state}/${fileName(name)}.json`, {
      encoding: 'utf8',
    })
  );
};
