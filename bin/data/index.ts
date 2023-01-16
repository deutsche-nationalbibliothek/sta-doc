import { EntityId } from '../../types/entity-id';
import { API_URL, fetcher } from './fetch';
import {
  codingsParser,
  entitiesParser,
  labelsParser,
  notationsParser,
  staNotationsParser,
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

  const parseSingleEntity = (entityId: EntityId) => {
    console.log(
      'parsed Values will not get written, used just for runtime debugging'
    );
    const read = reader(DataState.raw);
    entitiesParser.single(
      entityId,
      read.entities.single(entityId),
      (entityId: EntityId) => read.entities.single(entityId),
      {
        lookup_de: labelsParser.de(read.labels.de()),
        lookup_en: labelsParser.en(read.labels.en()),
        codings: codingsParser(read.codings()),
        notations: notationsParser(read.notations()),
        staNotations: staNotationsParser(read.staNotations()),
      }
    );
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
        if (process.argv[3]) {
          parseSingleEntity(process.argv[3] as EntityId);
        } else {
          parseRawAndWriteParsed();
        }
        break;
      case 'fetch-properties-items':
        propertiesItemsListWriter(
          propertyItemListParser(await fetcher(API_URL.prod).propertyItemList())
        );
        break;
    }
  }
})();
