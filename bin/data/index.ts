import { EntityId } from '../../types/entity-id';
import { EntitiesEntries } from '../../types/parsed/entity';
import { EntitiesRaw } from '../../types/raw/entity';
import { API_URL, fetcher } from './fetcher';
import {
  codingsParser,
  entitiesParser,
  labelsParser,
  staNotationsParser,
  parseAllFromRead,
  propertyItemList as propertyItemListParser,
  propertyTypesParser,
  fieldsParser,
  schemasParser,
  rdaElementStatusesParser,
} from './parse';
import { reader } from './read';
import { DataState } from './utils';
import {
  propertiesItemsList as propertiesItemsListWriter,
  writer,
} from './write';

export const DEV = false;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const fetchRawAndWrite = async () => {
    console.log('Fetch from database: ', API_URL.host);
    const data = await fetcher(API_URL.host).fetchAll();
    console.log('going to write');
    writer.raw(data).writeAll();
  };

  const fetchSingleEntityAndWrite = async (entityId: EntityId) => {
    console.log('Fetch single entity from database: ', API_URL.host);
    console.log('Fetch raw data of entity',entityId);
    const entity = await fetcher(API_URL.host).entities.single(entityId);
    if (entity) {
      const entities: EntitiesRaw = {
        ...reader[DataState.raw].entities.all(),
        ...entity,
      };
      writer.rawSingle(entities)
    }
  }

  const parseRawAndWriteParsed = () => {
    const data = parseAllFromRead(reader[DataState.raw]);
    writer.parsed(data).writeAll();
  };

  const parseRawAndWriteCodings = () => {
    const readRaw = reader[DataState.raw];
    const codings = codingsParser(readRaw.codings())
    const data = { codings: codings }
    writer.parsed(data).codings();
  }

  const parseRawAndWritePropertyTypes = () => {
    const readRaw = reader[DataState.raw];
    const propertyTypes = propertyTypesParser(readRaw.propertyTypes())
    const data = { propertyTypes: propertyTypes }
    writer.parsed(data).propertyTypes();
  }

  const parseRawAndWriteStaNotations = () => {
    const readRaw = reader[DataState.raw];
    const staNotations = staNotationsParser(readRaw.staNotations())
    const data = { staNotations: staNotations }
    writer.parsed(data).staNotations();
  }

  const parseSingleEntity = (entityId: EntityId) => {
    const readRaw = reader[DataState.raw];
    const staNotations = staNotationsParser(readRaw.staNotations());
    const schemas = schemasParser(readRaw.schemas());
    const entity = entitiesParser.single(
      entityId,
      readRaw.entities.single(entityId),
      (entityId: EntityId) => readRaw.entities.single(entityId),
      {
        labelsDe: labelsParser.de(readRaw.labels.de()),
        labelsEn: labelsParser.en(readRaw.labels.en()),
        codings: codingsParser(readRaw.codings()),
        propertyTypes: propertyTypesParser(readRaw.propertyTypes()),
        staNotations,
        schemas,
        fields: fieldsParser(readRaw.fields(), staNotations),
        rdaElementStatuses: rdaElementStatusesParser(
          readRaw.rdaElementStatuses(),
          staNotations,
          schemas
        ),
      }
    );
    if (entity) {
      const entities: EntitiesEntries = {
        ...reader[DataState.parsed].entities.all(),
        ...entity,
      };
      writer.parsed({ entities: { all: entities } }).entities.all();
    }
  };

  if (process.argv.length >= 2 && /data$/.test(process.argv[1])) {
    if (process.argv.length === 2) {
      await fetchRawAndWrite();
      parseRawAndWriteParsed();
    } else if (process.argv.length > 2) {
      switch (process.argv[2]) {
        case 'fetch':
          await fetchRawAndWrite();
          break;
        case 'fetch:single':
          if (process.argv[3]) {
            fetchSingleEntityAndWrite(process.argv[3] as EntityId);
          } else {
            console.warn('Missing EntityId as argument, like: data:fetch:single P395.');
          }
          break;
        case 'parse':
            parseRawAndWriteParsed();
          break;
        case 'parse:single':
          if (process.argv[3]) {
            parseSingleEntity(process.argv[3] as EntityId);
          } else {
            console.warn('Missing EntityId as argument, like: data:parse:single P395.');
          }
          break;
        case 'parse:codings':
          parseRawAndWriteCodings();
        case 'parse:propertyTypes':
          parseRawAndWritePropertyTypes();
        case 'parse:staNotations':
          parseRawAndWriteStaNotations();
        case 'fetch:properties-items':
          propertiesItemsListWriter(
            propertyItemListParser(
              await fetcher(API_URL.host).propertyItemList()
            )
          );
          break;
        default:
          console.warn('No matched subcommand');
      }
    }
  }
})();
