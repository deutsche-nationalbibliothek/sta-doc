import fs from 'fs';
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
  // try {
  //   // lib does not work well with Entity dataset
  //   if (name.type !== 'Entity') {
  //     writeTypeDefinitionFile(
  //       JsonToTs(data, {
  //         rootName: state === DataState.raw ? `${name.type}Raw` : name.type,
  //       }),
  //       `${fileName(name, true)}`,
  //       state
  //     );
  //   }
  // } catch {
  //   const d = data;
  //   debugger;
  // }
};

export const readJSONFile = <T>(name: Name, state: DataState): T => {
  return JSON.parse(
    fs.readFileSync(`data/${state}/${fileName(name)}.json`, {
      encoding: 'utf8',
    })
  );
};
