import { parseEntitiesDataFromParsed } from '@/bin/data/parse';
import {
  parseEntities,
  ParseEntitiesData,
} from '@/bin/data/parse/entities';
import { reader } from '@/bin/data/read';
import { prefetchEmbeddedEntities } from '@/bin/data/utils/embedded-entity-ids';
import { ViewRawResponse } from '@/lib/api/editor-server-client';
import { EntityId } from '@/types/entity-id';
import { EntityEntry } from '@/types/parsed/entity';
import { StaNotations } from '@/types/parsed/sta-notation';
import { EntitiesRaw } from '@/types/raw/entity';

function overlayStaNotations(
  data: ParseEntitiesData,
  staNotations: Record<string, string>
): ParseEntitiesData {
  const merged: StaNotations = { ...data.staNotations };
  for (const [entityId, notation] of Object.entries(staNotations)) {
    if (!(entityId in merged)) {
      merged[entityId as EntityId] = {
        label: notation.toUpperCase(),
        id: entityId as EntityId,
      };
    }
  }
  return { ...data, staNotations: merged };
}

/**
 * Converts editor view-raw (Postgres compatibility export) into a parsed EntityEntry
 * using the existing sta-doc parse pipeline and static sidecar catalogs.
 */
export async function viewRawToEntityEntry(
  viewRaw: ViewRawResponse,
  rootEntityId: EntityId,
  lang: string
): Promise<EntityEntry | undefined> {
  const prefetched = viewRaw.entities as EntitiesRaw;
  const rootRaw = prefetched[rootEntityId];
  if (!rootRaw) {
    return undefined;
  }

  // Sidecar catalogs from data/parsed (not SPARQL raw) — required for BFF stage reads.
  const data = overlayStaNotations(
    parseEntitiesDataFromParsed(reader.parsed, lang),
    viewRaw.staNotations
  );

  await prefetchEmbeddedEntities({
    entityId: rootEntityId,
    getRawEntityById: async (entityId) => prefetched[entityId],
  });

  const parsed = parseEntities({
    data,
    getRawEntityById: (entityId) => prefetched[entityId],
    rawEntities: { [rootEntityId]: rootRaw },
    lang,
  });

  return parsed[rootEntityId];
}
