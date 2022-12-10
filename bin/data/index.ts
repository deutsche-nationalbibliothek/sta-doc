import { fetcher } from './fetch';
import { parser } from './parse';
import { reader } from './read';
import { DataState } from './utils';
import { writer } from './write';

export const DEV = false;

(async () => {
  const fetchRawAndWrite = async () => {
    const data = await fetcher().fetchAll();
    writer(data, DataState.raw).writeAll();
  };

  const parseRawAndWriteParsed = () => {
    const data = parser(reader(DataState.raw)).parseAll();
    writer(data, DataState.parsed).writeAll();
  };

  if (process.argv.length === 2) {
    await fetchRawAndWrite();
    parseRawAndWriteParsed();
  } else if (process.argv[2]) {
    switch (process.argv[2]) {
      case 'fetch':
        await fetchRawAndWrite();
        break;
      case 'parse':
        parseRawAndWriteParsed();
        break;
    }
  }
})();
