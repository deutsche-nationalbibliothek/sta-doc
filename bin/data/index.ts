import { API_URL, fetcher } from './fetch';
import {
  parseAllFromRead,
  propertyItemList as propertyItemListParser,
} from './parse';
import { reader } from './read';
import { DataState } from './utils';
import {
  propertiesItemsList as propertiesItemsListWriter,
  writer,
} from './write';

export const DEV = false;

(async () => {
  const fetchRawAndWrite = async () => {
    const data = await fetcher().fetchAll();
    writer(data, DataState.raw).writeAll();
  };

  const parseRawAndWriteParsed = () => {
    const data = parseAllFromRead(reader(DataState.raw));
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
      case 'fetch-properties-items':
        propertiesItemsListWriter(
          propertyItemListParser(await fetcher(API_URL.prod).propertyItemList())
        );
        break;
    }
  }
})();
