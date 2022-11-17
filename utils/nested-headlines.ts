import { Headline, NestedHeadline } from "@/types/headline";

const treeItem = ({ label, key }: Headline) => {
  return {
    title: label,
    key: key,
  };
};

export const nestedHeadlines = (headlines: Headline[]) => {
  return headlines
    .filter((headline) => headline.level > 1)
    .reduce(
      (acc, headline) => {
        if (acc.lastSeenLevel === headline.level) {
          if (acc.currentPointer) {
            acc.currentPointer.push(treeItem(headline));
            return acc;
          } else {
            acc.currentPointer = acc.headlines;
            acc.headlines.push(treeItem(headline));
          }
        } else if (acc.lastSeenLevel < headline.level) {
          acc.currentPointer[acc.currentPointer.length - 1].children = [
            treeItem(headline),
          ];
          acc.currentPointer =
            acc.currentPointer[acc.currentPointer.length - 1].children;
        } else {
          acc.currentPointer = new Array(headline.level - acc.initialLevel)
            .fill(null)
            .reduce((acc1) => acc1[acc1.length - 1].children, acc.headlines);
          acc.currentPointer.push(treeItem(headline));
        }
        acc.lastSeenLevel = headline.level;
        return acc;
      },
      {
        initialLevel: 2,
        lastSeenLevel: 2,
        headlines: [] as NestedHeadline[],
        currentPointer: undefined,
      }
    );
};
