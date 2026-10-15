import type { IdLookup } from '@/types/parsed/wikibase';

export const formatEntityId = (id: string, idLookup: IdLookup | null) => {
    if (!idLookup) {
      return id;
    }
    const label = idLookup[id];
    return label ? `${label} (${id})` : id;
  };