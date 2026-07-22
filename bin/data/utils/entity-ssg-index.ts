import { EntitiesEntries } from '../../../types/parsed/entity';
import {
  EntitySsgIndexEntry,
  EntitySsgIndexFile,
} from '../../../types/parsed/entity-ssg-index';

/** Build lightweight indexes used during Next.js SSG. */
export const buildEntitySsgIndex = (
  entitiesEntries: EntitiesEntries
): EntitySsgIndexFile => {
  const byStaNotation: EntitySsgIndexFile['byStaNotation'] = {};
  const byId: EntitySsgIndexFile['byId'] = {};

  for (const entityEntry of Object.values(entitiesEntries)) {
    const { entity, headlines } = entityEntry;
    if (!entity?.id) {
      continue;
    }

    const entry: EntitySsgIndexEntry = {
      id: entity.id,
      label: entity.label,
      elementOf: entity.elementOf,
      namespace: entity.namespace,
      staNotationLabel: entity.staNotationLabel,
      headlines: headlines ?? [],
    };

    byId[entity.id] = entry;
    if (entity.staNotationLabel) {
      byStaNotation[entity.staNotationLabel] = entry;
    }
  }

  return { byStaNotation, byId };
};
