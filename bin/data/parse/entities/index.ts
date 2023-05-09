import { GetRawEntityById } from '..';
import { EntityId } from '../../../../types/entity-id';
import { Codings } from '../../../../types/parsed/coding';
import { Fields } from '../../../../types/parsed/field';
import { EntitiesEntries } from '../../../../types/parsed/entity';
import { Schemas } from '../../../../types/parsed/schema';
import { LabelsDe } from '../../../../types/parsed/label-de';
import { LabelsEn } from '../../../../types/parsed/label-en';
import { StaNotations } from '../../../../types/parsed/sta-notation';
import { EntitiesRaw } from '../../../../types/raw/entity';
import { parseRawEntity } from './entity';
import { RdaElementStatuses } from '../../../../types/parsed/rda-element-status';

export interface ParseEntitiesProps {
  data: ParseEntitiesData;
  getRawEntityById: GetRawEntityById;
  rawEntities: Partial<EntitiesRaw>;
}

export interface ParseEntitiesData {
  labelsEn: LabelsEn;
  labelsDe: LabelsDe;
  codings: Codings;
  staNotations: StaNotations;
  schemas: Schemas;
  fields: Fields;
  rdaElementStatuses: RdaElementStatuses;
}

export const parseEntities = ({
  data,
  getRawEntityById,
  rawEntities,
}: ParseEntitiesProps) => {
  console.log('\tParsing Entities');
  const keys = Object.keys(rawEntities) as EntityId[];
  const entitiesParsed: EntitiesEntries = keys.reduce(
    (acc, entityId: EntityId) => {
      if (entityId in data.staNotations || entityId === 'Q10177') {
        const entityEntry = parseRawEntity({
          entityId,
          data,
          getRawEntityById,
        });
        if (entityEntry) {
          const nextAcc = acc;
          nextAcc[entityId] = entityEntry;
          return nextAcc;
        }
      }
      return acc;
    },
    {} as EntitiesEntries
  );

  return entitiesParsed;
};
