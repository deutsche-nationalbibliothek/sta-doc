import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import type { IdLookup } from '@/types/parsed/wikibase';
import { fuzzyLabelMatchScore } from '@/utils/fuzzy-label-match';
import { formatEntityId } from '@/utils/format-entity-id';

export default function useEntitySearch(idLookup: IdLookup | null) {
    const [idSearchOptions, setIdSearchOptions] = useState<
    { value: string; label: string }[]
  >([]);

 // Debounced autocomplete search over the id lookup. Ranking: exact ID match (3000) > ID prefix (2500) > ID contains (2200) > fuzzy label match. Keeps the best 50 hits.
 const searchEntityIds = useMemo(
    () =>
      debounce((searchText: string) => {
        if (!idLookup) {
          setIdSearchOptions([]);
          return;
        }

        const query = searchText.trim().toLowerCase();
        if (!query) {
          setIdSearchOptions([]);
          return;
        }

        const scored: { value: string; label: string; score: number }[] = [];
        for (const [id, label] of Object.entries(idLookup)) {
          const idLower = id.toLowerCase();
          let score = 0;
          if (idLower === query) {
            score = 3000;
          } else if (idLower.startsWith(query)) {
            score = 2500;
          } else if (idLower.includes(query)) {
            score = 2200;
          } else {
            score = fuzzyLabelMatchScore(query, label);
          }

          if (score > 0) {
            scored.push({
              value: id,
              label: formatEntityId(id, idLookup),
              score,
            });
          }
        }

        scored.sort((a, b) => b.score - a.score);
        setIdSearchOptions(
          scored.slice(0, 50).map(({ value, label }) => ({ value, label }))
        );
      }, 250),
    [idLookup]
  );

  // Cancel a pending search on unmount so it cannot set state afterwards.
  useEffect(() => {
    return () => searchEntityIds.cancel();
  }, [searchEntityIds]);

  return { idSearchOptions, searchEntityIds };
}