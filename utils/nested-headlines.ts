import { Headline, NestedHeadlines } from '@/types/headline';
import { Namespace } from '@/types/namespace';

const treeItem = (
  { title, key, namespace }: Headline,
  lastSeenNamespace?: Namespace
) => {
  return {
    title,
    key,
    namespace: namespace ?? lastSeenNamespace,
  };
};

export const nestedHeadlines = (
  headlines: Headline[],
  entityNamespace?: Namespace
) => {
  if (!headlines) {
    return [];
  }
  // filter top-level headline
  const filteredHeadlines = headlines.filter((headline) => headline.level > 1);

  if (filteredHeadlines.length === 0) {
    return [];
  }

  const j = filteredHeadlines.reduce(
    (acc, headline) => {
      if (acc.lastSeenLevel === headline.level) {
        if (acc.currentPointer) {
          acc.currentPointer.push(treeItem(headline, acc.lastSeenNamespace));
          return acc;
        } else {
          acc.currentPointer = acc.headlines;
          acc.headlines.push(treeItem(headline, acc.lastSeenNamespace));
        }
      } else if (acc.lastSeenLevel < headline.level) {
        acc.currentPointer[acc.currentPointer.length - 1].children = [
          treeItem(headline, acc.lastSeenNamespace),
        ];
        acc.currentPointer =
          acc.currentPointer[acc.currentPointer.length - 1].children;
      } else {
        acc.currentPointer = new Array(headline.level - acc.initialLevel)
          .fill(null)
          .reduce((acc1) => acc1[acc1.length - 1].children, acc.headlines);
        acc.currentPointer.push(treeItem(headline, acc.lastSeenNamespace));
      }
      acc.lastSeenLevel = headline.level;
      return acc;
    },
    {
      // todo, initialLevel and lastSeenLevel should be 2 on init
      // quickfix, since some entities have wrong headline parsing
      initialLevel: filteredHeadlines[0].level,
      lastSeenLevel: filteredHeadlines[0].level,
      headlines: [] as NestedHeadlines[],
      lastSeenNamespace: entityNamespace,
      currentPointer: undefined,
    }
  );
  console.log(j);
  return j.headlines;
};
