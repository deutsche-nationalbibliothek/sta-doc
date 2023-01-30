import { EntityId } from '../../types/entity-id';
import { API_URL, fetcher } from './fetcher';
import {
  codingsParser,
  entitiesParser,
  labelsParser,
  staNotationsParser,
  parseAllFromRead,
  propertyItemList as propertyItemListParser,
  elementsOfParser,
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

  const parseSingleEntity = async (entityId: EntityId) => {
    const readRaw = reader(DataState.raw);
    const entity = await entitiesParser.single(
      entityId,
      readRaw.entities.single(entityId),
      (entityId: EntityId) => readRaw.entities.single(entityId),
      {
        lookup_de: labelsParser.de(readRaw.labels.de()),
        lookup_en: labelsParser.en(readRaw.labels.en()),
        codings: codingsParser(readRaw.codings()),
        staNotations: staNotationsParser(readRaw.staNotations()),
        elementsOf: elementsOfParser(readRaw.elementsOf()),
      }
    );
    const entities = { ...reader(DataState.parsed).entities.all(), ...entity };
    await writer(
      { entities: { all: entities } } as any,
      DataState.parsed
    ).entities.all();
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
