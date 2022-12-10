import { EntityId } from '../../../../types/entity-id';
import { Codings } from '../../../../types/parsed/coding';
import { EntitiesEntries } from '../../../../types/parsed/entity';
import { LabelDes } from '../../../../types/parsed/label-de';
import { LabelEns } from '../../../../types/parsed/label-en';
import { Notations } from '../../../../types/parsed/notation';
import { EntityRaw, EntitiesRaw } from '../../../../types/raw/entity';
import { parseRawEntity } from './entity';

export interface ParseEntitiesProps {
  data: {
    lookup_en: LabelEns;
    lookup_de: LabelDes;
    codings: Codings;
    notations: Notations;
  };
  getRawEntityById: (entityId: EntityId) => EntityRaw | undefined;
  rawEntities: Partial<EntitiesRaw>;
}

export const parseEntities = ({
  data,
  getRawEntityById,
  rawEntities,
}: ParseEntitiesProps) => {
  console.log('\tParsing Entities');
  const keys = Object.keys(rawEntities) as EntityId[];
  const entitiesParsed = keys.reduce((acc, entityId: EntityId) => {
    const entityEntry = parseRawEntity({
      entityId,
      data,
      getRawEntityById,
    });
    if (entityEntry) {
      const { entity, headlines } = entityEntry;
      acc[entityId] = { entity, headlines };
    }
    return acc;
  }, {} as EntitiesEntries);

  return entitiesParsed;
};
