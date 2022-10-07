import { fetchAndWriteRawData } from './fetch';
import { parseRawData } from './parse';
import { readRawData } from './read';

export const DEV = false;

(async () => {
  if (process.argv.length === 2) {
    await fetchAndWriteRawData();
    parseRawData();
  } else if (process.argv[2]) {
    switch (process.argv[2]) {
      case 'fetch': {
        return await fetchAndWriteRawData();
      }
      case 'read': {
        return readRawData();
      }
      case 'parse': {
        return parseRawData();
      }
    }
  }
})();
