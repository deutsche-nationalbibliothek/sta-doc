import { GetRawEntityById } from '..';
import { EntityId } from '../../../../types/entity-id';
import { Codings } from '../../../../types/parsed/coding';
import { PropertyTypes } from '../../../../types/parsed/property-type';
import { Fields } from '../../../../types/parsed/field';
import { EntitiesEntries } from '../../../../types/parsed/entity';
import { Schemas } from '../../../../types/parsed/schema';
import { LabelsDe } from '../../../../types/parsed/label-de';
import { LabelsEn } from '../../../../types/parsed/label-en';
import { LabelsFr } from '../../../../types/parsed/label-fr';
import { StaNotations } from '../../../../types/parsed/sta-notation';
import { EntitiesRaw } from '../../../../types/raw/entity';
import { parseRawEntity } from './entity';
import { RdaElementStatuses } from '../../../../types/parsed/rda-element-status';
import { Item } from '../../../../types/item';
import { Breadcrumbs } from '../../../../types/parsed/breadcrumb';

export interface ParseEntitiesProps {
  data: ParseEntitiesData;
  getRawEntityById: GetRawEntityById;
  lang: string;
  rawEntities: Partial<EntitiesRaw>;
}

export interface ParseEntitiesData {
  breadcrumbs: Breadcrumbs;
  codings: Codings;
  fields: Fields;
  labelsDe: LabelsDe;
  labelsEn: LabelsEn;
  labelsFr: LabelsFr;
  propertyTypes: PropertyTypes;
  rdaElementStatuses: RdaElementStatuses;
  staNotations: StaNotations;
  schemas: Schemas;
}

export const parseEntities = ({
  data,
  getRawEntityById,
  rawEntities,
  lang
}: ParseEntitiesProps) => {
  console.log('\tParsing Entities ',lang);
  const keys = Object.keys(rawEntities) as EntityId[];
  const entitiesParsed: EntitiesEntries = keys.reduce(
    (acc, entityId: EntityId) => {
      if (
        entityId in data.staNotations ||
        entityId ===
          Item['Documentation-platform-of-the-standardization-committee']
      ) {
        console.log('Parse raw Entity')
        const entityEntry = parseRawEntity({
          data,
          entityId,
          getRawEntityById,
          lang,
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
