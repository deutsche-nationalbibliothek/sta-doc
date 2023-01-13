import { GetRawEntityById } from '..';
import { EntityId } from '../../../../types/entity-id';
import { Codings } from '../../../../types/parsed/coding';
import { EntitiesEntries } from '../../../../types/parsed/entity';
import { LabelDes } from '../../../../types/parsed/label-de';
import { LabelEns } from '../../../../types/parsed/label-en';
import { Notations } from '../../../../types/parsed/notation';
import { EntitiesRaw } from '../../../../types/raw/entity';
import { parseRawEntity } from './entity';

export interface ParseEntitiesProps {
  data: ParseEntitiesData;
  getRawEntityById: GetRawEntityById;
  rawEntities: Partial<EntitiesRaw>;
}

export interface ParseEntitiesData {
  lookup_en: LabelEns;
  lookup_de: LabelDes;
  codings: Codings;
  notations: Notations;
}

export const parseEntities = async ({
  data,
  getRawEntityById,
  rawEntities,
}: ParseEntitiesProps) => {
  console.log('\tParsing Entities');
  const keys = Object.keys(rawEntities) as EntityId[];
  const entitiesParsed: EntitiesEntries = await keys.reduce(
    async (acc, entityId: EntityId) => {
      const entityEntry = parseRawEntity({
        entityId,
        data,
        getRawEntityById,
      });
      if (entityEntry) {
        const nextAcc = await acc;
        nextAcc[entityId] = entityEntry;
        return nextAcc;
      }
      return await acc;
    },
    {} as Promise<EntitiesEntries>
  );

  return entitiesParsed;
};
