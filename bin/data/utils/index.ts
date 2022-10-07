import {fetcher, sparqlQueryDispatcher} from './fetch';
import {DataState, readJSONFile, writeJSONFileAndType} from './fs';
import * as sparql from './sparql';

export {
  fetcher,
  writeJSONFileAndType,
  readJSONFile,
  sparqlQueryDispatcher,
  sparql,
  DataState,
};
